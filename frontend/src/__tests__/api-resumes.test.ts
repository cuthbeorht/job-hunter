import { vi } from 'vitest'
import {
  addEducation,
  addSkill,
  addWorkExperience,
  createResume,
  deleteEducation,
  deleteResume,
  deleteSkill,
  deleteWorkExperience,
  getResume,
  listResumes,
  updateEducation,
  updateResume,
  updateSkill,
  updateWorkExperience,
} from '../api/resumes'

const { get, post, put, del } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}))

vi.mock('../api/client', () => ({
  default: { get, post, put, delete: del },
}))

beforeEach(() => {
  get.mockReset().mockResolvedValue({ data: {} })
  post.mockReset().mockResolvedValue({ data: {} })
  put.mockReset().mockResolvedValue({ data: {} })
  del.mockReset().mockResolvedValue({})
})

describe('api/resumes', () => {
  it('listResumes GETs /resumes', async () => {
    await listResumes()
    expect(get).toHaveBeenCalledWith('/resumes')
  })

  it('getResume GETs /resumes/:id', async () => {
    await getResume('r1')
    expect(get).toHaveBeenCalledWith('/resumes/r1')
  })

  it('createResume POSTs to /resumes', async () => {
    const data = { title: 'My Resume' }
    await createResume(data as never)
    expect(post).toHaveBeenCalledWith('/resumes', data)
  })

  it('updateResume PUTs to /resumes/:id', async () => {
    const data = { title: 'Updated' }
    await updateResume('r1', data as never)
    expect(put).toHaveBeenCalledWith('/resumes/r1', data)
  })

  it('deleteResume DELETEs /resumes/:id', async () => {
    await deleteResume('r1')
    expect(del).toHaveBeenCalledWith('/resumes/r1')
  })

  it('work experience sub-resource routes are correct', async () => {
    const data = { company: 'Acme', title: 'Eng' }
    await addWorkExperience('r1', data as never)
    expect(post).toHaveBeenCalledWith('/resumes/r1/work-experience', data)

    await updateWorkExperience('r1', 'we1', data as never)
    expect(put).toHaveBeenCalledWith('/resumes/r1/work-experience/we1', data)

    await deleteWorkExperience('r1', 'we1')
    expect(del).toHaveBeenCalledWith('/resumes/r1/work-experience/we1')
  })

  it('education sub-resource routes are correct', async () => {
    const data = { institution: 'MIT' }
    await addEducation('r1', data as never)
    expect(post).toHaveBeenCalledWith('/resumes/r1/education', data)

    await updateEducation('r1', 'ed1', data as never)
    expect(put).toHaveBeenCalledWith('/resumes/r1/education/ed1', data)

    await deleteEducation('r1', 'ed1')
    expect(del).toHaveBeenCalledWith('/resumes/r1/education/ed1')
  })

  it('skill sub-resource routes are correct', async () => {
    const data = { name: 'Python' }
    await addSkill('r1', data as never)
    expect(post).toHaveBeenCalledWith('/resumes/r1/skills', data)

    await updateSkill('r1', 'sk1', data as never)
    expect(put).toHaveBeenCalledWith('/resumes/r1/skills/sk1', data)

    await deleteSkill('r1', 'sk1')
    expect(del).toHaveBeenCalledWith('/resumes/r1/skills/sk1')
  })
})
