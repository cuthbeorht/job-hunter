import { PDFDownloadLink } from '@react-pdf/renderer'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  useAddEducation,
  useAddSkill,
  useAddWorkExperience,
  useDeleteEducation,
  useDeleteSkill,
  useDeleteWorkExperience,
  useUpdateResume,
} from '../../hooks/useResume'
import type { Resume, ResumeIn } from '../../types/resume'
import ResumePDFDocument from './ResumePDFDocument'

type Tab = 'info' | 'experience' | 'education' | 'skills'

export default function ResumeBuilder({ resume }: { resume: Resume }) {
  const [tab, setTab] = useState<Tab>('info')
  const updateResume = useUpdateResume(resume.id)

  const { register, handleSubmit } = useForm<ResumeIn>({ defaultValues: resume })

  const onSaveInfo = handleSubmit((data) => updateResume.mutate(data))

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>{resume.title}</h2>
        <PDFDownloadLink
          document={<ResumePDFDocument resume={resume} />}
          fileName={`${resume.title.replace(/\s+/g, '_')}.pdf`}
          style={styles.pdfBtn}
        >
          {({ loading }) => (loading ? 'Preparing PDF…' : 'Export PDF')}
        </PDFDownloadLink>
      </div>

      <div style={styles.tabs}>
        {(['info', 'experience', 'education', 'skills'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <form onSubmit={onSaveInfo} style={styles.form}>
          <h3>Personal Information</h3>
          {[
            { name: 'full_name' as const, label: 'Full Name' },
            { name: 'email' as const, label: 'Email' },
            { name: 'phone' as const, label: 'Phone' },
            { name: 'location' as const, label: 'Location' },
            { name: 'linkedin_url' as const, label: 'LinkedIn URL' },
            { name: 'github_url' as const, label: 'GitHub URL' },
            { name: 'website_url' as const, label: 'Website URL' },
          ].map(({ name, label }) => (
            <div key={name} style={styles.field}>
              <label>{label}</label>
              <input {...register(name)} style={styles.input} />
            </div>
          ))}
          <div style={styles.field}>
            <label>Summary</label>
            <textarea {...register('summary')} rows={4} style={{ ...styles.input, resize: 'vertical' }} />
          </div>
          <button type="submit" disabled={updateResume.isPending} style={styles.saveBtn}>
            {updateResume.isPending ? 'Saving…' : 'Save'}
          </button>
        </form>
      )}

      {tab === 'experience' && <WorkExperienceTab resume={resume} />}
      {tab === 'education' && <EducationTab resume={resume} />}
      {tab === 'skills' && <SkillsTab resume={resume} />}
    </div>
  )
}

function WorkExperienceTab({ resume }: { resume: Resume }) {
  const addMutation = useAddWorkExperience(resume.id)
  const deleteMutation = useDeleteWorkExperience(resume.id)
  const { register, handleSubmit, reset } = useForm({ defaultValues: { company: '', title: '', start_date: '', end_date: '', description: '', order: 0 } })

  const onAdd = handleSubmit((data) => {
    addMutation.mutate({ ...data, start_date: data.start_date || null, end_date: data.end_date || null, description: data.description || null })
    reset()
  })

  return (
    <div style={styles.section}>
      <h3>Work Experience</h3>
      {resume.work_experiences.map((we) => (
        <div key={we.id} style={styles.card}>
          <div style={styles.cardRow}>
            <span><strong>{we.title}</strong> at {we.company}</span>
            <span style={styles.dateRange}>{we.start_date}{we.end_date ? ` – ${we.end_date}` : we.start_date ? ' – Present' : ''}</span>
          </div>
          {we.description && <p style={styles.desc}>{we.description}</p>}
          <button onClick={() => deleteMutation.mutate(we.id)} style={styles.deleteBtn}>Remove</button>
        </div>
      ))}
      <form onSubmit={onAdd} style={styles.addForm}>
        <h4>Add Entry</h4>
        <div style={styles.row}>
          <input {...register('company')} placeholder="Company *" style={styles.input} required />
          <input {...register('title')} placeholder="Job Title *" style={styles.input} required />
        </div>
        <div style={styles.row}>
          <input {...register('start_date')} placeholder="Start (YYYY-MM)" style={styles.input} />
          <input {...register('end_date')} placeholder="End (YYYY-MM or blank)" style={styles.input} />
        </div>
        <textarea {...register('description')} placeholder="Description" rows={3} style={{ ...styles.input, resize: 'vertical' }} />
        <button type="submit" disabled={addMutation.isPending} style={styles.saveBtn}>Add</button>
      </form>
    </div>
  )
}

