import { useState, useEffect } from 'react'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function StudentDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch(`${BASE}/students`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: '#0d0d1a',
      minHeight: '100vh',
      color: '#fff',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0d0d16',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>🎵</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Motesart</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Student Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{user?.name || 'Student'}</span>
          <button onClick={onLogout} style={{
            padding: '6px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>Logout</button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          Welcome back, {user?.name || 'Student'}!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
          Your practice dashboard is loading...
        </p>

        {/* DPM Card */}
        <div style={{
          background: '#151520', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 24, marginBottom: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Your DPM Score</div>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            border: '4px solid #a855f7',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#a855f7',
          }}>
            {user?.dpm || '—'}%
          </div>
          <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            Drive · Passion · Motivation
          </div>
        </div>

        {/* Placeholder cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{
            background: '#151520', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 24,
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Weekly Practice</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{user?.weekly_minutes || 0} min</div>
          </div>
          <div style={{
            background: '#151520', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 24,
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Active Homework</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>—</div>
          </div>
        </div>
      </main>
    </div>
  )
}
