import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"
const TEAL = "#14b8a6"

export default function Settings() {
  const { user, logout, navigate } = useAuth()
  const [name, setName] = useState(user?.name || user?.["Student / User Name"] || "")
  const [email, setEmail] = useState(user?.email || user?.["User Email"] || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [contact, setContact] = useState("email")
  const role = user?.role || "User"

  const inputStyle = { width:"100%", padding:"12px 16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${CARD_BORDER}`, borderRadius:10, color:"#fff", fontSize:14, fontFamily:"'DM Sans'", outline:"none" }

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", padding:20 }}>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:24 }}>⚙️ Settings</h2>

      {/* Profile */}
      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
        <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:16 }}>Profile</p>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg, rgba(20,184,166,0.2), rgba(168,85,247,0.2))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
            {name ? name[0].toUpperCase() : "?"}
          </div>
          <div>
            <p style={{ fontSize:16, fontWeight:600 }}>{name || "Your Name"}</p>
            <p style={{ color:TEXT_DIM, fontSize:12 }}>{email}</p>
            <span style={{ background:`${TEAL}15`, color:TEAL, padding:"2px 10px", borderRadius:6, fontSize:10, fontWeight:600 }}>{role}</span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <label style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Phone Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" style={inputStyle} />
          </div>
          <div>
            <label style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, display:"block", marginBottom:10 }}>Preferred Contact Method</label>
            <div style={{ display:"flex", gap:8 }}>
              {["email","phone"].map(m => (
                <button key={m} onClick={() => setContact(m)}
                  style={{ flex:1, padding:"10px", borderRadius:10, border:"none", fontSize:12, fontWeight:600, cursor:"pointer",
                    background: contact===m ? `${TEAL}20` : "rgba(255,255,255,0.04)", color: contact===m ? TEAL : TEXT_DIM }}>
                  {m === "email" ? "📧 Email" : "📱 Phone/SMS"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Display */}
      <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:16, padding:20, marginBottom:16 }}>
        <p style={{ color:TEXT_DIM, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Role</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["Admin","Teacher","Ambassador","Student","Parent","User"].map(r => (
            <span key={r} style={{ padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:600,
              background: (role||"").toLowerCase() === r.toLowerCase() ? `${TEAL}20` : "rgba(255,255,255,0.04)",
              color: (role||"").toLowerCase() === r.toLowerCase() ? TEAL : TEXT_DIM,
              border: `1px solid ${(role||"").toLowerCase() === r.toLowerCase() ? `${TEAL}30` : CARD_BORDER}` }}>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <button style={{ width:"100%", padding:14, background:`${TEAL}15`, border:`1px solid ${TEAL}30`, borderRadius:12, color:TEAL, fontSize:14, fontWeight:600, cursor:"pointer" }}>Save Changes</button>
        <button style={{ width:"100%", padding:14, background:"rgba(255,255,255,0.04)", border:`1px solid ${CARD_BORDER}`, borderRadius:12, color:TEXT_DIM, fontSize:14, fontWeight:600, cursor:"pointer" }}>Change Password</button>
        <button onClick={logout} style={{ width:"100%", padding:14, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, color:"#ef4444", fontSize:14, fontWeight:600, cursor:"pointer" }}>Log Out</button>
      </div>
    </div>
  )
}
