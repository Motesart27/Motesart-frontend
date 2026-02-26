import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const TEAL = "#14b8a6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

export default function PracticeTracking() {
  const { navigate } = useAuth()
  const [timer, setTimer] = useState(0)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(null)

  const startTimer = () => {
    if (running) { clearInterval(intervalId); setRunning(false); return }
    const id = setInterval(() => setTimer(t => t + 1), 1000)
    setIntervalId(id); setRunning(true)
  }

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", padding:20 }}>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:24 }}>🎵 Practice Session</h2>

      {/* Timer */}
      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:20, padding:30, textAlign:"center", marginBottom:24 }}>
        <p style={{ fontSize:56, fontWeight:800, fontVariantNumeric:"tabular-nums", color: running ? TEAL : "#fff", letterSpacing:4 }}>{fmt(timer)}</p>
        <p style={{ color:TEXT_DIM, fontSize:13, marginTop:8 }}>{running ? "Session in progress..." : "Ready to practice"}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:20 }}>
          <button onClick={startTimer}
            style={{ padding:"14px 40px", background: running ? "rgba(239,68,68,0.15)" : `linear-gradient(135deg, ${TEAL}, #0d9488)`, border: running ? "1px solid rgba(239,68,68,0.3)" : "none", borderRadius:14, color: running ? "#ef4444" : "#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow: running ? "none" : `0 4px 20px ${TEAL}40` }}>
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          {timer > 0 && !running && (
            <button onClick={() => navigate("session")}
              style={{ padding:"14px 40px", background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:14, color:"#a855f7", fontSize:16, fontWeight:700, cursor:"pointer" }}>
              Save Session
            </button>
          )}
        </div>
      </div>

      {/* Today's Goals */}
      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
        <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Today's Goals</p>
        {["Scales - 10 min","Sight Reading - 10 min","Free Play - 10 min"].map((g, i) => (
          <div key={g} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:10, background:"rgba(255,255,255,0.02)", borderRadius:8, border:`1px solid ${CARD_BORDER}`, marginBottom:6 }}>
            <span style={{ fontSize:13 }}>{g}</span>
            <span style={{ color: i===0 && timer > 600 ? "#22c55e" : TEXT_DIM, fontSize:12 }}>{i===0 && timer > 600 ? "✓" : "○"}</span>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20 }}>
        <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Recent Sessions</p>
        {[{d:"Today",t:"25 min",xp:"+120 XP"},{d:"Yesterday",t:"30 min",xp:"+150 XP"},{d:"2 days ago",t:"15 min",xp:"+80 XP"}].map(s => (
          <div key={s.d} style={{ display:"flex", justifyContent:"space-between", padding:10, borderBottom:`1px solid ${CARD_BORDER}` }}>
            <div><p style={{ fontSize:13 }}>{s.d}</p><p style={{ color:TEXT_DIM, fontSize:11 }}>{s.t}</p></div>
            <span style={{ color:TEAL, fontSize:12, fontWeight:600 }}>{s.xp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
