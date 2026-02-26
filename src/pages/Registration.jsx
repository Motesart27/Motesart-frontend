import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

const TEAL = "#14b8a6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

const ROLES = ["Student","Parent","Teacher","Ambassador","Admin"]

export default function Registration({ onBack }) {
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"", role:"Student", phone:"" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (k, v) => setForm({ ...form, [k]: v })

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) { setError("Passwords don't match"); return }
    setError(""); setLoading(true)
    try {
      const data = await api.register({ name: form.name, email: form.email, password: form.password, role: form.role })
      login({ ...data, role: form.role, name: form.name })
    } catch (err) { setError(err.message || "Registration failed") }
    finally { setLoading(false) }
  }

  const inputStyle = { width:"100%", padding:"14px 18px", background:"rgba(255,255,255,0.04)", border:`1px solid rgba(255,255,255,0.08)`, borderRadius:12, color:"#fff", fontSize:15, fontFamily:"'DM Sans'", outline:"none" }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0d1b3e 60%, #0a0a1a 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans', sans-serif", padding:20 }}>
      <h1 style={{ fontSize:24, fontWeight:800, background:"linear-gradient(135deg, #c4b5fd, #8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>Create Account</h1>
      <p style={{ color:TEXT_DIM, fontSize:13, marginBottom:24 }}>Step {step} of 2</p>

      <div style={{ width:"100%", maxWidth:360 }}>
        {step === 1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <input placeholder="Full Name" value={form.name} onChange={e => update("name", e.target.value)} style={inputStyle} />
            <input type="email" placeholder="Email address" value={form.email} onChange={e => update("email", e.target.value)} style={inputStyle} />
            <input placeholder="Phone (optional)" value={form.phone} onChange={e => update("phone", e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Password" value={form.password} onChange={e => update("password", e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} style={inputStyle} />
            <button onClick={() => { if (!form.name||!form.email||!form.password) { setError("Please fill all required fields"); return }; setError(""); setStep(2) }}
              style={{ width:"100%", padding:14, background:"linear-gradient(135deg, #8b5cf6, #6366f1)", border:"none", borderRadius:12, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, textAlign:"center", marginBottom:8 }}>Select your role</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {ROLES.map(r => (
                <button key={r} onClick={() => update("role", r)}
                  style={{ padding:"14px 18px", borderRadius:12, border:"none", fontSize:14, fontWeight:600, cursor:"pointer", textAlign:"left",
                    background: form.role===r ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                    color: form.role===r ? "#c4b5fd" : TEXT_DIM,
                    outline: form.role===r ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                  {r === "Student" && "🎵 "}{r === "Parent" && "👨‍👩‍👧 "}{r === "Teacher" && "👩‍🏫 "}{r === "Ambassador" && "🌟 "}{r === "Admin" && "⚙️ "}{r}
                </button>
              ))}
            </div>
            {error && <p style={{ color:"#ef4444", fontSize:13, textAlign:"center" }}>{error}</p>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setStep(1)}
                style={{ flex:1, padding:14, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex:2, padding:14, background:"linear-gradient(135deg, #8b5cf6, #6366f1)", border:"none", borderRadius:12, color:"#fff", fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1 }}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        )}

        {error && step === 1 && <p style={{ color:"#ef4444", fontSize:13, textAlign:"center", marginTop:10 }}>{error}</p>}

        <button onClick={onBack} style={{ width:"100%", marginTop:16, padding:12, background:"none", border:"none", color:TEXT_DIM, fontSize:13, cursor:"pointer" }}>
          Already have an account? Sign In
        </button>
      </div>
    </div>
  )
}
