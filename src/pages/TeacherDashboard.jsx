import { useState, useEffect } from 'react'

/* ── API helper ─────────────────────────────────────────── */
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function fetchStudents() {
  try {
    const res = await fetch(`${BASE}/students`)
    if (!res.ok) throw new Error('Failed')
    return await res.json()
  } catch {
    return []
  }
}

/* ── Risk classification logic ──────────────────────────── */
function classifyRisk(s) {
  const dpm = s.dpm ?? s.DPM ?? 0
  const weeklyMin = s.weekly_minutes ?? s.weeklyMinutes ?? 0
  const lastPractice = s.last_practice ?? s.lastPractice ?? null

  let daysSince = 999
  if (lastPractice) {
    daysSince = Math.floor((Date.now() - new Date(lastPractice).getTime()) / 86400000)
  }

  const tags = []
  if (daysSince >= 14) tags.push('zero engagement 14days')
  else if (daysSince >= 7) tags.push('low engagement')
  if (weeklyMin === 0) tags.push('below weekly target')
  if (!lastPractice) tags.push('no practice history')

  let level, label, color, bgColor, dotColor
  if (dpm <= 20 || daysSince >= 14) {
    level = 'red'; label = '🚨 URGENT'; color = '#ff4d6a'; bgColor = 'rgba(255,77,106,0.12)'; dotColor = '#ff4d6a'
  } else if (dpm <= 50 || daysSince >= 7) {
    level = 'orange'; label = '⚠️ Needs Check-in'; color = '#f5a623'; bgColor = 'rgba(245,166,35,0.12)'; dotColor = '#f5a623'
  } else if (dpm <= 70) {
    level = 'yellow'; label = '📋 Watch Closely'; color = '#f5d423'; bgColor = 'rgba(245,212,35,0.12)'; dotColor = '#f5d423'
  } else {
    level = 'green'; label = '✅ On Track'; color = '#34d399'; bgColor = 'rgba(52,211,153,0.12)'; dotColor = '#34d399'
  }

  return { level, label, color, bgColor, dotColor, tags, dpm, weeklyMin, daysSince, lastPractice }
}

/* ── Risk summary card config ───────────────────────────── */
const RISK_CARDS = [
  { key: 'all',    emoji: '',   label: 'Total Students', color: '#fff',    bg: 'rgba(255,255,255,0.05)' },
  { key: 'red',    emoji: '🔴', label: 'Red Alert',      color: '#ff4d6a', bg: 'rgba(255,77,106,0.08)' },
  { key: 'orange', emoji: '⚠️', label: 'Check-in Needed', color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
  { key: 'yellow', emoji: '📋', label: 'Watch Closely',  color: '#f5d423', bg: 'rgba(245,212,35,0.08)' },
  { key: 'green',  emoji: '✅', label: 'On Track',       color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
]

/* ── Student Card Component ─────────────────────────────── */
function StudentCard({ student, risk }) {
  const { name, level: studentLevel, instrument } = student
  const { label, color, bgColor, dotColor, tags, dpm, weeklyMin, daysSince, lastPractice } = risk

  const lastPracticeText = !lastPractice
    ? 'No practice history'
    : daysSince === 0 ? 'Today'
    : daysSince === 1 ? 'Yesterday'
    : `${daysSince} days ago`

  // Streak + accuracy (if available)
  const streak = student.streak ?? student.best_streak ?? null
  const accuracy = student.accuracy ?? null

  return (
    <div style={{
      background: '#151520',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Header row: avatar + name + risk badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar circle */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}44, ${color}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 18,
            position: 'relative',
          }}>
            {name?.[0] || '?'}
            {/* Small dot indicator */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 10, height: 10, borderRadius: '50%',
              background: dotColor, border: '2px solid #151520',
            }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{name}</div>
          </div>
        </div>
        {/* Risk badge */}
        <span style={{
          padding: '4px 12px', borderRadius: 8,
          background: bgColor, color, fontWeight: 600, fontSize: 13,
        }}>
          {label}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatPill dot={dotColor} label="DPM" value={`${dpm}%`} bold />
        <StatPill label="Practice" value={`${weeklyMin} min`} />
      </div>

      {/* Risk tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.map(t => (
            <span key={t} style={{
              padding: '3px 10px', borderRadius: 6,
              background: 'rgba(255,77,106,0.12)', color: '#ff8a9e',
              fontSize: 12, fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Last practice */}
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
        Last practice: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{lastPracticeText}</span>
      </div>

      {/* Streak / accuracy bar */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 10, padding: '8px 14px',
        color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center',
      }}>
        {streak && accuracy
          ? <span>🔥 {streak} streak · {accuracy}% accuracy</span>
          : 'No stats yet'}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <ActionBtn label="View Details" variant="ghost" />
        <ActionBtn label="💬" variant="icon" />
        <ActionBtn label="Assign HW" variant="primary" />
      </div>
    </div>
  )
}

function StatPill({ dot, label, value, bold }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
      {dot && <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />}
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}:</span>
      <span style={{ color: bold ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  )
}

function ActionBtn({ label, variant }) {
  const styles = {
    ghost: {
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.1)',
      flex: 1,
    },
    icon: {
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.1)',
      width: 44, minWidth: 44,
    },
    primary: {
      background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      color: '#fff',
      border: 'none',
      flex: 1,
    },
  }
  return (
    <button style={{
      padding: '10px 16px', borderRadius: 10,
      fontWeight: 600, fontSize: 14, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s',
      ...styles[variant],
    }}>
      {label}
    </button>
  )
}

