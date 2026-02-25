import { useState } from 'react'
import { api } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
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
      const user = await api.login(email)
      login(user)
      navigate('/dashboard')
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
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'Student', icon: '🎓', label: 'Student' },
    { value: 'Teacher', icon: '👩‍🏫', label: 'Teacher' },
    { value: 'Parent', icon: '👨‍👩‍👧', label: 'Parent' },
    { value: 'User', icon: '🎵', label: 'Free Learner' },
  ]

  return (
    <div className="min-h-screen bg-emergent flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="glow-orb w-80 h-80 bg-brand-purple/20 -top-20 -left-20" />
      <div className="glow-orb w-96 h-96 bg-brand-fuchsia/15 top-1/3 -right-40" />
      <div className="glow-orb w-64 h-64 bg-brand-teal/10 bottom-10 left-1/3" />

      <div className="relative mb-6 animate-fade-up">
        <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center relative z-10">
          <img src="/logo.png" alt="School of Motesart" className="w-28 h-28 object-contain"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          <span className="text-6xl hidden items-center justify-center">🎵</span>
        </div>
        <div className="absolute inset-0 w-36 h-36 rounded-full bg-brand-purple/20 blur-2xl animate-pulse-glow" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-1 animate-fade-up animate-delay-100">
        School of <span className="text-brand-fuchsia" style={{ textShadow: '0 0 20px rgba(217,70,239,0.5)' }}>Motesart</span>
      </h1>
      <p className="text-white/40 text-sm mb-8 animate-fade-up animate-delay-200">Find the Note • Master Your Ear</p>

      <div className="glass-card w-full max-w-sm p-6 animate-fade-up animate-delay-300">
        <div className="flex mb-6 bg-white/5 rounded-xl p-1">
          {['signin', 'register'].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? 'bg-gradient-to-r from-brand-teal to-teal-400 text-white shadow-glow-teal' : 'text-white/40 hover:text-white/60'
              }`}>{t === 'signin' ? 'Sign In' : 'Register'}</button>
          ))}
        </div>

        {error && <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={tab === 'signin' ? handleSignIn : handleRegister} className="space-y-4">
          {tab === 'register' && (
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-dark w-full" required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark w-full" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark w-full" required />

          {tab === 'register' && (
            <div className="space-y-2">
              <label className="text-xs text-white/40 font-medium">I am a...</label>
              <div className="flex gap-2 flex-wrap">
                {roles.map((r) => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      role === r.value ? 'bg-brand-teal/20 border border-brand-teal/50 text-brand-teal' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
                    }`}><span>{r.icon}</span> {r.label}</button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-teal w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? '...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-4">
          {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setTab(tab === 'signin' ? 'register' : 'signin'); setError('') }}
            className="text-brand-pink hover:text-brand-pink-light transition">
            {tab === 'signin' ? 'Register' : 'Sign In'}
          </button>
        </p>

        <button className="w-full mt-4 bg-white text-gray-700 font-semibold py-3 px-4 rounded-btn flex items-center justify-center gap-3 hover:bg-gray-100 transition">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </button>
      </div>

      <p className="text-white/15 text-[10px] mt-8 animate-fade-up animate-delay-500">Frontend Preview • School of Motesart © 2025</p>
    </div>
  )
}
