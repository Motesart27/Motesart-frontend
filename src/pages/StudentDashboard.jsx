import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const TEAL = "#14b8a6"
const TEAL_DARK = "#0d9488"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"
const TEXT_MED = "rgba(255,255,255,0.7)"

function DPMRing({ value, label, color, size = 70 }) {
  const r = (size - 10) / 2, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ
  return (
    <div style={{ textAlign:"center" }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:"stroke-dashoffset 1s ease" }} />
        <text x={size/2} y={size/2+5} textAnchor="middle" fill={color} fontSize={14} fontWeight={700}>{value}%</text>
      </svg>
      <p style={{ color:TEXT_DIM, fontSize:10, marginTop:4, fontWeight:600, letterSpacing:"0.05em" }}>{label}</p>
    </div>
  )
}

function ProgressBar({ value, max, color }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, height:8, overflow:"hidden" }}>
      <div style={{ width:`${(value/max)*100}%`, height:"100%", background:`linear-gradient(90deg, ${color}, ${color}88)`, borderRadius:6, transition:"width 1s ease" }} />
    </div>
  )
}

export default function StudentDashboard() {
  const { user, navigate, logout } = useAuth()
  const [view, setView] = useState("academic")
  const [hwTab, setHwTab] = useState("active")
  const name = user?.name || user?.["Student / User Name"] || "Student"

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", paddingBottom:90 }}>
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
          <span style={{ background:"rgba(20,184,166,0.12)", color:TEAL, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:600, border:`1px solid rgba(20,184,166,0.2)` }}>Student View</span>
          <button onClick={() => navigate("settings")} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>⚙️</button>
          <button onClick={logout} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"6px 12px", color:"#ef4444", cursor:"pointer", fontSize:12, fontWeight:600 }}>Logout</button>
        </div>
      </div>

      {/* Academic / Game Toggle */}
      <div style={{ padding:"0 20px", marginBottom:16 }}>
        <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:3, border:`1px solid ${CARD_BORDER}` }}>
          {["academic","game"].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ flex:1, padding:"10px 0", borderRadius:10, border:"none", fontSize:13, fontWeight:600, cursor:"pointer",
                background: v===view ? `linear-gradient(135deg, ${TEAL}25, ${TEAL_DARK}20)` : "transparent",
                color: v===view ? TEAL : TEXT_DIM }}>
              {v === "academic" ? "📊 Academic" : "🎮 Game"}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ padding:"0 20px", marginBottom:20, display:"flex", gap:8 }}>
        <button onClick={() => navigate("practice")} style={{ flex:1, padding:"10px 0", background:`linear-gradient(135deg, ${TEAL}20, ${TEAL_DARK}15)`, border:`1px solid ${TEAL}30`, borderRadius:10, color:TEAL, fontSize:12, fontWeight:600, cursor:"pointer" }}>⚡ Power Up Session</button>
        <button onClick={() => navigate("homework")} style={{ flex:1, padding:"10px 0", background:"rgba(168,85,247,0.08)", border:"1px solid rgba(168,85,247,0.2)", borderRadius:10, color:"#a855f7", fontSize:12, fontWeight:600, cursor:"pointer" }}>📋 Quest Log</button>
        <button onClick={() => navigate("leaderboard")} style={{ flex:1, padding:"10px 0", background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.2)", borderRadius:10, color:"#f97316", fontSize:12, fontWeight:600, cursor:"pointer" }}>🏆 High Scores</button>
      </div>

      <div style={{ padding:"0 20px" }}>
        {view === "academic" ? (
          <>
            {/* Player Level - DPM Donuts */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Player Level</p>
                  <p style={{ fontSize:24, fontWeight:800, marginTop:4 }}>Level 12</p>
                </div>
                <span style={{ background:`${TEAL}15`, color:TEAL, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 }}>+240 XP this week</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-around" }}>
                <DPMRing value={78} label="DRIVE" color="#14b8a6" />
                <DPMRing value={85} label="PASSION" color="#a855f7" />
                <DPMRing value={62} label="MOTIVATION" color="#f97316" />
              </div>
            </div>

            {/* XP Progress */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
              <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>XP Progress</p>
              <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:TEAL }}><span style={{ width:8, height:8, borderRadius:"50%", background:TEAL }} />Actual</span>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:TEXT_DIM }}><span style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.15)" }} />Goal</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", height:80, alignItems:"flex-end", gap:4 }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => {
                  const actual = [45, 60, 30, 75, 50, 80, 40][i]
                  const goal = 60
                  return (
                    <div key={d} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                      <div style={{ width:"100%", display:"flex", gap:2, justifyContent:"center", height:60, alignItems:"flex-end" }}>
                        <div style={{ width:"40%", height:`${(actual/100)*60}px`, background:`linear-gradient(180deg, ${TEAL}, ${TEAL}60)`, borderRadius:3 }} />
                        <div style={{ width:"40%", height:`${(goal/100)*60}px`, background:"rgba(255,255,255,0.08)", borderRadius:3 }} />
                      </div>
                      <span style={{ fontSize:9, color:TEXT_DIM }}>{d}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Practice Goals */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Practice Goals</p>
                <span style={{ color:TEAL, fontSize:13, fontWeight:700 }}>5/7 days</span>
              </div>
              <ProgressBar value={5} max={7} color={TEAL} />
              <p style={{ color:TEXT_DIM, fontSize:11, marginTop:8 }}>Weekly Goal: 30 min/day</p>
            </div>

            {/* Homework Hub */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
              <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Homework Hub</p>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {["active","completed","overdue"].map(t => (
                  <button key={t} onClick={() => setHwTab(t)}
                    style={{ padding:"6px 14px", borderRadius:8, border:"none", fontSize:11, fontWeight:600, cursor:"pointer",
                      background: t===hwTab ? `${TEAL}20` : "rgba(255,255,255,0.04)", color: t===hwTab ? TEAL : TEXT_DIM }}>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:14, border:`1px solid ${CARD_BORDER}` }}>
                <p style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>🎵 Scale Practice - C Major</p>
                <p style={{ color:TEXT_DIM, fontSize:12 }}>Due: Tomorrow • 15 min estimated</p>
              </div>
            </div>

            {/* Achievements */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20 }}>
              <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Achievements</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8 }}>
                {["🔥 7-Day Streak","🎯 Perfect Score","📚 10 Lessons","⭐ First Solo"].map(a => (
                  <div key={a} style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:10, textAlign:"center", border:`1px solid ${CARD_BORDER}` }}>
                    <p style={{ fontSize:20, marginBottom:4 }}>{a.split(" ")[0]}</p>
                    <p style={{ fontSize:9, color:TEXT_DIM }}>{a.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Game View */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
              <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Battle Stats</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div style={{ background:"rgba(20,184,166,0.06)", borderRadius:12, padding:14, textAlign:"center", border:"1px solid rgba(20,184,166,0.15)" }}>
                  <p style={{ fontSize:28, fontWeight:800, color:TEAL }}>2,450</p>
                  <p style={{ color:TEXT_DIM, fontSize:11 }}>Total XP</p>
                </div>
                <div style={{ background:"rgba(168,85,247,0.06)", borderRadius:12, padding:14, textAlign:"center", border:"1px solid rgba(168,85,247,0.15)" }}>
                  <p style={{ fontSize:28, fontWeight:800, color:"#a855f7" }}>18</p>
                  <p style={{ color:TEXT_DIM, fontSize:11 }}>Battles Won</p>
                </div>
              </div>
            </div>

            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
              <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Power Level</p>
              {["Ear Training","Rhythm","Sight Reading","Theory"].map((s, i) => (
                <div key={s} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:TEXT_MED }}>{s}</span>
                    <span style={{ fontSize:12, color:TEAL, fontWeight:600 }}>Lv.{[8,6,5,7][i]}</span>
                  </div>
                  <ProgressBar value={[80,60,50,70][i]} max={100} color={[TEAL,"#a855f7","#f97316","#3b82f6"][i]} />
                </div>
              ))}
            </div>

            <button onClick={() => navigate("game")}
              style={{ width:"100%", padding:"16px", background:`linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`, border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 20px ${TEAL}40`, marginBottom:16 }}>
              🎮 Play Find the Note
            </button>

            {/* Trophies */}
            <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20 }}>
              <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Trophies Unlocked</p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {["🏆 Champion","🎖️ Veteran","💎 Diamond","🌟 Rising Star"].map(t => (
                  <div key={t} style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:"10px 14px", border:`1px solid ${CARD_BORDER}`, display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:18 }}>{t.split(" ")[0]}</span>
                    <span style={{ fontSize:11, color:TEXT_MED }}>{t.split(" ").slice(1).join(" ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(10,10,15,0.95)", backdropFilter:"blur(20px)", borderTop:`1px solid ${CARD_BORDER}`, padding:"10px 20px", display:"flex", justifyContent:"space-around", zIndex:50 }}>
        {[
          { icon:"🎵", label:"Practice", page:"practice" },
          { icon:"📚", label:"Homework", page:"homework" },
          { icon:"🏆", label:"Leaders", page:"leaderboard" }
        ].map(n => (
          <button key={n.page} onClick={() => navigate(n.page)}
            style={{ background:"none", border:"none", color:TEXT_DIM, fontSize:10, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:20 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  )
}
