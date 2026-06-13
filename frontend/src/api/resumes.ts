import type { Education, EducationIn, Resume, ResumeIn, Skill, SkillIn, WorkExperience, WorkExperienceIn } from '../types/resume'
import client from './client'

export const listResumes = () => client.get<Resume[]>('/resumes').then((r) => r.data)
export const getResume = (id: string) => client.get<Resume>(`/resumes/${id}`).then((r) => r.data)
export const createResume = (data: ResumeIn) => client.post<Resume>('/resumes', data).then((r) => r.data)
export const updateResume = (id: string, data: ResumeIn) => client.put<Resume>(`/resumes/${id}`, data).then((r) => r.data)
export const deleteResume = (id: string) => client.delete(`/resumes/${id}`)

export const addWorkExperience = (resumeId: string, data: WorkExperienceIn) =>
  client.post<WorkExperience>(`/resumes/${resumeId}/work-experience`, data).then((r) => r.data)
export const updateWorkExperience = (resumeId: string, id: string, data: WorkExperienceIn) =>
  client.put<WorkExperience>(`/resumes/${resumeId}/work-experience/${id}`, data).then((r) => r.data)
export const deleteWorkExperience = (resumeId: string, id: string) =>
  client.delete(`/resumes/${resumeId}/work-experience/${id}`)

export const addEducation = (resumeId: string, data: EducationIn) =>
  client.post<Education>(`/resumes/${resumeId}/education`, data).then((r) => r.data)
export const updateEducation = (resumeId: string, id: string, data: EducationIn) =>
  client.put<Education>(`/resumes/${resumeId}/education/${id}`, data).then((r) => r.data)
export const deleteEducation = (resumeId: string, id: string) =>
  client.delete(`/resumes/${resumeId}/education/${id}`)

export const addSkill = (resumeId: string, data: SkillIn) =>
  client.post<Skill>(`/resumes/${resumeId}/skills`, data).then((r) => r.data)
export const updateSkill = (resumeId: string, id: string, data: SkillIn) =>
  client.put<Skill>(`/resumes/${resumeId}/skills/${id}`, data).then((r) => r.data)
export const deleteSkill = (resumeId: string, id: string) =>
  client.delete(`/resumes/${resumeId}/skills/${id}`)
