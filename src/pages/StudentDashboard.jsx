import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('academic') // academic | game
  const userName = user?.name || user?.email?.split('@')[0] || 'Student'
  const initial = userName.charAt(0).toUpperCase()

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#111827,#111827,#1f2937)', color:'#fff', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflowX:'hidden' }}>
      {/* Header */}
      <div style={{ borderBottom:'1px solid #1f2937', position:'sticky', top:0, background:'rgba(17,24,39,0.95)', backdropFilter:'blur(12px)', zIndex:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#a855f7,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16 }}>{initial}</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>{userName}</div>
            <div style={{ fontSize:10, color:'#9ca3af' }}>T.A.M.i Dashboard</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ display:'flex', background:'#1f2937', borderRadius:8, padding:2 }}>
            <button onClick={() => navigate('/teacher')} style={{ padding:'6px 12px', fontSize:10, fontWeight:600, border:'none', borderRadius:6, cursor:'pointer', color:'#9ca3af', background:'transparent' }}>🎹 Teacher</button>
            <button onClick={() => setMode('academic')} style={{ padding:'6px 12px', fontSize:10, fontWeight:600, border:'none', borderRadius:6, cursor:'pointer', color: mode==='academic' ? '#fff' : '#9ca3af', background: mode==='academic' ? '#2563eb' : 'transparent' }}>✨ Academic</button>
            <button onClick={() => setMode('game')} style={{ padding:'6px 12px', fontSize:10, fontWeight:600, border:'none', borderRadius:6, cursor:'pointer', color: mode==='game' ? '#fff' : '#9ca3af', background: mode==='game' ? '#9333ea' : 'transparent' }}>🎮 Game</button>
          </div>
          <button onClick={() => navigate('/game')} style={{ padding:'6px 12px', background:'#0d9488', color:'#fff', border:'none', borderRadius:8, fontSize:10, fontWeight:600, cursor:'pointer' }}>▶ Play</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display:'flex', gap:8, padding:'12px 16px', overflowX:'auto' }}>
        <button onClick={() => navigate('/practice')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:12, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', whiteSpace:'nowrap', color:'#fff', background:'linear-gradient(135deg,#0d9488,#059669)' }}>● Log Practice</button>
        <button onClick={() => navigate('/homework')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', color:'#fff', background:'#1f2937', border:'1px solid #374151' }}>📚 Homework</button>
        <button onClick={() => navigate('/leaderboard')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:12, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', whiteSpace:'nowrap', color:'#fff', background:'#1f2937', borderColor:'#374151', borderWidth:1, borderStyle:'solid' }}>🏆 Leaders</button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:16 }}>
        {mode === 'academic' ? <AcademicView navigate={navigate} /> : <GameView navigate={navigate} />}
      </div>

      {/* Footer Nav */}
      <div style={{ borderTop:'1px solid #1f2937', marginTop:'auto', padding:'12px 16px', display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
        <button onClick={() => navigate('/practice')} style={{ padding:'10px 20px', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#fff', background:'linear-gradient(135deg,#0d9488,#06b6d4)' }}>🎵 Practice</button>
        <button onClick={() => navigate('/homework')} style={{ padding:'10px 20px', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#fff', background:'linear-gradient(135deg,#2563eb,#4f46e5)' }}>📚 Homework</button>
        <button onClick={() => navigate('/leaderboard')} style={{ padding:'10px 20px', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#fff', background:'linear-gradient(135deg,#9333ea,#ec4899)' }}>🏆 Leaders</button>
      </div>
    </div>
  )
}

/* ─── CARD COMPONENT ─── */
function Card({ title, children, headerRight }) {
  return (
    <div style={{ background:'rgba(31,41,55,0.8)', backdropFilter:'blur(8px)', borderRadius:12, border:'1px solid rgba(55,65,81,0.5)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(55,65,81,0.5)' }}>
        <span style={{ fontSize:14, fontWeight:600 }}>{title}</span>
        {headerRight}
      </div>
      <div style={{ padding:16 }}>{children}</div>
    </div>
  )
}

/* ─── ACADEMIC VIEW ─── */
function AcademicView({ navigate }) {
  return (
    <>
      {/* Row 1: DPM + Weekly Progress */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Card title="DPM Score">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24, flexWrap:'wrap' }}>
            {/* DPM Donut */}
            <div style={{ position:'relative' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(55,65,81,0.5)" strokeWidth="8"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#14b8a6" strokeWidth="8" strokeDasharray="263.9" strokeDashoffset="240" strokeLinecap="round" transform="rotate(-90 50 50)"/>
              </svg>
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800 }}>9%</div>
                <div style={{ fontSize:10, color:'#9ca3af' }}>DPM</div>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[{c:'#3b82f6',l:'Drive',v:'1%'},{c:'#f97316',l:'Passion',v:'27%'},{c:'#22c55e',l:'Motivation',v:'0%'}].map(d => (
                <div key={d.l} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                  <div style={{ width:8, height:8, borderRadius:4, background:d.c }}/>
                  <span style={{ color:'#9ca3af' }}>{d.l}</span>
                  <span style={{ color:'#fff', fontWeight:700 }}>{d.v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Sub metrics */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16, paddingTop:12, borderTop:'1px solid rgba(55,65,81,0.5)' }}>
            {[{v:'1%',l:'Drive',c:'#3b82f6'},{v:'27%',l:'Passion',c:'#f97316'},{v:'0%',l:'Motivation',c:'#22c55e'}].map(m => (
              <div key={m.l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:700, color:m.c }}>{m.v}</div>
                <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Weekly Progress" headerRight={
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button style={{ width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', color:'#9ca3af', cursor:'pointer', borderRadius:4 }}>‹</button>
            <span style={{ fontSize:11, color:'#9ca3af', minWidth:120, textAlign:'center' }}>Feb 22 - Feb 28</span>
            <button style={{ width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', color:'#9ca3af', cursor:'pointer', borderRadius:4 }}>›</button>
          </div>
        }>
          {/* Day dots */}
          <div style={{ display:'flex', justifyContent:'space-around', padding:'6px 0' }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
              <div key={d} style={{ textAlign:'center' }}>
                <div style={{ width:12, height:12, borderRadius:'50%', border: d==='Wed' ? 'none' : '2px solid #6b7280', background: d==='Wed' ? '#14b8a6' : 'transparent', margin:'0 auto' }}/>
                <div style={{ fontSize:10, color: d==='Wed' ? '#14b8a6' : '#6b7280', marginTop:4, fontWeight: d==='Wed' ? 700 : 400 }}>{d}</div>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4, marginTop:12, paddingTop:12, borderTop:'1px solid rgba(55,65,81,0.5)' }}>
            {[{i:'🎵',v:'0',l:'Minutes'},{i:'🎯',v:'0',l:'Sessions'},{i:'✓',v:'0%',l:'Accuracy'},{i:'🔥',v:'0',l:'Streak'}].map(s => (
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:14 }}>{s.i}</div>
                <div style={{ fontSize:18, fontWeight:700 }}>{s.v}</div>
                <div style={{ fontSize:10, color:'#9ca3af' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Practice Goals + Goal vs Actual + Intensity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:12 }}>
        <Card title="Practice Goals">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'rgba(55,65,81,0.3)', borderRadius:8, marginBottom:12 }}>
            <span style={{ color:'#9ca3af', fontSize:13 }}>Weekly Goal</span>
            <span style={{ fontWeight:700, fontSize:13, color:'#14b8a6' }}>60 min</span>
          </div>
          <div style={{ height:12, background:'#374151', borderRadius:8, overflow:'hidden' }}>
            <div style={{ height:'100%', width:'0%', borderRadius:8, background:'linear-gradient(90deg,#14b8a6,#06b6d4)' }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:12 }}>
            <span style={{ color:'#9ca3af' }}>0 / 60 min</span>
            <span style={{ fontWeight:700 }}>0%</span>
          </div>
          <p style={{ fontSize:11, color:'#9ca3af', marginTop:8 }}>60 min remaining this week</p>
        </Card>

        <Card title="Goal vs Actual">
          <div style={{ textAlign:'center', padding:20, color:'#9ca3af', fontSize:12 }}>
            <p>Avg: 0 min/day · Goal: 9 min/day</p>
          </div>
        </Card>

        <Card title="Practice Intensity">
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:4, padding:'0 4px', height:80 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                <div style={{ width:'100%', maxWidth:24, height:0, borderRadius:'3px 3px 0 0', background:'#374151' }}/>
                <div style={{ fontSize:9, color:'#6b7280', marginTop:4 }}>{d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Homework + Achievements + Leaders */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:12 }}>
        <Card title="Homework">
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ padding:10, borderRadius:8, border:'1px solid rgba(59,130,246,0.3)', background:'rgba(59,130,246,0.1)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600 }}>Level 3 Mastery</div>
                <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>Practice · 2026-01-20</div>
              </div>
              <span style={{ fontSize:9, padding:'2px 8px', borderRadius:4, background:'#374151', whiteSpace:'nowrap' }}>In Progress</span>
            </div>
          </div>
          <button onClick={() => navigate('/homework')} style={{ width:'100%', padding:10, marginTop:8, background:'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(79,70,229,0.2))', border:'1px solid rgba(59,130,246,0.3)', color:'#60a5fa', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>View Full Homework →</button>
        </Card>

        <Card title="Achievements">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
            {[{i:'🔥',l:'5 Streak',e:true},{i:'🔥🔥',l:'10 Streak',e:true},{i:'🕐',l:'1 Hour',e:false},{i:'🏆',l:'Level 3',e:false},{i:'🏆',l:'Level 4',e:false},{i:'🏅',l:'Master',e:false},{i:'🎯',l:'10 Sessions',e:false},{i:'⭐',l:'DPM 80+',e:false}].map((a,i) => (
              <div key={i} style={{ padding:'10px 6px', borderRadius:8, textAlign:'center', background: a.e ? 'linear-gradient(135deg,rgba(120,53,15,0.4),rgba(154,52,18,0.4))' : 'rgba(55,65,81,0.2)', border: a.e ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(55,65,81,0.3)', opacity: a.e ? 1 : 0.4 }}>
                <div style={{ fontSize:20 }}>{a.i}</div>
                <span style={{ fontSize:8, color:'#d1d5db', marginTop:4, display:'block' }}>{a.l}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="T.A.M.i Leaders">
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:8, background:'linear-gradient(135deg,rgba(147,51,234,0.15),rgba(236,72,153,0.15))', border:'1px solid rgba(147,51,234,0.3)', borderRadius:8 }}>
            <span style={{ width:20, fontSize:12, fontWeight:700, textAlign:'center' }}>👑</span>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#374151', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>🎵</div>
            <span style={{ flex:1, fontSize:12, color:'#a855f7', fontWeight:700 }}>Motesart Mo (You)</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#22c55e' }}>287</span>
          </div>
          <button onClick={() => navigate('/leaderboard')} style={{ width:'100%', marginTop:12, padding:10, background:'linear-gradient(135deg,rgba(147,51,234,0.2),rgba(236,72,153,0.2))', border:'1px solid rgba(147,51,234,0.3)', color:'#a855f7', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>View Full Leaderboard →</button>
        </Card>
      </div>
    </>
  )
}

/* ─── GAME VIEW ─── */
function GameView({ navigate }) {
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Card title="🎮 Game Stats">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[{i:'🔥',v:'0',l:'Best Streak',c:'#f97316'},{i:'💀',v:'0',l:'Lives Lost',c:'#a855f7'},{i:'⚡',v:'0',l:'On Fire Runs',c:'#14b8a6'}].map(s => (
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:14 }}>{s.i}</div>
                <div style={{ fontSize:18, fontWeight:700, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="🎯 DPM Game Scores">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[{v:'0%',l:'Drive',c:'#3b82f6'},{v:'0%',l:'Passion',c:'#f97316'},{v:'0%',l:'Motivation',c:'#22c55e'}].map(s => (
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:700, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
        <Card title="Game Sessions">
          <p style={{ color:'#9ca3af', fontSize:12 }}>No game sessions yet. Hit Play to start!</p>
        </Card>
        <Card title="🏆 Game Leaderboard">
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:8, background:'linear-gradient(135deg,rgba(147,51,234,0.15),rgba(236,72,153,0.15))', border:'1px solid rgba(147,51,234,0.3)', borderRadius:8 }}>
            <span style={{ width:20, fontSize:12, fontWeight:700, textAlign:'center' }}>👑</span>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#374151', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>🎵</div>
            <span style={{ flex:1, fontSize:12, color:'#a855f7', fontWeight:700 }}>Motesart Mo (You)</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#22c55e' }}>0</span>
          </div>
          <button onClick={() => navigate('/leaderboard')} style={{ width:'100%', marginTop:12, padding:10, background:'linear-gradient(135deg,rgba(147,51,234,0.2),rgba(236,72,153,0.2))', border:'1px solid rgba(147,51,234,0.3)', color:'#a855f7', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>View Full Leaderboard →</button>
        </Card>
      </div>
    </>
  )
}
