import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { isAuthenticated, useLogin, useLogout, useRegister } from '../hooks/useAuth'

const { login, register } = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
}))

vi.mock('../api/auth', () => ({ login, register }))

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

beforeEach(() => {
  login.mockReset()
  register.mockReset()
  navigate.mockClear()
  localStorage.clear()
})

describe('isAuthenticated', () => {
  it('returns false when there is no stored token', () => {
    expect(isAuthenticated()).toBe(false)
  })

  it('returns true when a token is stored', () => {
    localStorage.setItem('access_token', 'tok')
    expect(isAuthenticated()).toBe(true)
  })
})

describe('useLogin', () => {
  it('stores the token and navigates to /resumes on success', async () => {
    login.mockResolvedValue({ access_token: 'tok', token_type: 'bearer' })
    const { result } = renderHook(() => useLogin(), { wrapper })

    result.current.mutate({ email: 'user@example.com', password: 'secret' })

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/resumes'))
    expect(localStorage.getItem('access_token')).toBe('tok')
  })
})

describe('useRegister', () => {
  it('navigates to /login on success', async () => {
    register.mockResolvedValue({ id: '1', email: 'user@example.com', created_at: '2026-01-01T00:00:00Z' })
    const { result } = renderHook(() => useRegister(), { wrapper })

    result.current.mutate({ email: 'user@example.com', password: 'secret123' })

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'))
  })
})

describe('useLogout', () => {
  it('clears the token and navigates to /login', () => {
    localStorage.setItem('access_token', 'tok')
    const { result } = renderHook(() => useLogout(), { wrapper })

    result.current()

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(navigate).toHaveBeenCalledWith('/login')
  })
})
