import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

export default function Login({ onRegister }) {
  const { login } = useAuth()
  const [tab, setTab] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      const data = await api.login(email, password)
      login({ ...data, role: (data.roles || data.role || "User") })
    } catch (err) {
      setError(err.message || "Login failed")
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0d1b3e 60%, #0a0a1a 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans', sans-serif", position:"relative", overflow:"hidden" }}>
      {/* Animated background orbs */}
      <div style={{ position:"absolute", top:"10%", left:"20%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)", animation:"float 8s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"15%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle, rgba(79,70,229,0.12), transparent 70%)", animation:"float 10s ease-in-out infinite reverse" }} />
      <div style={{ position:"absolute", top:"50%", left:"60%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", animation:"float 12s ease-in-out infinite" }} />

      {/* Logo with laser rings */}
      <div style={{ position:"relative", width:140, height:140, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* Spinning laser ring 1 */}
        <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"rgba(139,92,246,0.6)", borderRightColor:"rgba(168,85,247,0.3)", animation:"spin 3s linear infinite", filter:"drop-shadow(0 0 8px rgba(139,92,246,0.4))" }} />
        {/* Spinning laser ring 2 */}
        <div style={{ position:"absolute", inset:-20, borderRadius:"50%", border:"1.5px solid transparent", borderBottomColor:"rgba(79,70,229,0.5)", borderLeftColor:"rgba(139,92,246,0.2)", animation:"spin 5s linear infinite reverse", filter:"drop-shadow(0 0 6px rgba(79,70,229,0.3))" }} />
        {/* Glow pulse */}
        <div style={{ position:"absolute", inset:-4, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)", animation:"glowPulse 2s ease-in-out infinite" }} />
        {/* Logo circle */}
        <div style={{ width:120, height:120, borderRadius:"50%", background:"linear-gradient(135deg, rgba(139,92,246,0.2), rgba(79,70,229,0.15))", border:"1px solid rgba(139,92,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", zIndex:1 }}>
          <video autoPlay loop muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }}>
            <source src="/logo-anim.mp4" type="video/mp4" />
          </video>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:48, filter:"drop-shadow(0 0 12px rgba(139,92,246,0.5))" }}>🎵</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 style={{ fontSize:28, fontWeight:800, background:"linear-gradient(135deg, #c4b5fd, #8b5cf6, #6366f1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:4, animation:"fadeInUp 0.6s ease" }}>School of Motesart</h1>
      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, letterSpacing:"0.15em", marginBottom:32, animation:"fadeInUp 0.8s ease" }}>FIND THE NOTE • MASTER YOUR EAR</p>

      {/* Sign In / Register tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:24, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:3, border:"1px solid rgba(255,255,255,0.06)" }}>
        {["signin","register"].map(t => (
          <button key={t} onClick={() => t === "register" ? onRegister() : setTab("signin")}
            style={{ padding:"10px 32px", borderRadius:10, border:"none", fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.3s",
              background: t === tab ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(79,70,229,0.2))" : "transparent",
              color: t === tab ? "#c4b5fd" : "rgba(255,255,255,0.35)",
              boxShadow: t === tab ? "0 2px 12px rgba(139,92,246,0.15)" : "none"
            }}>
            {t === "signin" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:14, animation:"fadeInUp 1s ease" }}>
        <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
          style={{ width:"100%", padding:"14px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:15, fontFamily:"'DM Sans'", outline:"none" }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
          style={{ width:"100%", padding:"14px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:15, fontFamily:"'DM Sans'", outline:"none" }} />

        {error && <p style={{ color:"#ef4444", fontSize:13, textAlign:"center" }}>{error}</p>}

        <button type="submit" disabled={loading}
          style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg, #8b5cf6, #6366f1)", border:"none", borderRadius:12, color:"#fff", fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1, boxShadow:"0 4px 20px rgba(139,92,246,0.3)", transition:"all 0.3s" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0" }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
          <span style={{ color:"rgba(255,255,255,0.25)", fontSize:12 }}>or</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
        </div>

        <button type="button" style={{ width:"100%", padding:"14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes glowPulse { 0%,100% { opacity:0.5; transform:scale(1) } 50% { opacity:1; transform:scale(1.05) } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-20px) } }
      `}</style>
    </div>
  )
}
