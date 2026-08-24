import { vi } from 'vitest'
import { login, register } from '../api/auth'

const { get, post, put, del } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}))

vi.mock('../api/client', () => ({
  default: { get, post, put, delete: del },
}))

beforeEach(() => {
  post.mockReset()
})

describe('api/auth', () => {
  it('register posts to /auth/register and unwraps the response data', async () => {
    post.mockResolvedValue({ data: { id: '1', email: 'user@example.com', created_at: '2026-01-01T00:00:00Z' } })
    const result = await register({ email: 'user@example.com', password: 'secret123' })
    expect(post).toHaveBeenCalledWith('/auth/register', { email: 'user@example.com', password: 'secret123' })
    expect(result).toEqual({ id: '1', email: 'user@example.com', created_at: '2026-01-01T00:00:00Z' })
  })

  it('login posts to /auth/login and unwraps the response data', async () => {
    post.mockResolvedValue({ data: { access_token: 'tok', token_type: 'bearer' } })
    const result = await login({ email: 'user@example.com', password: 'secret123' })
    expect(post).toHaveBeenCalledWith('/auth/login', { email: 'user@example.com', password: 'secret123' })
    expect(result).toEqual({ access_token: 'tok', token_type: 'bearer' })
  })
})