/* ── Filter Button ──────────────────────────────────────── */
function FilterBtn({ active, emoji, label, count, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 20,
      background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
      border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
      color: active ? '#fff' : 'rgba(255,255,255,0.6)',
      fontWeight: 600, fontSize: 14, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      transition: 'all 0.2s',
    }}>
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
      <span style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '1px 8px', borderRadius: 10,
        fontSize: 12, color: color || 'rgba(255,255,255,0.5)',
      }}>{count}</span>
    </button>
  )
}

/* ── Main TeacherDashboard ──────────────────────────────── */
export default function TeacherDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('dashboard') // dashboard, calendar, game

  useEffect(() => {
    fetchStudents().then(data => {
      // Normalize data from API
      const normalized = (Array.isArray(data) ? data : data?.records || []).map(s => {
        const f = s.fields || s
        return {
          id: s.id || f.id || Math.random().toString(36),
          name: f['Students Name'] || f['Student / User Name'] || f.name || 'Unknown',
          level: f.Level || f.level || 'Beginner',
          instrument: f.Instrument || f.instrument || '',
          dpm: parseFloat(f['DPM%'] || f.dpm || f.DPM || 0),
          weekly_minutes: parseFloat(f['Weekly Practice Minutes'] || f.weekly_minutes || f.weeklyMinutes || 0),
          last_practice: f['Last Practice'] || f.last_practice || f.lastPractice || null,
          streak: f['Best Streak'] || f.streak || null,
          accuracy: f.Accuracy || f.accuracy || null,
          status: f['DPM Status'] || f.status || '',
        }
      })
      setStudents(normalized)
      setLoading(false)
    })
  }, [])

  // Classify each student
  const classified = students.map(s => ({ student: s, risk: classifyRisk(s) }))

  // Count by risk level
  const counts = { all: classified.length, red: 0, orange: 0, yellow: 0, green: 0 }
  classified.forEach(({ risk }) => { counts[risk.level]++ })

  // Filter
  const filtered = filter === 'all' ? classified : classified.filter(({ risk }) => risk.level === filter)

  // Sort: red first, then orange, yellow, green
  const order = { red: 0, orange: 1, yellow: 2, green: 3 }
  filtered.sort((a, b) => order[a.risk.level] - order[b.risk.level])

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: '#0d0d1a',
      minHeight: '100vh',
      color: '#fff',
    }}>
      {/* ── Top Header Bar ────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0d0d16',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>← ADMIN</span>
          {/* Logo / avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 0 16px rgba(168,85,247,0.4)',
          }}>🎵</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Motesart</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              T.A.M.i ⊙ Teacher Dashboard
            </div>
          </div>
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <NavPill label="👤 View as Student" color="#34d399" bg="rgba(52,211,153,0.15)" />
          <NavPill label="⚙️ Settings" />
          <NavPill label="🌐 T.A.M.i ⊙" color="#a855f7" bg="rgba(168,85,247,0.15)" />
          <NavPill label="📁 Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavPill label="📅 Calendar" active={view === 'calendar'} onClick={() => setView('calendar')} />
          <NavPill label="🎮 Game" color="#f97316" bg="rgba(249,115,22,0.15)" />
          <NavPill label="Logout" onClick={onLogout} />
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── Risk Summary Cards ──────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
          marginBottom: 28,
        }}>
          {RISK_CARDS.map(card => (
            <div key={card.key} style={{
              background: '#151520',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '18px 20px',
              cursor: 'pointer',
            }} onClick={() => setFilter(card.key)}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                {card.emoji && <span style={{ fontSize: 14 }}>{card.emoji}</span>}
                <span>{card.label}</span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: card.color }}>
                {counts[card.key]}
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter Pills ────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <FilterBtn active={filter === 'all'} label="All Students" count={counts.all} onClick={() => setFilter('all')} />
          <FilterBtn active={filter === 'red'} emoji="🔴" label="Red Alert" count={counts.red} color="#ff4d6a" onClick={() => setFilter('red')} />
          <FilterBtn active={filter === 'orange'} emoji="⚠️" label="Orange" count={counts.orange} color="#f5a623" onClick={() => setFilter('orange')} />
          <FilterBtn active={filter === 'yellow'} emoji="📋" label="Yellow" count={counts.yellow} color="#f5d423" onClick={() => setFilter('yellow')} />
          <FilterBtn active={filter === 'green'} emoji="✅" label="Green" count={counts.green} color="#34d399" onClick={() => setFilter('green')} />
        </div>

        {/* ── Student Cards Grid ──────────────────────────── */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: 60,
            color: 'rgba(255,255,255,0.3)', fontSize: 16,
          }}>
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60,
            color: 'rgba(255,255,255,0.3)', fontSize: 16,
          }}>
            No students in this category
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 16,
          }}>
            {filtered.map(({ student, risk }) => (
              <StudentCard key={student.id} student={student} risk={risk} />
            ))}
          </div>
        )}
      </main>

      {/* ── Floating Chat Button ──────────────────────────── */}
      <button style={{
        position: 'fixed', bottom: 24, right: 24,
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
        fontSize: 24, color: '#fff',
      }}>
        💬
      </button>
    </div>
  )
}

/* ── Nav Pill (header button) ───────────────────────────── */
function NavPill({ label, active, color, bg, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 8,
      background: active ? 'rgba(255,255,255,0.12)' : (bg || 'rgba(255,255,255,0.06)'),
      border: '1px solid rgba(255,255,255,0.08)',
      color: color || 'rgba(255,255,255,0.7)',
      fontWeight: 600, fontSize: 13, cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  )
}
