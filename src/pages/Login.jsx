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
  const [logoAnim, setLogoAnim] = useState(false)
  const videoRef = useRef(null)

  // Logo animation replay every 8 seconds
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
      setLogoAnim(true)
      setTimeout(() => setLogoAnim(false), 1500)
    }
    playVideo()
    const interval = setInterval(playVideo, 8000)
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
      setError('Email not found. Please check your email and try again.')
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

  const handleGoogleLogin = () => {
    setError('Google Sign-In coming soon!')
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.06); filter: brightness(1.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .login-input:focus {
          border-color: rgba(139, 92, 246, 0.6) !important;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.15) !important;
        }
        .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(139,92,246,0.4) !important; }
        .google-btn:hover { background: rgba(255,255,255,1) !important; transform: translateY(-1px); }
        .tab-btn:hover { color: rgba(255,255,255,0.9) !important; }
      `}</style>

      {/* Background orbs */}
      <div style={S.orb1} />
      <div style={S.orb2} />
      <div style={S.orb3} />

      {/* Logo section */}
      <div style={{ ...S.logoWrap, animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Laser glow rings */}
        <div style={S.laserRing1} />
        <div style={S.laserRing2} />
        {/* Glow pulse behind logo */}
        <div style={{ ...S.glowBg, animation: logoAnim ? 'glowPulse 1.5s ease-in-out' : 'none' }} />
        {/* Logo circle */}
        <div style={{ ...S.logoCircle, animation: logoAnim ? 'logoPulse 1.5s ease-in-out' : 'none' }}>
          <video
            ref={videoRef}
            src="/logo-anim.mp4"
            muted
            playsInline
            style={S.logoVideo}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
          <div style={{ ...S.logoFallback, display: 'none' }}>🎵</div>
        </div>
      </div>

      {/* Title */}
      <h1 style={{ ...S.title, animation: 'fadeInUp 0.8s ease-out 0.15s both' }}>School of Motesart</h1>
      <p style={{ ...S.subtitle, animation: 'fadeInUp 0.8s ease-out 0.3s both' }}>Find the Note • Master Your Ear</p>

      {/* Card */}
      <div style={{ ...S.card, animation: 'fadeInUp 0.8s ease-out 0.45s both' }}>
        {/* Tabs */}
        <div style={S.tabs}>
          <button
            className="tab-btn"
            onClick={() => { setTab('signin'); setError('') }}
            style={{ ...S.tab, ...(tab === 'signin' ? S.tabActive : {}) }}
          >Sign In</button>
          <button
            className="tab-btn"
            onClick={() => { setTab('register'); setError('') }}
            style={{ ...S.tab, ...(tab === 'register' ? S.tabActive : {}) }}
          >Register</button>
        </div>

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <label style={S.label}>Email Address</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@motesart.com"
              required
              style={S.input}
            />
            <label style={S.label}>Password</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={S.input}
            />
            {error && <p style={S.error}>{error}</p>}
            <button className="login-btn" type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Signing In...' : '→ Sign In'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <label style={S.label}>Full Name</label>
            <input
              className="login-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
              style={S.input}
            />
            <label style={S.label}>Email Address</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@motesart.com"
              required
              style={S.input}
            />
            <label style={S.label}>Password</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              style={S.input}
            />
            <label style={S.label}>I am a...</label>
            <div style={S.roleRow}>
              {['Student', 'Teacher', 'Parent', 'Admin', 'Ambassador'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{ ...S.roleBtn, ...(role === r ? S.roleBtnActive : {}) }}
                >{r}</button>
              ))}
            </div>
            {error && <p style={S.error}>{error}</p>}
            <button className="login-btn" type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Creating Account...' : '→ Create Account'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or</span>
          <div style={S.dividerLine} />
        </div>

        {/* Google button */}
        <button className="google-btn" onClick={handleGoogleLogin} style={S.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ marginLeft: 10 }}>Continue with Google</span>
        </button>
      </div>

      {/* Footer */}
      <div style={S.footer}>
        <span>Powered by T.A.M.i Intelligence</span>
        <span style={S.footerDot}>•</span>
        <span>Frontend Preview</span>
      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0118 0%, #1a0a2e 30%, #0f172a 70%, #0a0118 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    padding: '40px 20px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw',
    borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'fixed', bottom: '-20%', right: '-10%', width: '40vw', height: '40vw',
    borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'fixed', top: '40%', right: '20%', width: '30vw', height: '30vw',
    borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  logoWrap: {
    position: 'relative',
    width: 150, height: 150,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  laserRing1: {
    position: 'absolute', inset: -8,
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: 'rgba(139, 92, 246, 0.6)',
    borderRightColor: 'rgba(6, 182, 212, 0.4)',
    animation: 'spin 3s linear infinite',
    filter: 'blur(1px)',
  },
  laserRing2: {
    position: 'absolute', inset: -16,
    borderRadius: '50%',
    border: '1.5px solid transparent',
    borderBottomColor: 'rgba(168, 85, 247, 0.4)',
    borderLeftColor: 'rgba(34, 211, 238, 0.3)',
    animation: 'spinReverse 4s linear infinite',
    filter: 'blur(2px)',
  },
  glowBg: {
    position: 'absolute', inset: -20,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  logoCircle: {
    width: 130, height: 130,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)',
    position: 'relative',
    zIndex: 2,
  },
  logoVideo: {
    width: '115%', height: '115%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  logoFallback: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 50,
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    borderRadius: '50%',
  },
  title: {
    color: '#fff', fontSize: 28, fontWeight: 800, margin: 0,
    letterSpacing: '-0.5px', textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 8, marginBottom: 32,
    letterSpacing: '0.5px', textAlign: 'center',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '32px 36px',
    width: '100%', maxWidth: 400,
    backdropFilter: 'blur(20px)',
    position: 'relative',
  },
  tabs: {
    display: 'flex', gap: 4,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1, padding: '10px 0',
    border: 'none', borderRadius: 10,
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14, fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tabActive: {
    background: 'rgba(139, 92, 246, 0.2)',
    color: '#a78bfa',
    boxShadow: '0 2px 10px rgba(139,92,246,0.15)',
  },
  label: {
    color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500,
    display: 'block', marginBottom: 8, marginTop: 16,
  },
  input: {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 15, outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  },
  roleRow: {
    display: 'flex', gap: 8, marginTop: 8,
  },
  roleBtn: {
    flex: 1, padding: '10px 0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  roleBtnActive: {
    background: 'rgba(20, 184, 166, 0.15)',
    borderColor: 'rgba(20, 184, 166, 0.4)',
    color: '#2dd4bf',
  },
  error: {
    color: '#f87171', fontSize: 13, marginTop: 12, marginBottom: 0,
  },
  btn: {
    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
    marginTop: 20,
    boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1, height: 1,
    background: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)', fontSize: 13,
  },
  googleBtn: {
    width: '100%', padding: '12px', borderRadius: 12,
    border: 'none',
    background: 'rgba(255,255,255,0.92)',
    color: '#1f2937', fontSize: 14, fontWeight: 600,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  footer: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'rgba(15,12,30,0.95)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '12px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 12,
    color: 'rgba(255,255,255,0.4)', fontSize: 13,
    zIndex: 100,
  },
  footerDot: {
    color: 'rgba(255,255,255,0.2)',
  },
}
