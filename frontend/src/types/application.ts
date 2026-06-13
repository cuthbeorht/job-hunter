export type ApplicationStatus =
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN'

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
]

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: '#3b82f6',
  PHONE_SCREEN: '#8b5cf6',
  INTERVIEW: '#f59e0b',
  OFFER: '#10b981',
  REJECTED: '#ef4444',
  WITHDRAWN: '#6b7280',
}

export interface JobApplication {
  id: string
  user_id: string
  company: string
  position: string
  job_url: string | null
  salary_min: number | null
  salary_max: number | null
  status: ApplicationStatus
  applied_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ApplicationIn = Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>
