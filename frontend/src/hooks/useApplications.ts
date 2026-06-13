import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/applications'
import type { ApplicationIn } from '../types/application'

export const APPLICATIONS_KEY = ['applications']

export function useApplications() {
  return useQuery({ queryKey: APPLICATIONS_KEY, queryFn: api.listApplications })
}

export function useCreateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ApplicationIn) => api.createApplication(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPLICATIONS_KEY }),
  })
}

export function useUpdateApplication(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ApplicationIn) => api.updateApplication(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPLICATIONS_KEY }),
  })
}

export function useDeleteApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteApplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: APPLICATIONS_KEY }),
  })
}
