import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

const GOLD = "#f59e0b"
const GOLD_DARK = "#d97706"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"
const TEXT_MED = "rgba(255,255,255,0.7)"

const RISK_COLORS = { "Red Alert":"#ef4444", "Check-in Needed":"#f97316", "Watch Closely":"#eab308", "On Track":"#22c55e" }

function DPMRing({ value, color, size = 50 }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} style={{ flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2+4} textAnchor="middle" fill={color} fontSize={11} fontWeight={700}>{value}%</text>
    </svg>
  )
}

export default function TeacherDashboard() {
  const { user, navigate, logout } = useAuth()
  const [filter, setFilter] = useState("all")
  const [students, setStudents] = useState([])
  const name = user?.name || user?.["Student / User Name"] || "Teacher"

  useEffect(() => {
    api.getStudents().then(data => {
      if (Array.isArray(data)) setStudents(data)
      else setStudents([
        { id:1, name:"Alex Rivera", dpm:78, practice:"4h 20m", risk:"On Track", tags:[] },
        { id:2, name:"Sam Chen", dpm:45, practice:"1h 10m", risk:"Check-in Needed", tags:["below weekly target"] },
        { id:3, name:"Jordan Lee", dpm:12, practice:"0m", risk:"Red Alert", tags:["zero engagement 14days","no practice history"] },
        { id:4, name:"Taylor Kim", dpm:65, practice:"3h 05m", risk:"Watch Closely", tags:["below weekly target"] },
      ])
    }).catch(() => setStudents([
      { id:1, name:"Alex Rivera", dpm:78, practice:"4h 20m", risk:"On Track", tags:[] },
      { id:2, name:"Sam Chen", dpm:45, practice:"1h 10m", risk:"Check-in Needed", tags:["below weekly target"] },
      { id:3, name:"Jordan Lee", dpm:12, practice:"0m", risk:"Red Alert", tags:["zero engagement 14days"] },
      { id:4, name:"Taylor Kim", dpm:65, practice:"3h 05m", risk:"Watch Closely", tags:["below weekly target"] },
    ]))
  }, [])

  const filtered = filter === "all" ? students : students.filter(s => s.risk === filter)

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <span style={{ fontSize:20 }}>🎵</span>
            <span style={{ fontSize:18, fontWeight:700 }}>School of Motesart</span>
          </div>
          <p style={{ color:TEXT_DIM, fontSize:12 }}>Welcome back, {name}</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ background:"rgba(245,158,11,0.12)", color:GOLD, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:600, border:"1px solid rgba(245,158,11,0.2)" }}>Teacher View</span>
          <button onClick={() => navigate("settings")} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>⚙️</button>
          <button onClick={logout} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"6px 12px", color:"#ef4444", cursor:"pointer", fontSize:12, fontWeight:600 }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding:"0 20px", marginBottom:16 }}>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20 }}>
          <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Total Students</p>
          <p style={{ fontSize:36, fontWeight:800, color:GOLD }}>{students.length}</p>
        </div>
      </div>

      {/* Risk Filters */}
      <div style={{ padding:"0 20px", marginBottom:16, display:"flex", gap:6, flexWrap:"wrap" }}>
        <button onClick={() => setFilter("all")}
          style={{ padding:"6px 14px", borderRadius:20, border:"none", fontSize:11, fontWeight:600, cursor:"pointer",
            background: filter==="all" ? `${GOLD}20` : "rgba(255,255,255,0.04)", color: filter==="all" ? GOLD : TEXT_DIM }}>All</button>
        {Object.entries(RISK_COLORS).map(([label, color]) => (
          <button key={label} onClick={() => setFilter(label)}
            style={{ padding:"6px 14px", borderRadius:20, border:"none", fontSize:11, fontWeight:600, cursor:"pointer",
              background: filter===label ? `${color}20` : "rgba(255,255,255,0.04)", color: filter===label ? color : TEXT_DIM }}>
            {label}
          </button>
        ))}
      </div>

      {/* Student Cards */}
      <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(s => (
          <div key={s.id} style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <DPMRing value={s.dpm} color={RISK_COLORS[s.risk] || GOLD} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:15, fontWeight:600, marginBottom:2 }}>{s.name}</p>
                <p style={{ color:TEXT_DIM, fontSize:12 }}>Practice: {s.practice}</p>
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  <span style={{ background:`${RISK_COLORS[s.risk]}15`, color:RISK_COLORS[s.risk], padding:"2px 8px", borderRadius:6, fontSize:10, fontWeight:600 }}>{s.risk}</span>
                  {(s.tags || []).map(t => (
                    <span key={t} style={{ background:"rgba(239,68,68,0.08)", color:"#ef4444", padding:"2px 8px", borderRadius:6, fontSize:10 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button style={{ flex:1, padding:"8px 0", background:`${GOLD}12`, border:`1px solid ${GOLD}30`, borderRadius:8, color:GOLD, fontSize:11, fontWeight:600, cursor:"pointer" }}>View Details</button>
              <button style={{ flex:1, padding:"8px 0", background:"rgba(168,85,247,0.08)", border:"1px solid rgba(168,85,247,0.2)", borderRadius:8, color:"#a855f7", fontSize:11, fontWeight:600, cursor:"pointer" }}>💬 Chat</button>
              <button style={{ flex:1, padding:"8px 0", background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:8, color:"#3b82f6", fontSize:11, fontWeight:600, cursor:"pointer" }}>📚 Assign HW</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
