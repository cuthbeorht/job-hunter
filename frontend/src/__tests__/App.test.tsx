import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from '../App'

vi.mock('../pages/LoginPage', () => ({ default: () => <div>Login Page</div> }))
vi.mock('../pages/RegisterPage', () => ({ default: () => <div>Register Page</div> }))
vi.mock('../pages/ApplicationsPage', () => ({ default: () => <div>Applications Page</div> }))
vi.mock('../pages/ResumePage', () => ({ default: () => <div>Resumes Page</div> }))

// App renders its own BrowserRouter, so tests drive navigation via window.history
// rather than wrapping with a second (MemoryRouter) router.
describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('redirects an unauthenticated user hitting /applications to /login', () => {
    window.history.pushState({}, '', '/applications')
    render(<App />)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('lets an authenticated user reach /applications', () => {
    localStorage.setItem('access_token', 'tok')
    window.history.pushState({}, '', '/applications')
    render(<App />)
    expect(screen.getByText('Applications Page')).toBeInTheDocument()
  })

  it('redirects an unknown path to /login when unauthenticated', () => {
    window.history.pushState({}, '', '/does-not-exist')
    render(<App />)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects an unknown path to /resumes when authenticated', () => {
    localStorage.setItem('access_token', 'tok')
    window.history.pushState({}, '', '/does-not-exist')
    render(<App />)
    expect(screen.getByText('Resumes Page')).toBeInTheDocument()
  })

  it('only renders the nav bar (with Sign Out) when authenticated', () => {
    window.history.pushState({}, '', '/login')
    const { rerender } = render(<App />)
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument()

    localStorage.setItem('access_token', 'tok')
    window.history.pushState({}, '', '/applications')
    rerender(<App />)
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('signing out clears the token and returns to /login', async () => {
    localStorage.setItem('access_token', 'tok')
    window.history.pushState({}, '', '/applications')
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
