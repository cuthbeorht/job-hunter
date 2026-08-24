import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ResumePDFDocument from '../components/resume/ResumePDFDocument'
import type { Resume } from '../types/resume'

vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  Document: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Page: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  View: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

const minimalResume: Resume = {
  id: 'r1',
  user_id: 'u1',
  title: 'Resume',
  full_name: null,
  email: null,
  phone: null,
  location: null,
  linkedin_url: null,
  github_url: null,
  website_url: null,
  summary: null,
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
  work_experiences: [],
  educations: [],
  skills: [],
}

const fullResume: Resume = {
  ...minimalResume,
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '555-1234',
  location: 'Remote',
  linkedin_url: 'linkedin.com/in/jane',
  github_url: 'github.com/jane',
  website_url: 'jane.dev',
  summary: 'Experienced engineer.',
  work_experiences: [
    { id: 'we1', resume_id: 'r1', company: 'Acme', title: 'Engineer', start_date: '2020-01', end_date: '2022-01', description: 'Built things.', order: 0 },
    { id: 'we2', resume_id: 'r1', company: 'Globex', title: 'Senior Engineer', start_date: '2022-02', end_date: null, description: null, order: 1 },
  ],
  educations: [
    { id: 'ed1', resume_id: 'r1', institution: 'MIT', degree: 'BS', field_of_study: 'CS', start_date: '2016', end_date: '2020', description: 'Honors.', order: 0 },
  ],
  skills: [{ id: 'sk1', resume_id: 'r1', name: 'Python', category: 'Languages', level: 'Expert', order: 0 }],
}

describe('ResumePDFDocument', () => {
  it('renders nothing beyond the shell for a resume with no optional data', () => {
    render(<ResumePDFDocument resume={minimalResume} />)
    expect(screen.queryByText('Summary')).not.toBeInTheDocument()
    expect(screen.queryByText('Experience')).not.toBeInTheDocument()
    expect(screen.queryByText('Education')).not.toBeInTheDocument()
    expect(screen.queryByText('Skills')).not.toBeInTheDocument()
  })

  it('renders all sections when the resume is fully populated', () => {
    render(<ResumePDFDocument resume={fullResume} />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()

    expect(screen.getByText('Summary')).toBeInTheDocument()
    expect(screen.getByText('Experienced engineer.')).toBeInTheDocument()

    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Engineer — Acme')).toBeInTheDocument()
    expect(screen.getByText('2020-01 – 2022-01')).toBeInTheDocument()
    // Ongoing role (no end_date) renders "– Present".
    expect(screen.getByText('2022-02 – Present')).toBeInTheDocument()

    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('BS in CS — MIT')).toBeInTheDocument()

    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })
})
