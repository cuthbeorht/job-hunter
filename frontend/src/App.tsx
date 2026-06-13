import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { isAuthenticated, useLogout } from './hooks/useAuth'
import ApplicationsPage from './pages/ApplicationsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResumePage from './pages/ResumePage'

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

function Nav() {
  const logout = useLogout()
  if (!isAuthenticated()) return null
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Job Hunter</span>
      <div style={styles.navLinks}>
        <a href="/resumes" style={styles.navLink}>Resumes</a>
        <a href="/applications" style={styles.navLink}>Applications</a>
      </div>
      <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
    </nav>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Nav />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/resumes" element={<PrivateRoute><ResumePage /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated() ? '/resumes' : '/login'} replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: { height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #e5e7eb', gap: 24, background: '#fff' },
  brand: { fontWeight: 700, fontSize: 18, color: '#1f2937' },
  navLinks: { display: 'flex', gap: 16, flex: 1 },
  navLink: { color: '#4b5563', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  logoutBtn: { marginLeft: 'auto', padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff', fontSize: 13 },
}
