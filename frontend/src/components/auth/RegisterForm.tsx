import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { useRegister } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function RegisterForm() {
  const register_ = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit((data) => register_.mutate(data))} style={styles.form}>
      <h2>Create Account</h2>
      <div style={styles.field}>
        <label>Email</label>
        <input type="email" {...register('email')} style={styles.input} />
        {errors.email && <span style={styles.error}>{errors.email.message}</span>}
      </div>
      <div style={styles.field}>
        <label>Password</label>
        <input type="password" {...register('password')} style={styles.input} />
        {errors.password && <span style={styles.error}>{errors.password.message}</span>}
      </div>
      {register_.isError && <span style={styles.error}>Registration failed. Email may already be taken.</span>}
      <button type="submit" disabled={register_.isPending} style={styles.button}>
        {register_.isPending ? 'Creating account…' : 'Register'}
      </button>
      <p style={{ marginTop: 12, textAlign: 'center' }}>
        Have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  )
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '80px auto', padding: 32, border: '1px solid #e5e7eb', borderRadius: 8 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  input: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 },
  error: { color: '#ef4444', fontSize: 12 },
  button: { padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
}
