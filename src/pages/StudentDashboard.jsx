import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

export default function StudentDashboard({ user, onNavigate }) {
  const { navigate } = useAuth()
  const nav = onNavigate || navigate

  // DPM data (will pull from Airtable in Phase 2)
  const [dpm, setDpm] = useState({ drive: 1, passion: 27, motivation: 0, overall: 9 })
  const [weeklyStats, setWeeklyStats] = useState({ minutes: 0, sessions: 0, accuracy: 0, streak: 0 })
  const [practiceGoal, setPracticeGoal] = useState({ target: 60, current: 0 })
  const [currentDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short' }))

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Action Buttons Row — NO default highlight */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <ActionButton icon="●" label="Log Practice" color="#22c55e" onClick={() => nav('practice')} />
        <ActionButton icon="📚" label="Homework" color="transparent" borderColor="rgba(255,255,255,0.1)" onClick={() => nav('homework')} />
        <ActionButton icon="🏆" label="Leaders" color="transparent" borderColor="rgba(255,255,255,0.1)" onClick={() => nav('leaderboard')} />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* DPM Score Card */}
        <Card title="DPM Score">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 0' }}>
            <DPMDonut value={dpm.overall} size={140} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <LegendItem color="#6366f1" label="Drive" value={`${dpm.drive}%`} />
              <LegendItem color="#f97316" label="Passion" value={`${dpm.passion}%`} />
              <LegendItem color="#22c55e" label="Motivation" value={`${dpm.motivation}%`} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            <StatItem value={`${dpm.drive}%`} label="Drive" color="#6366f1" />
            <StatItem value={`${dpm.passion}%`} label="Passion" color="#f97316" />
            <StatItem value={`${dpm.motivation}%`} label="Motivation" color="#22c55e" />
          </div>
        </Card>

        {/* Weekly Progress Card */}
        <Card title="Weekly Progress" extra={<WeekNav />}>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            {days.map(d => (
              <div key={d} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                  border: d === currentDay.slice(0,3) ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
                  background: d === currentDay.slice(0,3) ? '#22c55e' : 'transparent',
                }} />
                <span style={{ color: d === currentDay.slice(0,3) ? '#22c55e' : 'rgba(255,255,255,0.4)', fontSize: 12 }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16 }}>
            <WeekStat icon="📋" value={weeklyStats.minutes} label="Minutes" />
            <WeekStat icon="🎯" value={weeklyStats.sessions} label="Sessions" />
            <WeekStat icon="✓" value={`${weeklyStats.accuracy}%`} label="Accuracy" />
            <WeekStat icon="🔥" value={weeklyStats.streak} label="Streak" />
          </div>
        </Card>
      </div>

      {/* Bottom Row — 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Practice Goals */}
        <Card title="Practice Goals">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Weekly Goal</span>
            <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 16 }}>{practiceGoal.target} min</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #6366f1, #22c55e)',
              width: `${Math.min(100, (practiceGoal.current / practiceGoal.target) * 100)}%`,
              transition: 'width 0.5s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{practiceGoal.current} / {practiceGoal.target} min</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{Math.round((practiceGoal.current / practiceGoal.target) * 100)}%</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 8 }}>
            {practiceGoal.target - practiceGoal.current} min remaining this week
          </p>
        </Card>

        {/* Goal vs Actual */}
        <Card title="Goal vs Actual">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Avg: {Math.round(practiceGoal.current / 7)} min/day · Goal: {Math.round(practiceGoal.target / 7)} min/day
          </div>
        </Card>

        {/* Practice Intensity */}
        <Card title="Practice Intensity">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 120, paddingBottom: 8 }}>
            {days.map(d => {
              const h = Math.random() * 60 + 10
              return (
                <div key={d} style={{ textAlign: 'center' }}>
                  <div style={{ width: 20, height: h, background: 'rgba(99,102,241,0.3)', borderRadius: 4 }} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 4, display: 'block' }}>{d}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* T.A.M.i Leaders Mini Card */}
      <Card title="T.A.M.i Leaders">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', margin: '12px 0',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(232,75,138,0.2))',
          border: '1px solid rgba(168,85,247,0.3)', borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>👑</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.[0] || 'M'
              )}
            </div>
            <span style={{ color: '#fff', fontWeight: 600 }}>{user?.name || 'Motesart'} (You)</span>
          </div>
          <span style={{ color: '#22c55e', fontWeight: 800, fontSize: 18 }}>287</span>
        </div>
        <button onClick={() => nav('leaderboard')} style={{
          width: '100%', padding: '12px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(232,75,138,0.15))',
          border: '1px solid rgba(168,85,247,0.2)', borderRadius: 12,
          color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          View Full Leaderboard →
        </button>
      </Card>
    </div>
  )
}

/* ---- Sub-components ---- */

function Card({ title, extra, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
        {extra}
      </div>
      {children}
    </div>
  )
}

function ActionButton({ icon, label, color, borderColor, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
      background: color === 'transparent' ? 'rgba(255,255,255,0.04)' : color,
      border: borderColor ? `1px solid ${borderColor}` : color !== 'transparent' ? 'none' : '1px solid rgba(255,255,255,0.1)',
      color: '#fff', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
    }}>
      {icon} {label}
    </button>
  )
}

function DPMDonut({ value, size = 140 }) {
  const r = (size - 14) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const color = value >= 70 ? '#22c55e' : value >= 40 ? '#eab308' : '#14b8a6'
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fill="#fff" fontSize={32} fontWeight="800">{value}%</text>
      <text x={size/2} y={size/2 + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={13}>DPM</text>
    </svg>
  )
}

function LegendItem({ color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</span>
      <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{value}</span>
    </div>
  )
}

function StatItem({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{label}</div>
    </div>
  )
}

function WeekNav() {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay() + 1)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>‹</span>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{fmt(start)} - {fmt(end)}</span>
      <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>›</span>
    </div>
  )
}

function WeekStat({ icon, value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
      <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{label}</div>
    </div>
  )
}
