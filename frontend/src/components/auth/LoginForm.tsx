import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { useLogin } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginForm() {
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit((data) => login.mutate(data))} style={styles.form} noValidate>
      <h2>Sign In</h2>
      <div style={styles.field}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" {...register('email')} style={styles.input} />
        {errors.email && <span style={styles.error}>{errors.email.message}</span>}
      </div>
      <div style={styles.field}>
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" {...register('password')} style={styles.input} />
        {errors.password && <span style={styles.error}>{errors.password.message}</span>}
      </div>
      {login.isError && <span style={styles.error}>Invalid credentials</span>}
      <button type="submit" disabled={login.isPending} style={styles.button}>
        {login.isPending ? 'Signing in…' : 'Sign In'}
      </button>
      <p style={{ marginTop: 12, textAlign: 'center' }}>
        No account? <Link to="/register">Register</Link>
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
