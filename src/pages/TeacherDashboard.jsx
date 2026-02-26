import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userName = user?.name || 'Teacher'

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#111827,#1f2937)', color:'#fff', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ borderBottom:'1px solid #1f2937', position:'sticky', top:0, background:'rgba(17,24,39,0.95)', backdropFilter:'blur(12px)', zIndex:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#14b8a6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{userName.charAt(0)}</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>{userName}</div>
            <div style={{ fontSize:11, color:'#9ca3af' }}>Teacher Dashboard</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => navigate('/settings')} style={{ padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, border:'1px solid rgba(55,65,81,.5)', cursor:'pointer', background:'rgba(55,65,81,.5)', color:'#d1d5db' }}>⚙️ Settings</button>
          <button onClick={() => { logout(); navigate('/') }} style={{ padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, border:'1px solid rgba(55,65,81,.5)', cursor:'pointer', background:'rgba(55,65,81,.5)', color:'#d1d5db' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:24 }}>
        {/* Teacher Dashboard placeholder - will be replaced with full HTML conversion */}
        <div style={{ background:'linear-gradient(135deg,rgba(20,184,166,.2),rgba(6,182,212,.2))', border:'1px solid rgba(20,184,166,.3)', borderRadius:16, padding:32, textAlign:'center', marginBottom:24 }}>
          <h2 style={{ fontSize:24, fontWeight:700, marginBottom:8 }}>Welcome, {userName}! 👋</h2>
          <p style={{ color:'#9ca3af', fontSize:14 }}>Teacher Dashboard v3 coming soon — upload teacher-dashboard-v3.html to complete</p>
        </div>

        {/* Risk Status Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {[
            { label:'Critical', count:0, color:'#ef4444', bg:'rgba(239,68,68,.1)', border:'rgba(239,68,68,.3)' },
            { label:'At Risk', count:1, color:'#f59e0b', bg:'rgba(245,158,11,.1)', border:'rgba(245,158,11,.3)' },
            { label:'Watch', count:2, color:'#3b82f6', bg:'rgba(59,130,246,.1)', border:'rgba(59,130,246,.3)' },
            { label:'On Track', count:5, color:'#22c55e', bg:'rgba(34,197,94,.1)', border:'rgba(34,197,94,.3)' },
          ].map(s => (
            <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:16, textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.count}</div>
              <div style={{ fontSize:13, color:'#9ca3af', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <p style={{ color:'#6b7280', textAlign:'center', fontSize:13 }}>Full teacher dashboard with student cards, DPM details, and T.A.M.i review will be added when teacher-dashboard-v3.html is converted.</p>
      </div>
    </div>
  )
}
