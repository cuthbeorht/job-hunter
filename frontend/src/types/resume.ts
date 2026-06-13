export interface WorkExperience {
  id: string
  resume_id: string
  company: string
  title: string
  start_date: string | null
  end_date: string | null
  description: string | null
  order: number
}

export interface Education {
  id: string
  resume_id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  order: number
}

export interface Skill {
  id: string
  resume_id: string
  name: string
  category: string | null
  level: string | null
  order: number
}

export interface Resume {
  id: string
  user_id: string
  title: string
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin_url: string | null
  github_url: string | null
  website_url: string | null
  summary: string | null
  created_at: string
  updated_at: string
  work_experiences: WorkExperience[]
  educations: Education[]
  skills: Skill[]
}

export type ResumeIn = Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'work_experiences' | 'educations' | 'skills'>
export type WorkExperienceIn = Omit<WorkExperience, 'id' | 'resume_id'>
export type EducationIn = Omit<Education, 'id' | 'resume_id'>
export type SkillIn = Omit<Skill, 'id' | 'resume_id'>
