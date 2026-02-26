import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const TEAL = "#14b8a6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

const SAMPLE_HW = [
  { id:1, title:"Scale Practice - C Major", due:"Tomorrow", status:"active", time:"15 min", type:"Practice" },
  { id:2, title:"Rhythm Exercise #4", due:"Mar 1", status:"active", time:"20 min", type:"Exercise" },
  { id:3, title:"Ear Training Quiz", due:"Feb 28", status:"completed", time:"10 min", type:"Quiz" },
  { id:4, title:"Music Theory Ch.3", due:"Feb 24", status:"overdue", time:"25 min", type:"Reading" },
]

export default function HomeworkDashboard() {
  const { navigate } = useAuth()
  const [tab, setTab] = useState("active")
  const filtered = SAMPLE_HW.filter(h => tab === "all" ? true : h.status === tab)

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", padding:20 }}>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>📚 Homework Hub</h2>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["active","completed","overdue","all"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"8px 16px", borderRadius:10, border:"none", fontSize:12, fontWeight:600, cursor:"pointer",
              background: t===tab ? `${TEAL}20` : "rgba(255,255,255,0.04)", color: t===tab ? TEAL : TEXT_DIM }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(hw => (
          <div key={hw.id} style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:14, padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <p style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{hw.title}</p>
                <p style={{ color:TEXT_DIM, fontSize:12 }}>Due: {hw.due} • {hw.time}</p>
              </div>
              <span style={{ padding:"3px 10px", borderRadius:6, fontSize:10, fontWeight:600,
                background: hw.status==="completed" ? "rgba(34,197,94,0.12)" : hw.status==="overdue" ? "rgba(239,68,68,0.12)" : "rgba(20,184,166,0.12)",
                color: hw.status==="completed" ? "#22c55e" : hw.status==="overdue" ? "#ef4444" : TEAL }}>
                {hw.status}
              </span>
            </div>
            <div style={{ display:"flex", gap:6, marginTop:10 }}>
              <span style={{ background:"rgba(255,255,255,0.04)", padding:"3px 10px", borderRadius:6, fontSize:10, color:TEXT_DIM }}>{hw.type}</span>
            </div>
            {hw.status === "active" && (
              <button style={{ width:"100%", marginTop:12, padding:"10px", background:`${TEAL}15`, border:`1px solid ${TEAL}30`, borderRadius:8, color:TEAL, fontSize:12, fontWeight:600, cursor:"pointer" }}>Start Assignment</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
