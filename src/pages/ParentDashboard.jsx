import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const children = [
  { name:'Renee', initial:'R', grad:'linear-gradient(135deg,#a855f7,#ec4899)', status:'On Track', statusBg:'rgba(34,197,94,.2)', statusColor:'#4ade80', statusBorder:'rgba(34,197,94,.5)', dpm:92, dpmColor:'#4ade80', dpmFill:'#22c55e', practice:'45 min', days:'5 days', fulfill:'88%', consistency:'95%', pending:2, completed:5, overdue:0 },
  { name:'Sam', initial:'S', grad:'linear-gradient(135deg,#f59e0b,#f97316)', status:'Needs Encouragement', statusBg:'rgba(245,158,11,.2)', statusColor:'#fbbf24', statusBorder:'rgba(245,158,11,.5)', dpm:55, dpmColor:'#fbbf24', dpmFill:'#f59e0b', practice:'18 min', days:'2 days', fulfill:'45%', consistency:'38%', pending:3, completed:2, overdue:1 },
]

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userName = user?.name || 'Parent'

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#111827,#111827,#1f2937)', color:'#fff', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom:'1px solid #1f2937', position:'sticky', top:0, background:'rgba(17,24,39,.95)', backdropFilter:'blur(12px)', zIndex:10, padding:'12px 16px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16 }}>P</div>
            <div><div style={{ fontSize:16, fontWeight:700 }}>{userName}</div><div style={{ fontSize:11, color:'#9ca3af' }}>Parent Dashboard</div></div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => navigate('/game')} style={{ padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, border:'1px solid rgba(20,184,166,.3)', cursor:'pointer', background:'rgba(13,148,136,.2)', color:'#5eead4' }}>🎮 Play Together</button>
            <button onClick={() => { logout(); navigate('/') }} style={{ padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, border:'none', cursor:'pointer', background:'rgba(55,65,81,.5)', color:'#d1d5db' }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'24px 16px' }}>
        {/* Welcome */}
        <div style={{ background:'linear-gradient(135deg,rgba(37,99,235,.2),rgba(147,51,234,.2))', border:'1px solid rgba(59,130,246,.3)', borderRadius:16, padding:24, marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Welcome, {userName}! 👋</h2>
          <p style={{ fontSize:13, color:'#d1d5db', lineHeight:1.5 }}>Monitor your child's musical progress, track their practice habits, and celebrate their achievements.</p>
        </div>

        <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>My Students</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:24 }}>
          {children.map(child => (
            <div key={child.name} style={{ background:'rgba(31,41,55,.5)', border:'1px solid rgba(55,65,81,.5)', borderRadius:16, padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:child.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700 }}>{child.initial}</div>
                <div><div style={{ fontSize:20, fontWeight:700 }}>{child.name}</div><span style={{ display:'inline-block', padding:'4px 12px', borderRadius:9999, fontSize:11, fontWeight:600, border:'1px solid', marginTop:4, background:child.statusBg, color:child.statusColor, borderColor:child.statusBorder }}>{child.status}</span></div>
              </div>
              {/* DPM Bar */}
              <div style={{ background:'rgba(55,65,81,.3)', borderRadius:12, padding:16, marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:13, color:'#9ca3af' }}>DPM Score</span>
                  <span style={{ fontSize:24, fontWeight:700, color:child.dpmColor }}>{child.dpm}%</span>
                </div>
                <div style={{ width:'100%', height:12, background:'#374151', borderRadius:9999, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:9999, background:child.dpmFill, width:`${child.dpm}%`, transition:'width .5s ease' }}/>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                {[{l:'Weekly Practice',v:child.practice},{l:'Practice Days',v:child.days},{l:'Fulfillment',v:child.fulfill,c:'#14b8a6'},{l:'Consistency',v:child.consistency,c:'#c084fc'}].map(s => (
                  <div key={s.l} style={{ background:'rgba(55,65,81,.3)', borderRadius:8, padding:12 }}>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{s.l}</div>
                    <div style={{ fontSize:18, fontWeight:700, marginTop:2, color:s.c || '#fff' }}>{s.v}</div>
                  </div>
                ))}
              </div>
              {/* Assignments */}
              <div style={{ background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.3)', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#60a5fa', marginBottom:8 }}>📚 Assignments</div>
                <div style={{ display:'flex', gap:16, fontSize:12, color:'#d1d5db' }}>
                  <span>Pending: <span style={{ color:'#fbbf24', fontWeight:600 }}>{child.pending}</span></span>
                  <span>Completed: <span style={{ color:'#4ade80', fontWeight:600 }}>{child.completed}</span></span>
                  <span>Overdue: <span style={{ color:'#f87171', fontWeight:600 }}>{child.overdue}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:32 }}>
          {[{i:'📚',t:'View Homework',to:'/homework'},{i:'💬',t:'Message Teacher'},{i:'🏆',t:'Leaderboard',to:'/leaderboard'},{i:'🎮',t:'Play Game',to:'/game'}].map(a => (
            <div key={a.t} onClick={() => a.to && navigate(a.to)} style={{ padding:16, background:'rgba(31,41,55,.5)', border:'1px solid rgba(55,65,81,.5)', borderRadius:12, textAlign:'center', cursor:'pointer', transition:'background .2s' }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{a.i}</div>
              <div style={{ fontSize:13, color:'#d1d5db' }}>{a.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
