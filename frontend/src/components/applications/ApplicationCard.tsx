import { STATUS_COLORS, STATUS_LABELS } from '../../types/application'
import type { JobApplication } from '../../types/application'

interface Props {
  application: JobApplication
  onEdit: (app: JobApplication) => void
  onDelete: (id: string) => void
}

export default function ApplicationCard({ application, onEdit, onDelete }: Props) {
  const color = STATUS_COLORS[application.status]

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <div style={styles.company}>{application.company}</div>
          <div style={styles.position}>{application.position}</div>
        </div>
        <span style={{ ...styles.badge, background: color + '22', color }}>{STATUS_LABELS[application.status]}</span>
      </div>
      {application.applied_date && (
        <div style={styles.meta}>Applied: {application.applied_date}</div>
      )}
      {(application.salary_min || application.salary_max) && (
        <div style={styles.meta}>
          {application.salary_min ? `$${application.salary_min.toLocaleString()}` : ''}
          {application.salary_min && application.salary_max ? ' – ' : ''}
          {application.salary_max ? `$${application.salary_max.toLocaleString()}` : ''}
        </div>
      )}
      {application.job_url && (
        <a href={application.job_url} target="_blank" rel="noreferrer" style={styles.link}>View Posting ↗</a>
      )}
      <div style={styles.actions}>
        <button onClick={() => onEdit(application)} style={styles.editBtn}>Edit</button>
        <button onClick={() => onDelete(application.id)} style={styles.deleteBtn}>Delete</button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff', display: 'flex', flexDirection: 'column', gap: 6 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  company: { fontWeight: 700, fontSize: 15 },
  position: { color: '#4b5563', fontSize: 13 },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' },
  meta: { fontSize: 12, color: '#6b7280' },
  link: { fontSize: 12, color: '#3b82f6' },
  actions: { display: 'flex', gap: 6, marginTop: 8 },
  editBtn: { padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', background: '#fff', fontSize: 12 },
  deleteBtn: { padding: '4px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
}
