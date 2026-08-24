import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ApplicationForm from '../components/applications/ApplicationForm'
import type { JobApplication } from '../types/application'

const existing: JobApplication = {
  id: '1',
  user_id: 'u1',
  company: 'Acme Corp',
  position: 'Engineer',
  status: 'INTERVIEW',
  applied_date: '2026-06-01',
  salary_min: 100000,
  salary_max: 150000,
  job_url: 'https://example.com/job',
  notes: 'Great team',
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

describe('ApplicationForm', () => {
  it('renders empty required fields for a new application', () => {
    render(<ApplicationForm onSubmit={vi.fn()} isPending={false} onCancel={vi.fn()} />)
    expect(screen.getByText('New Application')).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toHaveValue('')
    expect(screen.getByLabelText(/position/i)).toHaveValue('')
  })

  it('pre-fills fields when editing an existing application', () => {
    render(<ApplicationForm initial={existing} onSubmit={vi.fn()} isPending={false} onCancel={vi.fn()} />)
    expect(screen.getByText('Edit Application')).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toHaveValue('Acme Corp')
    expect(screen.getByLabelText(/position/i)).toHaveValue('Engineer')
    expect(screen.getByLabelText(/job url/i)).toHaveValue('https://example.com/job')
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Great team')
  })

  it('calls onSubmit with form data when saved', async () => {
    const onSubmit = vi.fn()
    render(<ApplicationForm onSubmit={onSubmit} isPending={false} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/company/i), 'Beta Inc')
    await userEvent.type(screen.getByLabelText(/position/i), 'Manager')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ company: 'Beta Inc', position: 'Manager', status: 'APPLIED' })
    )
  })

  it('calls onCancel when cancel is clicked', async () => {
    const onCancel = vi.fn()
    render(<ApplicationForm onSubmit={vi.fn()} isPending={false} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('disables the save button while pending', () => {
    render(<ApplicationForm onSubmit={vi.fn()} isPending onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})
