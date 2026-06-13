import type { ApplicationIn, JobApplication } from '../types/application'
import client from './client'

export const listApplications = () => client.get<JobApplication[]>('/applications').then((r) => r.data)
export const getApplication = (id: string) => client.get<JobApplication>(`/applications/${id}`).then((r) => r.data)
export const createApplication = (data: ApplicationIn) => client.post<JobApplication>('/applications', data).then((r) => r.data)
export const updateApplication = (id: string, data: ApplicationIn) => client.put<JobApplication>(`/applications/${id}`, data).then((r) => r.data)
export const deleteApplication = (id: string) => client.delete(`/applications/${id}`)
