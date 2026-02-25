import { useState } from 'react'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Student')
  const [tab, setTab] = useState('signin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
     const res = await fetch(`${BASE}/api/users/by-email/${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      onLogin(data.user || data)
    } catch (err) {
      setError('Login failed. Check your email and try again.')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      if (!res.ok) throw new Error('Registration failed')
      const data = await res.json()
      onLogin(data.user || data)
    } catch (err) {
      setError('Registration failed. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1035 50%, #0d0d1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#151520',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '40px 32px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, marginBottom: 12,
            boxShadow: '0 0 30px rgba(168,85,247,0.4)',
          }}>🎵</div>
          <h1 style={{
            color: '#fff', fontSize: 24, fontWeight: 800,
            margin: '0 0 4px 0', letterSpacing: '-0.5px',
          }}>School of Motesart</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
            Powered by T.A.M.i
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 24,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12, padding: 4,
        }}>
          <button onClick={() => { setTab('signin'); setError('') }} style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            background: tab === 'signin' ? 'rgba(168,85,247,0.2)' : 'transparent',
            color: tab === 'signin' ? '#a855f7' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s',
          }}>Sign In</button>
          <button onClick={() => { setTab('register'); setError('') }} style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            background: tab === 'register' ? 'rgba(168,85,247,0.2)' : 'transparent',
            color: tab === 'register' ? '#a855f7' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s',
          }}>Register</button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 16,
            background: 'rgba(255,77,106,0.1)', color: '#ff4d6a',
            fontSize: 13, textAlign: 'center',
          }}>{error}</div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
              style={inputStyle}
            />
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>Role</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, marginTop: 6 }}>
              {['Student', 'Teacher', 'Parent'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  border: role === r ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
                  background: role === r ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                  color: role === r ? '#a855f7' : 'rgba(255,255,255,0.5)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>{r}</button>
              ))}
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Google SSO placeholder */}
        <div style={{
          textAlign: 'center', marginTop: 20,
          paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button style={{
            width: '100%', padding: '12px 0', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>G</span>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  fontSize: 15,
  marginTop: 6,
  marginBottom: 16,
  outline: 'none',
  boxSizing: 'border-box',
}

const btnStyle = {
  width: '100%',
  padding: '14px 0',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
}
