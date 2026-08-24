import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ResumePage from '../pages/ResumePage'
import type { Resume } from '../types/resume'

const resumeA: Resume = {
  id: 'r1',
  user_id: 'u1',
  title: 'Software Engineer Resume',
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

const resumeB: Resume = { ...resumeA, id: 'r2', title: 'Product Manager Resume' }

const { listResumes, createResume, deleteResume } = vi.hoisted(() => ({
  listResumes: vi.fn(),
  createResume: vi.fn(),
  deleteResume: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../api/resumes', () => ({
  listResumes,
  createResume,
  deleteResume,
  getResume: vi.fn(),
  updateResume: vi.fn(),
}))

vi.mock('../components/resume/ResumeBuilder', () => ({
  default: ({ resume }: { resume: Resume }) => <div data-testid="resume-builder">{resume.title}</div>,
}))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ResumePage />
    </QueryClientProvider>
  )
}

let resumesData: Resume[]

beforeEach(() => {
  resumesData = [resumeA, resumeB]
  listResumes.mockReset().mockImplementation(() => Promise.resolve(resumesData))
  createResume.mockReset().mockImplementation((data: { title: string }) => {
    const created = { ...resumeA, id: 'r3', title: data.title }
    resumesData = [...resumesData, created]
    return Promise.resolve(created)
  })
  deleteResume.mockReset().mockImplementation((id: string) => {
    resumesData = resumesData.filter((r) => r.id !== id)
    return Promise.resolve(undefined)
  })
})

describe('ResumePage', () => {
  it('shows an empty state when there are no resumes', async () => {
    listResumes.mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument())
    expect(screen.getByText(/select or create a resume/i)).toBeInTheDocument()
  })

  it('lists resumes in the sidebar', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument())
    expect(screen.getByText('Product Manager Resume')).toBeInTheDocument()
  })

  it('selects a resume and renders the builder', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument())

    await userEvent.click(screen.getByText('Software Engineer Resume'))

    await waitFor(() => expect(screen.getByTestId('resume-builder')).toHaveTextContent('Software Engineer Resume'))
  })

  it('creates a resume and selects it', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: '+' }))
    await userEvent.type(screen.getByPlaceholderText(/resume title/i), 'New Resume')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => expect(createResume).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByTestId('resume-builder')).toHaveTextContent('New Resume'))
  })

  it('deletes a resume and clears the selection if it was selected', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument())

    await userEvent.click(screen.getByText('Software Engineer Resume'))
    await waitFor(() => expect(screen.getByTestId('resume-builder')).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: '×' })[0])

    await waitFor(() => expect(deleteResume).toHaveBeenCalled())
    expect(screen.queryByTestId('resume-builder')).not.toBeInTheDocument()
  })
})
