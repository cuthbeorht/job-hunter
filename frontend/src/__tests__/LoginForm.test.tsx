import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginForm from '../components/auth/LoginForm'

const { login } = vi.hoisted(() => ({
  login: vi.fn().mockResolvedValue({ access_token: 'tok', token_type: 'bearer' }),
}))

vi.mock('../api/auth', () => ({ login }))

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  login.mockClear()
  navigate.mockClear()
  localStorage.clear()
})

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/invalid email/i)).toBeInTheDocument())
  })

  it('shows validation error when password is empty', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/password is required/i)).toBeInTheDocument())
  })

  it('logs in successfully and navigates to /resumes', async () => {
    renderWithProviders(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(login.mock.calls[0]?.[0]).toEqual({ email: 'user@example.com', password: 'secret123' })
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/resumes'))
    expect(localStorage.getItem('access_token')).toBe('tok')
  })

  it('shows an error message when login fails', async () => {
    login.mockRejectedValueOnce(new Error('bad credentials'))
    renderWithProviders(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument())
    expect(navigate).not.toHaveBeenCalled()
  })
})
