import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api.js'

// Known accounts for demo fallback when backend auth is down
const KNOWN_ACCOUNTS = {
  'motesproductions1@gmail.com': { name: 'Motesart', role: 'Teacher' },
  'motesarttech@gmail.com': { name: 'Damion Admin', role: 'Teacher' },
  'reneetaylor88@gmail.com': { name: 'Renee Taylor', role: 'Student' },
  'damotes@gmail.com': { name: 'Dwain M', role: 'Student' },
  'evaldez28@gmail.com': { name: 'Evelyn Valdez', role: 'Student' },
}

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const videoRef = useRef(null)

  useEffect(() => {
    const playAnimation = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
    }
    playAnimation()
    const interval = setInterval(playAnimation, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Direct demo login — no API calls
    const lower = email.toLowerCase().trim()
    const known = KNOWN_ACCOUNTS[lower]
    if (known) {
      onLogin({ id: 'demo-' + Date.now(), name: known.name, email: lower, role: known.role })
    } else if (lower.includes('teacher') || lower.includes('motesart')) {
      onLogin({ id: 'demo-' + Date.now(), name: 'Demo Teacher', email: lower, role: 'Teacher' })
    } else if (lower.includes('@')) {
      onLogin({ id: 'demo-' + Date.now(), name: 'Demo Student', email: lower, role: 'Student' })
    } else {
      setError('Please enter a valid email.')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await api.register({ name, email, password, role })
      onLogin(user)
    } catch (err) {
      // Demo fallback for registration
      if (name && email) {
        onLogin({ id: 'demo-' + Date.now(), name, email, role })
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* Logo */}
      <div style={styles.logoWrapper}>
        <div style={styles.logoGlow} />
        <div style={styles.logoCircle}>
          <video ref={videoRef} src="/logo-anim.mp4" muted playsInline style={styles.logoVideo}
            onError={(e) => {
              e.target.style.display = 'none'
              const img = document.createElement('img')
              img.src = '/logo.png'
              img.style.cssText = 'width:130px;height:130px;object-fit:contain;'
              img.onerror = () => { e.target.parentElement.innerHTML = '<span style="font-size:48px">🎵</span>' }
              e.target.parentElement.appendChild(img)
            }}
          />
        </div>
      </div>

      <h1 style={styles.title}>School of <span style={styles.titleAccent}>Motesart</span></h1>
      <p style={styles.subtitle}>FIND THE NOTE • MASTER YOUR EAR</p>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.tabRow}>
          <button onClick={() => { setTab('signin'); setError('') }}
            style={tab === 'signin' ? styles.tabActive : styles.tabInactive}>Sign In</button>
          <button onClick={() => { setTab('register'); setError('') }}
            style={tab === 'register' ? styles.tabActive : styles.tabInactive}>Register</button>
        </div>

        <form onSubmit={tab === 'signin' ? handleSignIn : handleRegister}>
          {tab === 'register' && (
            <>
              <label style={styles.label}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your full name" required style={styles.input}
                onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </>
          )}

          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" required style={styles.input}
            onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />

          <label style={styles.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required={tab === 'register'} style={styles.input}
            onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />

          {tab === 'register' && (
            <>
              <label style={styles.label}>Role</label>
              <div style={styles.roleRow}>
                <button type="button" onClick={() => setRole('Student')}
                  style={role === 'Student' ? styles.roleActive : styles.roleInactive}>
                  🎵 Student
                </button>
                <button type="button" onClick={() => setRole('Teacher')}
                  style={role === 'Teacher' ? { ...styles.roleActive, borderColor: '#10b981', background: 'rgba(16,185,129,0.15)', color: '#10b981' } : styles.roleInactive}>
                  🏫 Teacher
                </button>
              </div>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {tab === 'signin' && (
          <p style={styles.switchText}>
            Don't have an account?{' '}
            <span onClick={() => { setTab('register'); setError('') }} style={styles.switchLink}>Register here</span>
          </p>
        )}
        {tab === 'register' && (
          <p style={styles.switchText}>
            Already have an account?{' '}
            <span onClick={() => { setTab('signin'); setError('') }} style={styles.switchLink}>Sign in here</span>
          </p>
        )}

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <div style={styles.dividerLine} />
        </div>

        <button onClick={() => setError('Google Sign-In coming soon!')} style={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 8 }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div style={styles.footer}>
        <span>Frontend Preview · Backend auth being configured</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c1e 0%, #1a1035 40%, #0d1025 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'fixed',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'fixed',
    bottom: '-300px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: '20px',
  },
  logoGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
    animation: 'pulse 3s ease-in-out infinite',
  },
  logoCircle: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 80px rgba(168, 85, 247, 0.15)',
    overflow: 'hidden',
  },
  logoVideo: {
    width: '130px',
    height: '130px',
    objectFit: 'contain',
    borderRadius: '50%',
  },
  title: {
    color: '#fff',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px',
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },
  titleAccent: {
    color: '#d946ef',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '13px',
    marginBottom: '32px',
    letterSpacing: '2px',
    textAlign: 'center',
  },
  card: {
    background: 'rgba(15,12,30,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '420px',
    backdropFilter: 'blur(20px)',
  },
  tabRow: {
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '20px',
  },
  tabActive: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tabInactive: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  label: {
    display: 'block',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '6px',
    marginTop: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  },
  roleRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
  },
  roleActive: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '2px solid #d946ef',
    background: 'rgba(217,70,239,0.1)',
    color: '#d946ef',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  roleInactive: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    marginTop: '12px',
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.2s',
  },
  switchText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    textAlign: 'center',
    marginTop: '16px',
  },
  switchLink: {
    color: '#d946ef',
    cursor: 'pointer',
    fontWeight: '600',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  googleBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: '#fff',
    color: '#333',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(15,12,30,0.95)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    zIndex: 100,
  },
}
