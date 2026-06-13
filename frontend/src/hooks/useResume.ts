import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/resumes'
import type { EducationIn, ResumeIn, SkillIn, WorkExperienceIn } from '../types/resume'

export const RESUMES_KEY = ['resumes']
export const resumeKey = (id: string) => ['resumes', id]

export function useResumes() {
  return useQuery({ queryKey: RESUMES_KEY, queryFn: api.listResumes })
}

export function useResume(id: string) {
  return useQuery({ queryKey: resumeKey(id), queryFn: () => api.getResume(id) })
}

export function useCreateResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ResumeIn) => api.createResume(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: RESUMES_KEY }),
  })
}

export function useUpdateResume(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ResumeIn) => api.updateResume(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(id) }),
  })
}

export function useDeleteResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteResume,
    onSuccess: () => qc.invalidateQueries({ queryKey: RESUMES_KEY }),
  })
}

export function useAddWorkExperience(resumeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkExperienceIn) => api.addWorkExperience(resumeId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}

export function useUpdateWorkExperience(resumeId: string, entryId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkExperienceIn) => api.updateWorkExperience(resumeId, entryId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}

export function useDeleteWorkExperience(resumeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entryId: string) => api.deleteWorkExperience(resumeId, entryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}

export function useAddEducation(resumeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EducationIn) => api.addEducation(resumeId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}

export function useDeleteEducation(resumeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entryId: string) => api.deleteEducation(resumeId, entryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}

export function useAddSkill(resumeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SkillIn) => api.addSkill(resumeId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}

export function useDeleteSkill(resumeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entryId: string) => api.deleteSkill(resumeId, entryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: resumeKey(resumeId) }),
  })
}
