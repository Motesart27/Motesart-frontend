import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const PLAYERS_DATA = {
  'all-time': [
    { name: 'Renee', badge: 'Rising Star', level: 8, streak: 14, points: 12840 },
    { name: 'Alex', badge: 'Rising Star', level: 7, streak: 11, points: 11200 },
    { name: 'Luke', badge: 'Rising Star', level: 6, streak: 8, points: 9750 },
    { name: 'Motesart', badge: 'Ambassador', level: 5, streak: 6, points: 8450, isYou: true },
    { name: 'Sam', badge: 'Rising Star', level: 5, streak: 3, points: 7200 },
    { name: 'Jordan', badge: 'Rising Star', level: 4, streak: 2, points: 5880 },
    { name: 'Maya', badge: 'Rising Star', level: 3, streak: 1, points: 4200 },
    { name: 'Chris', badge: 'Rising Star', level: 2, streak: 0, points: 2100 },
  ],
  'this-month': [
    { name: 'Alex', badge: 'Rising Star', level: 7, streak: 11, points: 3400 },
    { name: 'Renee', badge: 'Rising Star', level: 8, streak: 14, points: 3200 },
    { name: 'Motesart', badge: 'Ambassador', level: 5, streak: 6, points: 2800, isYou: true },
    { name: 'Luke', badge: 'Rising Star', level: 6, streak: 8, points: 2500 },
    { name: 'Sam', badge: 'Rising Star', level: 5, streak: 3, points: 1900 },
    { name: 'Jordan', badge: 'Rising Star', level: 4, streak: 2, points: 1200 },
  ],
  'this-week': [
    { name: 'Motesart', badge: 'Ambassador', level: 5, streak: 6, points: 850, isYou: true },
    { name: 'Alex', badge: 'Rising Star', level: 7, streak: 11, points: 720 },
    { name: 'Renee', badge: 'Rising Star', level: 8, streak: 14, points: 680 },
    { name: 'Luke', badge: 'Rising Star', level: 6, streak: 8, points: 540 },
    { name: 'Sam', badge: 'Rising Star', level: 5, streak: 3, points: 410 },
  ],
}

export default function Leaderboard({ user }) {
  const { navigate } = useAuth()
  const [timeFilter, setTimeFilter] = useState('all-time')
  const [scopeFilter, setScopeFilter] = useState('global')

  const players = PLAYERS_DATA[timeFilter] || PLAYERS_DATA['all-time']
  const yourEntry = players.find(p => p.isYou)
  const yourRank = yourEntry ? players.indexOf(yourEntry) + 1 : '-'

  // Scope filter adjusts visible players
  const filteredPlayers = scopeFilter === 'my-class'
    ? players.slice(0, 4)
    : scopeFilter === 'my-school'
    ? players.slice(0, 6)
    : players

  return (
    <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            🏆 T.A.M.i Ambassadors
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>Top performers in musical mastery</p>
        </div>
        <button onClick={() => navigate('game')} style={{
          padding: '10px 20px', borderRadius: 12,
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>🎮 Play Game</button>
      </div>

      {/* Your Position Card */}
      {yourEntry && (
        <div style={{
          padding: '18px 24px', borderRadius: 16, marginBottom: 20,
          background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(34,197,94,0.1))',
          border: '1px solid rgba(20,184,166,0.3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
              background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 20, color: '#fff',
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.[0] || 'M'
              )}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{user?.name || 'Motesart'}</div>
              <div style={{ color: '#22c55e', fontSize: 13 }}>Your Position</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>#{yourRank}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{yourEntry.points.toLocaleString()} pts</div>
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Time filters */}
        {[
          { key: 'this-week', label: 'This Week' },
          { key: 'this-month', label: 'This Month' },
          { key: 'all-time', label: 'All Time' },
        ].map(f => (
          <FilterBtn key={f.key} active={timeFilter === f.key} onClick={() => setTimeFilter(f.key)} color="#fff">{f.label}</FilterBtn>
        ))}
        <div style={{ width: 16 }} />
        {/* Scope filters */}
        {[
          { key: 'global', label: 'Global' },
          { key: 'my-school', label: 'My School' },
          { key: 'my-class', label: 'My Class' },
        ].map(f => (
          <FilterBtn key={f.key} active={scopeFilter === f.key} onClick={() => setScopeFilter(f.key)} color="#22c55e">{f.label}</FilterBtn>
        ))}
      </div>

      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 100px',
        padding: '12px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        <span>Rank</span><span>Player</span><span>Level</span><span>Streak</span><span style={{ textAlign: 'right' }}>Points</span>
      </div>

      {/* Player Rows */}
      {filteredPlayers.map((p, i) => (
        <div key={p.name} style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 100px',
          alignItems: 'center', padding: '14px 20px',
          background: p.isYou ? 'rgba(20,184,166,0.08)' : (i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'),
          borderRadius: 12, marginBottom: 4,
          border: p.isYou ? '1px solid rgba(20,184,166,0.2)' : '1px solid transparent',
        }}>
          {/* Rank */}
          <span style={{ fontSize: 16 }}>
            {i < 3 ? '👑' : <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{i + 1}</span>}
          </span>

          {/* Player */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: p.isYou ? 'linear-gradient(135deg, #14b8a6, #22c55e)' : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 15,
            }}>
              {p.name[0]}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                {p.name} {p.isYou && <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(You)</span>}
              </div>
              <span style={{
                padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: p.badge === 'Ambassador'
                  ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)',
                color: p.badge === 'Ambassador' ? '#22c55e' : '#f97316',
              }}>
                {p.badge === 'Ambassador' ? '👑 Ambassador' : '⭐ Rising Star'}
              </span>
            </div>
          </div>

          {/* Level */}
          <span style={{
            padding: '4px 10px', borderRadius: 8,
            background: 'rgba(20,184,166,0.12)', color: '#14b8a6',
            fontSize: 13, fontWeight: 600, textAlign: 'center',
          }}>Lv.{p.level}</span>

          {/* Streak */}
          <span style={{ color: p.streak > 0 ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {p.streak > 0 ? `🔥 ${p.streak}` : p.streak}
          </span>

          {/* Points */}
          <span style={{ color: '#22c55e', fontWeight: 800, fontSize: 16, textAlign: 'right' }}>
            {p.points.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

function FilterBtn({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 10, cursor: 'pointer',
      background: active ? (color === '#22c55e' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.12)') : 'transparent',
      border: active ? `1px solid ${color === '#22c55e' ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.2)'}` : '1px solid rgba(255,255,255,0.08)',
      color: active ? (color === '#22c55e' ? '#22c55e' : '#fff') : 'rgba(255,255,255,0.4)',
      fontWeight: active ? 700 : 400, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.2s',
    }}>{children}</button>
  )
}
