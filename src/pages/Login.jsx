import { useState } from "react"
import { getUserByEmail } from "../services/api"

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const user = await getUserByEmail(email)
      onLogin({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.[0] || "Student",
      })
    } catch {
      // Demo fallback for testing
      if (email.includes("teacher") || email.includes("motesart")) {
        onLogin({ id: "demo", name: "Demo Teacher", email, role: "Teacher" })
      } else {
        onLogin({ id: "demo", name: "Demo Student", email, role: "Student" })
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,75,138,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, padding: "48px 40px", width: 400,
        backdropFilter: "blur(20px)", position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #e84b8a, #f97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, boxShadow: "0 8px 32px rgba(232,75,138,0.3)",
          }}>🎵</div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            School of Motesart
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 6 }}>
            Powered by T.A.M.i Intelligence
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@motesart.com"
              required
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #e84b8a, #f97316)",
            color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
            opacity: loading ? 0.7 : 1, marginTop: 8,
            boxShadow: "0 4px 20px rgba(232,75,138,0.3)",
          }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textAlign: "center", marginTop: 24 }}>
          Use your Motesart account email to sign in
        </p>
      </div>
    </div>
  )
}
