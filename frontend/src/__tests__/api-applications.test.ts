import { vi } from 'vitest'
import {
  createApplication,
  deleteApplication,
  getApplication,
  listApplications,
  updateApplication,
} from '../api/applications'
import type { ApplicationIn } from '../types/application'

const { get, post, put, del } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}))

vi.mock('../api/client', () => ({
  default: { get, post, put, delete: del },
}))

const payload: ApplicationIn = {
  company: 'Acme',
  position: 'Engineer',
  status: 'APPLIED',
  applied_date: null,
  job_url: null,
  salary_min: null,
  salary_max: null,
  notes: null,
}

beforeEach(() => {
  get.mockReset()
  post.mockReset()
  put.mockReset()
  del.mockReset()
})

describe('api/applications', () => {
  it('listApplications GETs /applications', async () => {
    get.mockResolvedValue({ data: [] })
    await listApplications()
    expect(get).toHaveBeenCalledWith('/applications')
  })

  it('getApplication GETs /applications/:id', async () => {
    get.mockResolvedValue({ data: {} })
    await getApplication('1')
    expect(get).toHaveBeenCalledWith('/applications/1')
  })

  it('createApplication POSTs to /applications', async () => {
    post.mockResolvedValue({ data: {} })
    await createApplication(payload)
    expect(post).toHaveBeenCalledWith('/applications', payload)
  })

  it('updateApplication PUTs to /applications/:id', async () => {
    put.mockResolvedValue({ data: {} })
    await updateApplication('1', payload)
    expect(put).toHaveBeenCalledWith('/applications/1', payload)
  })

  it('deleteApplication DELETEs /applications/:id', async () => {
    del.mockResolvedValue({})
    await deleteApplication('1')
    expect(del).toHaveBeenCalledWith('/applications/1')
  })
})
