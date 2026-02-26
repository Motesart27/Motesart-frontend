import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const TEAL = "#14b8a6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

const LEADERS = [
  { rank:1, name:"Alex Rivera", xp:4850, level:18, avatar:"🎹" },
  { rank:2, name:"Sam Chen", xp:4200, level:16, avatar:"🎸" },
  { rank:3, name:"Jordan Lee", xp:3900, level:15, avatar:"🎵" },
  { rank:4, name:"Taylor Kim", xp:3600, level:14, avatar:"🎺" },
  { rank:5, name:"Casey Park", xp:3100, level:13, avatar:"🥁" },
  { rank:6, name:"Morgan Yu", xp:2800, level:12, avatar:"🎻" },
]

const RANK_COLORS = ["#f59e0b","#94a3b8","#cd7f32"]

export default function Leaderboard() {
  const { navigate } = useAuth()
  const [filter, setFilter] = useState("xp")

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", padding:20 }}>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>🏆 Leaderboard</h2>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["xp","streak","accuracy"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"8px 16px", borderRadius:10, border:"none", fontSize:12, fontWeight:600, cursor:"pointer",
              background: f===filter ? `${TEAL}20` : "rgba(255,255,255,0.04)", color: f===filter ? TEAL : TEXT_DIM }}>
            {f === "xp" ? "🏆 XP" : f === "streak" ? "🔥 Streak" : "🎯 Accuracy"}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:24, alignItems:"flex-end" }}>
        {[1,0,2].map(i => {
          const l = LEADERS[i]; if (!l) return null
          const isFirst = i === 0
          return (
            <div key={l.rank} style={{ textAlign:"center", flex:1 }}>
              <div style={{ width:isFirst?70:56, height:isFirst?70:56, borderRadius:"50%", background:`${RANK_COLORS[l.rank-1]}15`, border:`2px solid ${RANK_COLORS[l.rank-1]}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", fontSize:isFirst?28:22 }}>
                {l.avatar}
              </div>
              <p style={{ fontSize:12, fontWeight:600 }}>{l.name}</p>
              <p style={{ color:RANK_COLORS[l.rank-1], fontSize:14, fontWeight:800 }}>{l.xp.toLocaleString()} XP</p>
              <span style={{ fontSize:10, color:TEXT_DIM }}>#{l.rank}</span>
            </div>
          )
        })}
      </div>

      {/* Full List */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {LEADERS.map(l => (
          <div key={l.rank} style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ width:28, fontSize:14, fontWeight:700, color: l.rank <= 3 ? RANK_COLORS[l.rank-1] : TEXT_DIM }}>#{l.rank}</span>
            <span style={{ fontSize:20 }}>{l.avatar}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:600 }}>{l.name}</p>
              <p style={{ color:TEXT_DIM, fontSize:11 }}>Level {l.level}</p>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:TEAL }}>{l.xp.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
