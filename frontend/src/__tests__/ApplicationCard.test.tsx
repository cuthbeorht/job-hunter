import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ApplicationCard from '../components/applications/ApplicationCard'
import type { JobApplication } from '../types/application'

const app: JobApplication = {
  id: '1',
  user_id: 'u1',
  company: 'Acme Corp',
  position: 'Engineer',
  status: 'APPLIED',
  applied_date: '2026-06-01',
  salary_min: 100000,
  salary_max: 150000,
  job_url: null,
  notes: null,
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

describe('ApplicationCard', () => {
  it('renders company and position', () => {
    render(<ApplicationCard application={app} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<ApplicationCard application={app} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('calls onDelete when delete is clicked', async () => {
    const onDelete = vi.fn()
    render(<ApplicationCard application={app} onEdit={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('calls onEdit when edit is clicked', async () => {
    const onEdit = vi.fn()
    render(<ApplicationCard application={app} onEdit={onEdit} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(app)
  })

  it('renders a job posting link when job_url is set', () => {
    render(<ApplicationCard application={{ ...app, job_url: 'https://example.com/job' }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('link', { name: /view posting/i })).toHaveAttribute('href', 'https://example.com/job')
  })

  it('omits the job posting link when job_url is null', () => {
    render(<ApplicationCard application={{ ...app, job_url: null }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByRole('link', { name: /view posting/i })).not.toBeInTheDocument()
  })

  it('renders a single-sided salary range when only salary_min is set', () => {
    render(<ApplicationCard application={{ ...app, salary_min: 90000, salary_max: null }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('$90,000')).toBeInTheDocument()
  })

  it('omits the salary line entirely when neither bound is set', () => {
    render(<ApplicationCard application={{ ...app, salary_min: null, salary_max: null }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
  })
})