function EducationTab({ resume }: { resume: Resume }) {
  const addMutation = useAddEducation(resume.id)
  const deleteMutation = useDeleteEducation(resume.id)
  const { register, handleSubmit, reset } = useForm({ defaultValues: { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '', order: 0 } })

  const onAdd = handleSubmit((data) => {
    addMutation.mutate({ ...data, degree: data.degree || null, field_of_study: data.field_of_study || null, start_date: data.start_date || null, end_date: data.end_date || null, description: data.description || null })
    reset()
  })

  return (
    <div style={styles.section}>
      <h3>Education</h3>
      {resume.educations.map((ed) => (
        <div key={ed.id} style={styles.card}>
          <div style={styles.cardRow}>
            <span><strong>{[ed.degree, ed.field_of_study].filter(Boolean).join(' in ')}</strong> — {ed.institution}</span>
            <span style={styles.dateRange}>{ed.start_date}{ed.end_date ? ` – ${ed.end_date}` : ''}</span>
          </div>
          {ed.description && <p style={styles.desc}>{ed.description}</p>}
          <button onClick={() => deleteMutation.mutate(ed.id)} style={styles.deleteBtn}>Remove</button>
        </div>
      ))}
      <form onSubmit={onAdd} style={styles.addForm}>
        <h4>Add Entry</h4>
        <input {...register('institution')} placeholder="Institution *" style={styles.input} required />
        <div style={styles.row}>
          <input {...register('degree')} placeholder="Degree" style={styles.input} />
          <input {...register('field_of_study')} placeholder="Field of Study" style={styles.input} />
        </div>
        <div style={styles.row}>
          <input {...register('start_date')} placeholder="Start (YYYY)" style={styles.input} />
          <input {...register('end_date')} placeholder="End (YYYY)" style={styles.input} />
        </div>
        <button type="submit" disabled={addMutation.isPending} style={styles.saveBtn}>Add</button>
      </form>
    </div>
  )
}

function SkillsTab({ resume }: { resume: Resume }) {
  const addMutation = useAddSkill(resume.id)
  const deleteMutation = useDeleteSkill(resume.id)
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', category: '', level: '', order: 0 } })

  const onAdd = handleSubmit((data) => {
    addMutation.mutate({ ...data, category: data.category || null, level: data.level || null })
    reset()
  })

  return (
    <div style={styles.section}>
      <h3>Skills</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {resume.skills.map((sk) => (
          <div key={sk.id} style={styles.skillBadge}>
            <span>{sk.name}{sk.category ? ` (${sk.category})` : ''}</span>
            <button onClick={() => deleteMutation.mutate(sk.id)} style={styles.badgeRemove}>×</button>
          </div>
        ))}
      </div>
      <form onSubmit={onAdd} style={styles.addForm}>
        <h4>Add Skill</h4>
        <div style={styles.row}>
          <input {...register('name')} placeholder="Skill name *" style={styles.input} required />
          <input {...register('category')} placeholder="Category (e.g. Languages)" style={styles.input} />
          <input {...register('level')} placeholder="Level (e.g. Expert)" style={styles.input} />
        </div>
        <button type="submit" disabled={addMutation.isPending} style={styles.saveBtn}>Add</button>
      </form>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 800, margin: '0 auto', padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pdfBtn: { padding: '8px 16px', background: '#10b981', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14 },
  tabs: { display: 'flex', gap: 4, borderBottom: '1px solid #e5e7eb', marginBottom: 24 },
  tab: { padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', fontSize: 14 },
  activeTab: { borderBottomColor: '#3b82f6', color: '#3b82f6', fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  section: { display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  input: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: '100%', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', alignSelf: 'flex-start' },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#f9fafb' },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 },
  dateRange: { fontSize: 12, color: '#6b7280' },
  desc: { fontSize: 13, color: '#374151', marginTop: 6, marginBottom: 6 },
  deleteBtn: { marginTop: 8, padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
  addForm: { border: '1px dashed #d1d5db', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', gap: 8 },
  skillBadge: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, fontSize: 13 },
  badgeRemove: { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 16, padding: 0, lineHeight: 1 },
}
