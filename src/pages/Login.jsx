import { useState } from 'react'
import { api } from '../services/api'

export default function Login() {
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await api.login(email, password)
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user))
        const roles = result.user.role || []
        if (roles.includes('Teacher') || roles.includes('Admin')) {
          window.location.href = '/teacher'
        } else {
          window.location.href = '/student'
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const result = await api.register({ name, email, password, role })
      if (result.success) {
        setSuccess('Account created! You can now sign in.')
        setTab('signin')
        setName('')
        setPassword('')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>
            <span style={styles.logoEmoji}>🎵</span>
          </div>
        </div>

        <h1 style={styles.title}>School of Motesart</h1>
        <p style={styles.subtitle}>Your musical journey starts here</p>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={tab === 'signin' ? styles.tabActive : styles.tab}
            onClick={() => { setTab('signin'); setError(''); setSuccess('') }}
          >
            Sign In
          </button>
          <button
            style={tab === 'register' ? styles.tabActive : styles.tab}
            onClick={() => { setTab('register'); setError(''); setSuccess('') }}
          >
            Register
          </button>
        </div>

        {/* Error / Success */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} style={styles.form}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />

            {/* Role Selection */}
            <div style={styles.roleSection}>
              <p style={styles.roleLabel}>I am a:</p>
              <div style={styles.roleGrid}>
                {['Student', 'Teacher', 'Parent'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={role === r ? styles.roleActive : styles.roleBtn}
                  >
                    {r === 'Student' ? '🎹' : r === 'Teacher' ? '🎼' : '👨‍👩‍👧'} {r}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p style={styles.footer}>
          Powered by T.A.M.i — Teaching Assistant for Musical intelligence
        </p>
      </div>
    </div>
  )
}


const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 30%, #2d1b69 60%, #1a0a3e 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  logoCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
  },
  logoEmoji: {
    fontSize: '36px',
  },
  title: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    margin: '0 0 24px 0',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  button: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
  },
  roleSection: {
    textAlign: 'left',
  },
  roleLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    margin: '0 0 8px 0',
  },
  roleGrid: {
    display: 'flex',
    gap: '8px',
  },
  roleBtn: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    cursor: 'pointer',
  },
  roleActive: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: '10px',
    border: '1px solid #06b6d4',
    background: 'rgba(6, 182, 212, 0.15)',
    color: '#06b6d4',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '700',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  success: {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: '#86efac',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  footer: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '11px',
    marginTop: '24px',
    marginBottom: '0',
  },
}
