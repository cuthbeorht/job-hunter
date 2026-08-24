import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ApplicationsPage from '../pages/ApplicationsPage'
import type { JobApplication } from '../types/application'

const acme: JobApplication = {
  id: '1',
  user_id: 'u1',
  company: 'Acme Corp',
  position: 'Engineer',
  status: 'APPLIED',
  applied_date: '2026-06-01',
  salary_min: null,
  salary_max: null,
  job_url: null,
  notes: null,
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

const beta: JobApplication = {
  ...acme,
  id: '2',
  company: 'Beta Inc',
  position: 'Manager',
  status: 'INTERVIEW',
}

const { listApplications, createApplication, updateApplication, deleteApplication } = vi.hoisted(() => ({
  listApplications: vi.fn(),
  createApplication: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../api/applications', () => ({
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
}))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ApplicationsPage />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  listApplications.mockReset().mockResolvedValue([acme, beta])
  createApplication.mockReset().mockResolvedValue({ ...acme, id: '3', company: 'Gamma LLC' })
  updateApplication.mockReset().mockResolvedValue({ ...acme, company: 'Acme Updated' })
  deleteApplication.mockReset().mockResolvedValue(undefined)
})

describe('ApplicationsPage', () => {
  it('shows a loading state before data arrives', () => {
    listApplications.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows an empty state when there are no applications', async () => {
    listApplications.mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByText(/no applications yet/i)).toBeInTheDocument())
  })

  it('renders a card per application', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument())
    expect(screen.getByText('Beta Inc')).toBeInTheDocument()
  })

  it('filters the grid by status via the dropdown', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument())

    await userEvent.selectOptions(screen.getByRole('combobox'), 'INTERVIEW')

    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Beta Inc')).toBeInTheDocument()
  })

  it('toggles a status filter when a stat chip is clicked', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /applied/i }))
    expect(screen.queryByText('Beta Inc')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /applied/i }))
    expect(screen.getByText('Beta Inc')).toBeInTheDocument()
  })

  it('creates a new application through the modal', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /add application/i }))
    const modal = screen.getByText('New Application').closest('form') as HTMLElement
    await userEvent.type(within(modal).getByLabelText(/company/i), 'Gamma LLC')
    await userEvent.type(within(modal).getByLabelText(/position/i), 'Director')
    await userEvent.click(within(modal).getByRole('button', { name: /save/i }))

    await waitFor(() => expect(createApplication).toHaveBeenCalled())
    expect(createApplication.mock.calls[0][0]).toEqual(
      expect.objectContaining({ company: 'Gamma LLC', position: 'Director' })
    )
    await waitFor(() => expect(screen.queryByText('New Application')).not.toBeInTheDocument())
  })

  it('edits an application through the modal', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: /^edit$/i })[0])
    const modal = screen.getByText('Edit Application').closest('form') as HTMLElement
    const companyInput = within(modal).getByLabelText(/company/i)
    await userEvent.clear(companyInput)
    await userEvent.type(companyInput, 'Acme Updated')
    await userEvent.click(within(modal).getByRole('button', { name: /save/i }))

    await waitFor(() => expect(updateApplication).toHaveBeenCalled())
    expect(updateApplication.mock.calls[0][0]).toBe('1')
    expect(updateApplication.mock.calls[0][1]).toEqual(expect.objectContaining({ company: 'Acme Updated' }))
    await waitFor(() => expect(screen.queryByText('Edit Application')).not.toBeInTheDocument())
  })

  it('deletes an application when a card delete button is clicked', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument())

    // Applications render in list order [acme, beta], so the first delete button is Acme's.
    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])

    await waitFor(() => expect(deleteApplication.mock.calls[0]?.[0]).toBe('1'))
  })
})
