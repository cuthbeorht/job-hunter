import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Resume } from '../../types/resume'

Font.register({ family: 'Helvetica' })

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 11, padding: 40, color: '#1f2937' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  contact: { fontSize: 9, color: '#6b7280', marginBottom: 16, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#d1d5db', marginBottom: 8, paddingBottom: 2, marginTop: 14 },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  entryTitle: { fontWeight: 'bold' },
  entryDate: { fontSize: 9, color: '#6b7280' },
  description: { fontSize: 10, color: '#374151', marginTop: 3 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillBadge: { fontSize: 9, padding: '2px 8px', backgroundColor: '#f3f4f6', borderRadius: 4 },
})

export default function ResumePDFDocument({ resume }: { resume: Resume }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {resume.full_name && <Text style={styles.name}>{resume.full_name}</Text>}
        <View style={styles.contact}>
          {resume.email && <Text>{resume.email}</Text>}
          {resume.phone && <Text>{resume.phone}</Text>}
          {resume.location && <Text>{resume.location}</Text>}
          {resume.linkedin_url && <Text>{resume.linkedin_url}</Text>}
          {resume.github_url && <Text>{resume.github_url}</Text>}
          {resume.website_url && <Text>{resume.website_url}</Text>}
        </View>

        {resume.summary && (
          <>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.description}>{resume.summary}</Text>
          </>
        )}

        {resume.work_experiences.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.work_experiences.map((we) => (
              <View key={we.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{we.title} — {we.company}</Text>
                  <Text style={styles.entryDate}>
                    {we.start_date ?? ''}{we.end_date ? ` – ${we.end_date}` : we.start_date ? ' – Present' : ''}
                  </Text>
                </View>
                {we.description && <Text style={styles.description}>{we.description}</Text>}
              </View>
            ))}
          </>
        )}

        {resume.educations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.educations.map((ed) => (
              <View key={ed.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {[ed.degree, ed.field_of_study].filter(Boolean).join(' in ')} — {ed.institution}
                  </Text>
                  <Text style={styles.entryDate}>
                    {ed.start_date ?? ''}{ed.end_date ? ` – ${ed.end_date}` : ''}
                  </Text>
                </View>
                {ed.description && <Text style={styles.description}>{ed.description}</Text>}
              </View>
            ))}
          </>
        )}

        {resume.skills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillRow}>
              {resume.skills.map((sk) => (
                <Text key={sk.id} style={styles.skillBadge}>{sk.name}</Text>
              ))}
            </View>
          </>
        )}
      </Page>
    </Document>
  )
}
