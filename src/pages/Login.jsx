import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const user = await api.login(email)
        login(user)
        navigate('/dashboard')
      } else {
        const user = await api.register({ name, email, password, role })
        login(user)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(isLogin ? 'Email not found. Please check and try again.' : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (toLogin) => { setIsLogin(toLogin); setError('') }

  return (
    <div style={S.body}>
      <div style={S.glowTop} />
      <div style={S.glowBottom} />
      <div style={S.glowLeft} />

      {/* Logo */}
      <div style={S.logoWrapper}>
        <div style={S.laserRing1} />
        <div style={S.laserRing2} />
        <div style={S.logoRadialGlow} />
        <div style={S.logoCircle}>
          <span style={{ fontSize: 60 }}>🎵</span>
        </div>
      </div>

      <h1 style={S.appTitle}>School of <span style={S.accent}>Motesart</span></h1>
      <p style={S.tagline}>Find the Note • Master Your Ear</p>

      {/* Auth Card */}
      <div style={S.authCard}>
        <div style={S.tabs}>
          <button style={isLogin ? S.tabActive : S.tabInactive} onClick={() => switchTab(true)}>Sign In</button>
          <button style={!isLogin ? S.tabActive : S.tabInactive} onClick={() => switchTab(false)}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label style={S.label}>Full Name</label>
              <input style={S.input} type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <label style={S.label}>Email</label>
          <input style={S.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />

          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />

          {!isLogin && (
            <div>
              <label style={S.label}>Role</label>
              <div style={S.roleRow}>
                {['Student', 'Teacher', 'Parent'].map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    style={role === r ? S.roleActive : S.roleInactive}>
                    {r === 'Student' ? '🎵' : r === 'Teacher' ? '🎹' : '👨‍👩‍👧'} {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p style={S.error}>{error}</p>}

          <button type="submit" style={S.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={S.switchText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={S.switchLink} onClick={() => switchTab(!isLogin)}>
            {isLogin ? 'Register here' : 'Sign in here'}
          </span>
        </p>

        <div style={S.divider}><div style={S.dividerLine} /><span style={S.dividerText}>or continue with</span><div style={S.dividerLine} /></div>

        <button style={S.googleBtn} onClick={() => setError('Google Sign-In coming soon!')}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 8 }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div style={S.footer}>
        <span>Frontend Preview Only. Please wake servers to enable backend functionality.</span>
        <button style={S.wakeBtn} onClick={() => api.wake().then(() => alert('Server is awake!')).catch(() => alert('Server may be starting up...'))}>Wake up servers</button>
      </div>

      <style>{`
        @keyframes laserSpin { 0% { transform: translate(-50%,-50%) rotate(0deg) } 100% { transform: translate(-50%,-50%) rotate(360deg) } }
        @keyframes glowPulse { 0%,100% { opacity: .4 } 50% { opacity: .7 } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

const S = {
  body: { minHeight: '100vh', background: 'linear-gradient(180deg,#0f0a1a 0%,#1a1035 30%,#120e2a 70%,#0a0612 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 80px', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif", color: '#fff' },
  glowTop: { position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(168,85,247,.15) 0%,transparent 70%)', pointerEvents: 'none' },
  glowBottom: { position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 300, background: 'radial-gradient(ellipse,rgba(59,130,246,.08) 0%,transparent 70%)', pointerEvents: 'none' },
  glowLeft: { position: 'absolute', top: '30%', left: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(217,70,239,.06) 0%,transparent 70%)', pointerEvents: 'none' },
  logoWrapper: { position: 'relative', marginBottom: 24, width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  laserRing1: { position: 'absolute', top: '50%', left: '50%', width: 155, height: 155, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#d946ef', borderRightColor: '#a855f7', animation: 'laserSpin 3s linear infinite', filter: 'drop-shadow(0 0 8px rgba(217,70,239,.6)) drop-shadow(0 0 20px rgba(168,85,247,.3))' },
  laserRing2: { position: 'absolute', top: '50%', left: '50%', width: 165, height: 165, borderRadius: '50%', border: '1px solid transparent', borderBottomColor: '#06b6d4', borderLeftColor: '#8b5cf6', animation: 'laserSpin 5s linear infinite reverse', filter: 'drop-shadow(0 0 6px rgba(6,182,212,.4)) drop-shadow(0 0 15px rgba(139,92,246,.2))' },
  logoRadialGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,.3) 0%,rgba(139,92,246,.1) 40%,transparent 70%)', filter: 'blur(15px)', pointerEvents: 'none', animation: 'glowPulse 4s ease-in-out infinite' },
  logoCircle: { position: 'relative', width: 140, height: 140, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(168,85,247,.3),0 0 80px rgba(168,85,247,.15)', overflow: 'hidden', zIndex: 2 },
  appTitle: { fontSize: 34, fontWeight: 700, marginBottom: 4, letterSpacing: -.5, textAlign: 'center', animation: 'fadeInUp .6s ease-out' },
  accent: { color: '#d946ef', textShadow: '0 0 30px rgba(217,70,239,.3)' },
  tagline: { color: 'rgba(255,255,255,.45)', fontSize: 14, marginBottom: 32, letterSpacing: 2, textAlign: 'center', textTransform: 'uppercase', animation: 'fadeInUp .6s ease-out .1s both' },
  authCard: { background: 'rgba(15,12,30,.8)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420, backdropFilter: 'blur(20px)', animation: 'fadeInUp .6s ease-out .2s both' },
  tabs: { display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabActive: { flex: 1, padding: 10, borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", background: 'linear-gradient(135deg,#10b981,#14b8a6)', color: '#fff', transition: '.3s' },
  tabInactive: { flex: 1, padding: 10, borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", background: 'transparent', color: 'rgba(255,255,255,.5)', transition: '.3s' },
  label: { display: 'block', color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 500, marginBottom: 6, marginTop: 16 },
  input: { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .3s' },
  roleRow: { display: 'flex', gap: 8, marginTop: 4 },
  roleActive: { flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", border: '2px solid #10b981', background: 'rgba(16,185,129,.1)', color: '#10b981', transition: '.2s' },
  roleInactive: { flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: 'rgba(255,255,255,.5)', transition: '.2s' },
  error: { color: '#f87171', fontSize: 13, marginTop: 12, textAlign: 'center' },
  submitBtn: { width: '100%', padding: 14, background: 'linear-gradient(135deg,#10b981,#14b8a6)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 20, fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 15px rgba(16,185,129,.3)', transition: 'opacity .2s' },
  switchText: { color: 'rgba(255,255,255,.5)', fontSize: 13, textAlign: 'center', marginTop: 16 },
  switchLink: { color: '#d946ef', cursor: 'pointer', fontWeight: 500 },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,.1)' },
  dividerText: { color: 'rgba(255,255,255,.35)', fontSize: 12, whiteSpace: 'nowrap' },
  googleBtn: { width: '100%', padding: 12, background: '#fff', border: 'none', borderRadius: 12, color: '#1f2937', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", transition: 'background .2s' },
  footer: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15,12,30,.95)', borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,.6)', fontSize: 13, zIndex: 100, flexWrap: 'wrap', textAlign: 'center' },
  wakeBtn: { padding: '6px 16px', background: 'linear-gradient(135deg,#d946ef,#a855f7)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
}
