import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ResumeBuilder from '../components/resume/ResumeBuilder'
import type { Resume } from '../types/resume'

vi.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children, fileName }: { children: (state: { loading: boolean }) => React.ReactNode; fileName: string }) => (
    <a data-testid="pdf-link" data-filename={fileName}>
      {children({ loading: false })}
    </a>
  ),
  StyleSheet: { create: (styles: unknown) => styles },
  Document: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Text: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  View: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

const {
  updateResume,
  addWorkExperience,
  deleteWorkExperience,
  addEducation,
  deleteEducation,
  addSkill,
  deleteSkill,
} = vi.hoisted(() => ({
  updateResume: vi.fn().mockResolvedValue({}),
  addWorkExperience: vi.fn().mockResolvedValue({}),
  deleteWorkExperience: vi.fn().mockResolvedValue(undefined),
  addEducation: vi.fn().mockResolvedValue({}),
  deleteEducation: vi.fn().mockResolvedValue(undefined),
  addSkill: vi.fn().mockResolvedValue({}),
  deleteSkill: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../api/resumes', () => ({
  updateResume,
  addWorkExperience,
  deleteWorkExperience,
  addEducation,
  deleteEducation,
  addSkill,
  deleteSkill,
}))

const baseResume: Resume = {
  id: 'r1',
  user_id: 'u1',
  title: 'My Resume',
  full_name: 'Jane Doe',
  email: null,
  phone: null,
  location: null,
  linkedin_url: null,
  github_url: null,
  website_url: null,
  summary: null,
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
  work_experiences: [
    { id: 'we1', resume_id: 'r1', company: 'Acme', title: 'Engineer', start_date: '2020-01', end_date: null, description: null, order: 0 },
  ],
  educations: [
    { id: 'ed1', resume_id: 'r1', institution: 'MIT', degree: 'BS', field_of_study: null, start_date: null, end_date: null, description: null, order: 0 },
  ],
  skills: [{ id: 'sk1', resume_id: 'r1', name: 'Python', category: null, level: null, order: 0 }],
}

function renderBuilder(resume: Resume = baseResume) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ResumeBuilder resume={resume} />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  updateResume.mockClear()
  addWorkExperience.mockClear()
  deleteWorkExperience.mockClear()
  addEducation.mockClear()
  deleteEducation.mockClear()
  addSkill.mockClear()
  deleteSkill.mockClear()
})

describe('ResumeBuilder', () => {
  it('renders the info tab by default with a PDF export link', () => {
    renderBuilder()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByTestId('pdf-link')).toHaveAttribute('data-filename', 'My_Resume.pdf')
  })

  it('switches tabs', async () => {
    renderBuilder()
    await userEvent.click(screen.getByRole('button', { name: /experience/i }))
    expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /education/i }))
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /^skills$/i }))
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
  })

  it('saves personal info', async () => {
    renderBuilder()
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }))
    await waitFor(() => expect(updateResume).toHaveBeenCalled())
    expect(updateResume.mock.calls[0][0]).toBe('r1')
    expect(updateResume.mock.calls[0][1]).toEqual(expect.objectContaining({ full_name: 'Jane Doe' }))
  })

  it('lists, adds, and removes work experience entries', async () => {
    renderBuilder()
    await userEvent.click(screen.getByRole('button', { name: /experience/i }))
    expect(screen.getByText(/Engineer/)).toBeInTheDocument()
    expect(screen.getByText(/Acme/)).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Company *'), 'Globex')
    await userEvent.type(screen.getByPlaceholderText('Job Title *'), 'Director')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))

    await waitFor(() => expect(addWorkExperience).toHaveBeenCalled())
    expect(addWorkExperience.mock.calls[0][0]).toBe('r1')
    expect(addWorkExperience.mock.calls[0][1]).toEqual(
      expect.objectContaining({ company: 'Globex', title: 'Director' })
    )

    await userEvent.click(screen.getByRole('button', { name: /remove/i }))
    await waitFor(() => expect(deleteWorkExperience).toHaveBeenCalled())
    expect(deleteWorkExperience.mock.calls[0][0]).toBe('r1')
    expect(deleteWorkExperience.mock.calls[0][1]).toBe('we1')
  })

  it('lists, adds, and removes education entries', async () => {
    renderBuilder()
    await userEvent.click(screen.getByRole('button', { name: /education/i }))
    expect(screen.getByText(/MIT/)).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Institution *'), 'Stanford')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))

    await waitFor(() => expect(addEducation).toHaveBeenCalled())
    expect(addEducation.mock.calls[0][0]).toBe('r1')
    expect(addEducation.mock.calls[0][1]).toEqual(expect.objectContaining({ institution: 'Stanford' }))

    await userEvent.click(screen.getByRole('button', { name: /remove/i }))
    await waitFor(() => expect(deleteEducation).toHaveBeenCalled())
    expect(deleteEducation.mock.calls[0][0]).toBe('r1')
    expect(deleteEducation.mock.calls[0][1]).toBe('ed1')
  })

  it('lists and adds skills', async () => {
    renderBuilder()
    await userEvent.click(screen.getByRole('button', { name: /^skills$/i }))
    expect(screen.getByText(/Python/)).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Skill name *'), 'Rust')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))

    await waitFor(() => expect(addSkill).toHaveBeenCalled())
    expect(addSkill.mock.calls[0][0]).toBe('r1')
    expect(addSkill.mock.calls[0][1]).toEqual(expect.objectContaining({ name: 'Rust' }))
  })
})
