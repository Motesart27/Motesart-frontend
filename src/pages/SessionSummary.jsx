import { useAuth } from "../context/AuthContext"

const TEAL = "#14b8a6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

export default function SessionSummary() {
  const { navigate } = useAuth()

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", padding:20 }}>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:24 }}>🎉 Session Complete!</h2>

      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:20, padding:30, textAlign:"center", marginBottom:24 }}>
        <p style={{ fontSize:48, marginBottom:8 }}>⭐</p>
        <p style={{ fontSize:24, fontWeight:800, color:TEAL }}>+150 XP</p>
        <p style={{ color:TEXT_DIM, fontSize:14, marginTop:8 }}>Great practice session!</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:14, padding:16, textAlign:"center" }}>
          <p style={{ fontSize:24, fontWeight:800 }}>25:00</p>
          <p style={{ color:TEXT_DIM, fontSize:11 }}>Duration</p>
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:14, padding:16, textAlign:"center" }}>
          <p style={{ fontSize:24, fontWeight:800, color:"#a855f7" }}>92%</p>
          <p style={{ color:TEXT_DIM, fontSize:11 }}>Accuracy</p>
        </div>
      </div>

      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:24 }}>
        <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>T.A.M.i's Feedback</p>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.6 }}>You showed strong consistency with your scales today. Focus on slowing down during the chromatic passages to improve accuracy. Keep up the daily practice streak!</p>
      </div>

      <button onClick={() => navigate("dashboard")}
        style={{ width:"100%", padding:16, background:`linear-gradient(135deg, ${TEAL}, #0d9488)`, border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 20px ${TEAL}40` }}>
        Back to Dashboard
      </button>
    </div>
  )
}
