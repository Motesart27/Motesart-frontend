import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api.js'

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
    try {
      const user = await api.login(email)
      onLogin(user)
    } catch (err) {
      setError('Email not found. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await api.register({ name, email, password, role })
      onLogin(user)
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes laserSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />
      <div style={styles.glowLeft} />

      {/* Logo with laser glow */}
      <div style={styles.logoWrapper}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '155px', height: '155px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#d946ef', borderRightColor: '#a855f7', animation: 'laserSpin 3s linear infinite', filter: 'drop-shadow(0 0 8px rgba(217,70,239,0.6)) drop-shadow(0 0 20px rgba(168,85,247,0.3))' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '165px', height: '165px', borderRadius: '50%', border: '1px solid transparent', borderBottomColor: '#06b6d4', borderLeftColor: '#8b5cf6', animation: 'laserSpin 5s linear infinite reverse', filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.4)) drop-shadow(0 0 15px rgba(139,92,246,0.2))' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)', filter: 'blur(15px)', pointerEvents: 'none', animation: 'glowPulse 4s ease-in-out infinite' }} />
        <div style={styles.logoCircle}>
          <video ref={videoRef} src="/logo-anim.mp4" muted playsInline style={styles.logoVideo}
            onError={(e) => { e.target.style.display = 'none'; const img = document.createElement('img'); img.src = '/logo.png'; img.style.cssText = 'width:130px;height:130px;object-fit:contain;'; img.onerror = () => { e.target.parentElement.innerHTML = '<span style="font-size:48px">🎵</span>' }; e.target.parentElement.appendChild(img) }} />
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
          {tab === 'register' && (<><label style={styles.label}>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required style={styles.input} onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} /></>)}
          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={styles.input} onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          <label style={styles.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required={tab === 'register'} style={styles.input} onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          {tab === 'register' && (<><label style={styles.label}>Role</label><div style={styles.roleRow}><button type="button" onClick={() => setRole('Student')} style={role === 'Student' ? styles.roleActive : styles.roleInactive}>🎵 Student</button><button type="button" onClick={() => setRole('Teacher')} style={role === 'Teacher' ? styles.roleActive : styles.roleInactive}>🎹 Teacher</button></div></>)}
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>{loading ? (tab === 'signin' ? 'Signing in...' : 'Creating account...') : (tab === 'signin' ? 'Sign In' : 'Create Account')}</button>
        </form>

        {tab === 'signin' && <p style={styles.switchText}>Don't have an account? <span onClick={() => { setTab('register'); setError('') }} style={styles.switchLink}>Register here</span></p>}
        {tab === 'register' && <p style={styles.switchText}>Already have an account? <span onClick={() => { setTab('signin'); setError('') }} style={styles.switchLink}>Sign in here</span></p>}

        <div style={styles.divider}><div style={styles.dividerLine} /><span style={styles.dividerText}>or continue with</span><div style={styles.dividerLine} /></div>

        <button onClick={() => setError('Google Sign-In coming soon!')} style={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 8 }}><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
          Continue with Google
        </button>
      </div>

      <div style={styles.footer}><span>Frontend Preview Only. Please wake servers to enable backend functionality.</span><button onClick={() => { fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/').then(() => alert('Server is awake! ✅')).catch(() => alert('Server may be starting up... try again in 30s')) }} style={styles.wakeBtn}>Wake up servers</button></div>
      <div style={{ position: 'fixed', bottom: '12px', right: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', zIndex: 101 }}>🎵 School of Motesart</div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1a 0%, #1a1035 30%, #120e2a 70%, #0a0612 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden', padding: '40px 20px 80px' },
  glowTop: { position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
  glowBottom: { position: 'absolute', bottom: '-100px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '300px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  glowLeft: { position: 'absolute', top: '30%', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(217,70,239,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  logoWrapper: { position: 'relative', marginBottom: '24px', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoCircle: { position: 'relative', width: '140px', height: '140px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(168,85,247,0.3), 0 0 80px rgba(168,85,247,0.15)', overflow: 'hidden', zIndex: 2 },
  logoVideo: { width: '130px', height: '130px', objectFit: 'contain', background: '#fff' },
  title: { color: '#fff', fontSize: '34px', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.5px', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' },
  titleAccent: { color: '#d946ef', textShadow: '0 0 30px rgba(217,70,239,0.3)' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '32px', letterSpacing: '2px', textAlign: 'center', textTransform: 'uppercase', animation: 'fadeInUp 0.6s ease-out 0.1s both' },
  card: { background: 'rgba(15,12,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(20px)', animation: 'fadeInUp 0.6s ease-out 0.2s both' },
  tabRow: { display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '20px' },
  tabActive: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #14b8a6)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  tabInactive: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  label: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500', marginBottom: '6px', marginTop: '16px' },
  input: { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.3s' },
  roleRow: { display: 'flex', gap: '8px', marginTop: '4px' },
  roleActive: { flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #10b981', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  roleInactive: { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  error: { color: '#f87171', fontSize: '13px', marginTop: '12px', textAlign: 'center' },
  submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '20px', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 15px rgba(16,185,129,0.3)' },
  switchText: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', marginTop: '16px' },
  switchLink: { color: '#d946ef', cursor: 'pointer', fontWeight: '500' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 16px' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', whiteSpace: 'nowrap' },
  googleBtn: { width: '100%', padding: '12px', background: '#fff', border: 'none', borderRadius: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" },
  footer: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15,12,30,0.95)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', zIndex: 100, flexWrap: 'wrap', textAlign: 'center' },
  wakeBtn: { padding: '6px 16px', background: 'linear-gradient(135deg, #d946ef, #a855f7)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
}
