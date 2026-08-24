import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import client from '../api/client'

describe('api client interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
    delete (window as { location?: unknown }).location
    window.location = { href: '' } as unknown as Location
  })

  describe('request interceptor', () => {
    const requestInterceptor = client.interceptors.request as unknown as {
      handlers: { fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }[]
    }

    it('attaches an Authorization header when a token is stored', () => {
      localStorage.setItem('access_token', 'tok123')
      const config = requestInterceptor.handlers[0].fulfilled({ headers: {} } as InternalAxiosRequestConfig)
      expect(config.headers.Authorization).toBe('Bearer tok123')
    })

    it('does not attach an Authorization header when no token is stored', () => {
      const config = requestInterceptor.handlers[0].fulfilled({ headers: {} } as InternalAxiosRequestConfig)
      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('response interceptor', () => {
    const responseInterceptor = client.interceptors.response as unknown as {
      handlers: { rejected: (err: AxiosError) => Promise<never> }[]
    }

    it('clears the token and redirects to /login on a 401', async () => {
      localStorage.setItem('access_token', 'tok123')
      const err = { response: { status: 401 } } as AxiosError

      await expect(responseInterceptor.handlers[0].rejected(err)).rejects.toBe(err)
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(window.location.href).toBe('/login')
    })

    it('passes other errors through without touching auth state', async () => {
      localStorage.setItem('access_token', 'tok123')
      const err = { response: { status: 500 } } as AxiosError

      await expect(responseInterceptor.handlers[0].rejected(err)).rejects.toBe(err)
      expect(localStorage.getItem('access_token')).toBe('tok123')
      expect(window.location.href).toBe('')
    })
  })
})
