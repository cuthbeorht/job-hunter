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
})
