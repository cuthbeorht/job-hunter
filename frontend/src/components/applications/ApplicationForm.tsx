import { useForm } from 'react-hook-form'
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../types/application'
import type { ApplicationIn, JobApplication } from '../../types/application'

interface Props {
  initial?: JobApplication
  onSubmit: (data: ApplicationIn) => void
  isPending: boolean
  onCancel: () => void
}

export default function ApplicationForm({ initial, onSubmit, isPending, onCancel }: Props) {
  const { register, handleSubmit } = useForm<ApplicationIn>({
    defaultValues: initial ?? { company: '', position: '', status: 'APPLIED' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <h3>{initial ? 'Edit Application' : 'New Application'}</h3>
      <div style={styles.row}>
        <div style={styles.field}>
          <label htmlFor="app-company">Company *</label>
          <input id="app-company" {...register('company')} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label htmlFor="app-position">Position *</label>
          <input id="app-position" {...register('position')} required style={styles.input} />
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label htmlFor="app-status">Status</label>
          <select id="app-status" {...register('status')} style={styles.input}>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label htmlFor="app-applied-date">Applied Date</label>
          <input id="app-applied-date" type="date" {...register('applied_date')} style={styles.input} />
        </div>
      </div>
      <div style={styles.field}>
        <label htmlFor="app-job-url">Job URL</label>
        <input id="app-job-url" {...register('job_url')} style={styles.input} />
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label htmlFor="app-salary-min">Salary Min</label>
          <input id="app-salary-min" type="number" {...register('salary_min', { valueAsNumber: true })} style={styles.input} />
        </div>
        <div style={styles.field}>
          <label htmlFor="app-salary-max">Salary Max</label>
          <input id="app-salary-max" type="number" {...register('salary_max', { valueAsNumber: true })} style={styles.input} />
        </div>
      </div>
      <div style={styles.field}>
        <label htmlFor="app-notes">Notes</label>
        <textarea id="app-notes" {...register('notes')} rows={3} style={{ ...styles.input, resize: 'vertical' }} />
      </div>
      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button type="submit" disabled={isPending} style={styles.submitBtn}>
          {isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'flex', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  input: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: '100%', boxSizing: 'border-box' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  cancelBtn: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', background: '#fff', fontSize: 14 },
  submitBtn: { padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
}
