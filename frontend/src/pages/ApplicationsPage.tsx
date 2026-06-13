import { useState } from 'react'
import ApplicationCard from '../components/applications/ApplicationCard'
import ApplicationForm from '../components/applications/ApplicationForm'
import { useApplications, useCreateApplication, useDeleteApplication, useUpdateApplication } from '../hooks/useApplications'
import { APPLICATION_STATUSES, STATUS_LABELS } from '../types/application'
import type { ApplicationIn, ApplicationStatus, JobApplication } from '../types/application'

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useApplications()
  const createMutation = useCreateApplication()
  const deleteMutation = useDeleteApplication()
  const [editing, setEditing] = useState<JobApplication | null>(null)
  const [creating, setCreating] = useState(false)
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'ALL'>('ALL')

  const updateMutation = useUpdateApplication(editing?.id ?? '')

  const filtered = applications?.filter((a) => filterStatus === 'ALL' || a.status === filterStatus) ?? []

  const onCreateSubmit = (data: ApplicationIn) => {
    createMutation.mutate(data, { onSuccess: () => setCreating(false) })
  }

  const onEditSubmit = (data: ApplicationIn) => {
    updateMutation.mutate(data, { onSuccess: () => setEditing(null) })
  }

  if (isLoading) return <div style={styles.loading}>Loading…</div>

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <h2 style={{ margin: 0 }}>Job Applications</h2>
        <div style={styles.toolbarRight}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'ALL')}
            style={styles.select}
          >
            <option value="ALL">All Statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button onClick={() => setCreating(true)} style={styles.addBtn}>+ Add Application</button>
        </div>
      </div>

      {(creating || editing) && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <ApplicationForm
              initial={editing ?? undefined}
              onSubmit={editing ? onEditSubmit : onCreateSubmit}
              isPending={editing ? updateMutation.isPending : createMutation.isPending}
              onCancel={() => { setCreating(false); setEditing(null) }}
            />
          </div>
        </div>
      )}

      <div style={styles.stats}>
        {APPLICATION_STATUSES.map((s) => {
          const count = applications?.filter((a) => a.status === s).length ?? 0
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'ALL' : s)}
              style={{ ...styles.statChip, ...(filterStatus === s ? styles.statChipActive : {}) }}
            >
              {STATUS_LABELS[s]} <strong>{count}</strong>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>No applications yet. Click "+ Add Application" to start tracking.</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={setEditing}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1000, margin: '0 auto', padding: 24 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  toolbarRight: { display: 'flex', gap: 8, alignItems: 'center' },
  select: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 },
  addBtn: { padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  stats: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  statChip: { padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 20, cursor: 'pointer', background: '#f9fafb', fontSize: 12, display: 'flex', gap: 4 },
  statChipActive: { background: '#eff6ff', borderColor: '#bfdbfe', color: '#2563eb' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 60 },
  loading: { padding: 40, textAlign: 'center', color: '#6b7280' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalBox: { background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
}
