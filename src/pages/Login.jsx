import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

export default function Login() {
  const { login } = useAuth()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${api.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Login failed')
      }
      const user = await res.json()
      login(user)
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${api.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Registration failed')
      }
      const user = await res.json()
      login(user)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'Student', icon: '🎵', label: 'Student' },
    { value: 'Teacher', icon: '🎹', label: 'Teacher' },
    { value: 'Parent', icon: '👨‍👩‍👧', label: 'Parent' },
    { value: 'Admin', icon: '🛡️', label: 'Admin' },
    { value: 'Ambassador', icon: '🌟', label: 'Ambassador' },
  ]

  return (
    <div style={styles.container}>
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />
      <div style={styles.logoWrapper}>
        <div style={styles.logoGlow} />
        <div style={styles.logoCircle}>
          <img src="/logo.png" alt="School of Motesart" style={styles.logoImage}
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:32px">🎵</span>' }} />
        </div>
      </div>
      <h1 style={styles.title}>School of <span style={styles.titleAccent}>Motesart</span></h1>
      <p style={styles.subtitle}>Find the Note • Master Your Ear</p>
      <div style={styles.card}>
        <div style={styles.tabRow}>
          <button onClick={() => { setTab('signin'); setError('') }} style={tab === 'signin' ? styles.tabActive : styles.tabInactive}>Sign In</button>
          <button onClick={() => { setTab('register'); setError('') }} style={tab === 'register' ? styles.tabActive : styles.tabInactive}>Register</button>
        </div>
        <form onSubmit={tab === 'signin' ? handleSignIn : handleRegister}>
          {tab === 'register' && (
            <>
              <label style={styles.label}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required style={styles.input} />
            </>
          )}
          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={styles.input} />
          <label style={styles.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={styles.input} />
          {tab === 'register' && (
            <>
              <label style={styles.label}>Role</label>
              <div style={styles.roleGrid}>
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    style={role === r.value ? styles.roleActive : styles.roleInactive}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (tab === 'signin' ? 'Signing in...' : 'Creating account...') : (tab === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        {tab === 'signin' && <p style={styles.switchText}>Don't have an account? <span onClick={() => { setTab('register'); setError('') }} style={styles.switchLink}>Register here</span></p>}
        {tab === 'register' && <p style={styles.switchText}>Already have an account? <span onClick={() => { setTab('signin'); setError('') }} style={styles.switchLink}>Sign in</span></p>}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", padding: 20, position: 'relative', overflow: 'hidden' },
  glowTop: { position: 'fixed', top: '-20%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
  glowBottom: { position: 'fixed', bottom: '-20%', right: '20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,75,138,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
  logoWrapper: { position: 'relative', marginBottom: 16 },
  logoGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,75,138,0.3) 0%, transparent 70%)' },
  logoCircle: { width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(232,75,138,0.2), rgba(249,115,22,0.2))', border: '2px solid rgba(232,75,138,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  logoImage: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' },
  title: { color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.5px', textAlign: 'center' },
  titleAccent: { background: 'linear-gradient(135deg, #e84b8a, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 32, textAlign: 'center' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 420, backdropFilter: 'blur(20px)' },
  tabRow: { display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 },
  tabActive: { flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, rgba(232,75,138,0.2), rgba(249,115,22,0.2))', color: '#fff', fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif" },
  tabInactive: { flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: 14, fontFamily: "'DM Sans', sans-serif" },
  label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 15, marginBottom: 16, boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", outline: 'none' },
  roleGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  roleActive: { padding: '8px 14px', borderRadius: 10, border: '2px solid #e84b8a', cursor: 'pointer', background: 'rgba(232,75,138,0.15)', color: '#fff', fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  roleInactive: { padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontWeight: 400, fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  error: { color: '#f87171', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8 },
  submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e84b8a, #f97316)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 4 },
  switchText: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 20 },
  switchLink: { color: '#e84b8a', cursor: 'pointer', fontWeight: 500 },
}
