import client from './client'

export interface LoginPayload { email: string; password: string }
export interface TokenResponse { access_token: string; token_type: string }
export interface UserOut { id: string; email: string; created_at: string }

export const register = (data: LoginPayload) =>
  client.post<UserOut>('/auth/register', data).then((r) => r.data)

export const login = (data: LoginPayload) =>
  client.post<TokenResponse>('/auth/login', data).then((r) => r.data)
