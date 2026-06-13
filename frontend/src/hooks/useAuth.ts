import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'

export function useLogin() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      navigate('/resumes')
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => navigate('/login'),
  })
}

export function useLogout() {
  const navigate = useNavigate()
  return () => {
    localStorage.removeItem('access_token')
    navigate('/login')
  }
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('access_token'))
}
