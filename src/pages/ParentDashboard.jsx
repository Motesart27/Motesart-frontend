import { useAuth } from "../context/AuthContext"

const BLUE = "#3b82f6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

export default function ParentDashboard() {
  const { user, navigate, logout } = useAuth()
  const name = user?.name || user?.["Student / User Name"] || "Parent"

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff" }}>
      <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <span style={{ fontSize:20 }}>🎵</span>
            <span style={{ fontSize:18, fontWeight:700 }}>School of Motesart</span>
          </div>
          <p style={{ color:TEXT_DIM, fontSize:12 }}>Welcome back, {name}</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ background:"rgba(59,130,246,0.12)", color:BLUE, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:600, border:"1px solid rgba(59,130,246,0.2)" }}>Parent View</span>
          <button onClick={() => navigate("settings")} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>⚙️</button>
          <button onClick={logout} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"6px 12px", color:"#ef4444", cursor:"pointer", fontSize:12, fontWeight:600 }}>Logout</button>
        </div>
      </div>

      <div style={{ padding:"0 20px" }}>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
          <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Child's Progress</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ background:"rgba(59,130,246,0.06)", borderRadius:12, padding:14, textAlign:"center", border:"1px solid rgba(59,130,246,0.15)" }}>
              <p style={{ fontSize:28, fontWeight:800, color:BLUE }}>Level 12</p>
              <p style={{ color:TEXT_DIM, fontSize:11 }}>Current Level</p>
            </div>
            <div style={{ background:"rgba(20,184,166,0.06)", borderRadius:12, padding:14, textAlign:"center", border:"1px solid rgba(20,184,166,0.15)" }}>
              <p style={{ fontSize:28, fontWeight:800, color:"#14b8a6" }}>5/7</p>
              <p style={{ color:TEXT_DIM, fontSize:11 }}>Days Practiced</p>
            </div>
          </div>
        </div>

        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
          <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Weekly Summary</p>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.6 }}>Your child has been practicing consistently this week. They completed 3 homework assignments and scored well in ear training exercises.</p>
        </div>

        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
          <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Homework Status</p>
          {["Scale Practice - C Major","Rhythm Exercise #4","Ear Training Quiz"].map((hw, i) => (
            <div key={hw} style={{ padding:12, background:"rgba(255,255,255,0.02)", borderRadius:10, border:`1px solid ${CARD_BORDER}`, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13 }}>{hw}</span>
              <span style={{ fontSize:11, fontWeight:600, color:[BLUE,"#22c55e","#eab308"][i] }}>{["In Progress","Completed","Due Tomorrow"][i]}</span>
            </div>
          ))}
        </div>

        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20 }}>
          <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Teacher Messages</p>
          <div style={{ padding:12, background:"rgba(255,255,255,0.02)", borderRadius:10, border:`1px solid ${CARD_BORDER}` }}>
            <p style={{ fontSize:13, marginBottom:4 }}>Great progress on scales this week!</p>
            <p style={{ color:TEXT_DIM, fontSize:11 }}>— Ms. Johnson, 2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
