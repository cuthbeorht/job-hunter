import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RegisterForm from '../components/auth/RegisterForm'

const { register } = vi.hoisted(() => ({
  register: vi.fn().mockResolvedValue({ id: '1', email: 'user@example.com', created_at: '2026-01-01T00:00:00Z' }),
}))

vi.mock('../api/auth', () => ({ register }))

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
  register.mockClear()
  navigate.mockClear()
})

describe('RegisterForm', () => {
  it('renders email and password fields', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<RegisterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText(/password/i), 'longenoughpass')
    await userEvent.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() => expect(screen.getByText(/invalid email/i)).toBeInTheDocument())
  })

  it('shows validation error for short password', async () => {
    renderWithProviders(<RegisterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() =>
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    )
  })

  it('registers successfully and navigates to /login', async () => {
    renderWithProviders(<RegisterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'longenoughpass')
    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() =>
      expect(register.mock.calls[0]?.[0]).toEqual({ email: 'user@example.com', password: 'longenoughpass' })
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'))
  })

  it('shows an error message when registration fails', async () => {
    register.mockRejectedValueOnce(new Error('conflict'))
    renderWithProviders(<RegisterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'dup@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'longenoughpass')
    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => expect(screen.getByText(/registration failed/i)).toBeInTheDocument())
    expect(navigate).not.toHaveBeenCalled()
  })
})
