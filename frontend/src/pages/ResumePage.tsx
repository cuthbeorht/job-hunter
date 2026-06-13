import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ResumeBuilder from '../components/resume/ResumeBuilder'
import { useCreateResume, useDeleteResume, useResumes } from '../hooks/useResume'
import type { ResumeIn } from '../types/resume'

export default function ResumePage() {
  const { data: resumes, isLoading } = useResumes()
  const createResume = useCreateResume()
  const deleteResume = useDeleteResume()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const { register, handleSubmit, reset } = useForm<ResumeIn>({ defaultValues: { title: '' } })

  const selected = resumes?.find((r) => r.id === selectedId)

  const onCreate = handleSubmit((data) => {
    createResume.mutate(data, {
      onSuccess: (newResume) => {
        setSelectedId(newResume.id)
        setShowCreate(false)
        reset()
      },
    })
  })

  if (isLoading) return <div style={styles.loading}>Loading resumes…</div>

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={{ fontWeight: 700 }}>My Resumes</span>
          <button onClick={() => setShowCreate(true)} style={styles.addBtn}>+</button>
        </div>
        {showCreate && (
          <form onSubmit={onCreate} style={styles.createForm}>
            <input {...register('title')} placeholder="Resume title" required style={styles.createInput} autoFocus />
            <div style={{ display: 'flex', gap: 4 }}>
              <button type="submit" style={styles.createSave}>Create</button>
              <button type="button" onClick={() => setShowCreate(false)} style={styles.createCancel}>×</button>
            </div>
          </form>
        )}
        {resumes?.map((r) => (
          <div
            key={r.id}
            style={{ ...styles.resumeItem, ...(r.id === selectedId ? styles.resumeItemActive : {}) }}
          >
            <span onClick={() => setSelectedId(r.id)} style={{ flex: 1, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.title}
            </span>
            <button
              onClick={() => {
                deleteResume.mutate(r.id)
                if (selectedId === r.id) setSelectedId(null)
              }}
              style={styles.deleteItem}
            >×</button>
          </div>
        ))}
        {resumes?.length === 0 && !showCreate && (
          <p style={{ fontSize: 13, color: '#6b7280', padding: '0 12px' }}>No resumes yet.</p>
        )}
      </aside>
      <main style={styles.main}>
        {selected ? (
          <ResumeBuilder resume={selected} />
        ) : (
          <div style={styles.empty}>
            <p>Select or create a resume to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  layout: { display: 'flex', height: 'calc(100vh - 60px)' },
  sidebar: { width: 220, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: '16px 0', gap: 4, overflowY: 'auto' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px 8px', borderBottom: '1px solid #f3f4f6' },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 18, lineHeight: 1 },
  createForm: { padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 },
  createInput: { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 },
  createSave: { flex: 1, padding: '4px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
  createCancel: { padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', background: '#fff', fontSize: 14 },
  resumeItem: { display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer', borderRadius: 4, margin: '0 4px', gap: 4 },
  resumeItemActive: { background: '#eff6ff', color: '#2563eb' },
  deleteItem: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16, padding: 0, lineHeight: 1 },
  main: { flex: 1, overflowY: 'auto' },
  empty: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' },
  loading: { padding: 40, textAlign: 'center', color: '#6b7280' },
}
