import { useState, useRef, useEffect } from "react"
import { api } from "../services/api"

export default function TamiChat({ user }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hi! I'm T.A.M.i, your musical AI assistant. How can I help you today? 🎵" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim(); setInput(""); setLoading(true)
    setMessages(m => [...m, { role:"user", content:msg }])
    try {
      const data = await api.chatWithTami(msg, { name:user?.name, role:user?.role })
      setMessages(m => [...m, { role:"assistant", content: data.response || data.message || "I'm here to help!" }])
    } catch {
      setMessages(m => [...m, { role:"assistant", content:"Sorry, I couldn't connect right now. Try again in a moment!" }])
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* Floating Bubble */}
      <button onClick={() => setOpen(!open)}
        style={{ position:"fixed", bottom:20, right:20, width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(135deg, #e84b8a, #a855f7)", border:"none", cursor:"pointer",
          boxShadow:"0 4px 20px rgba(232,75,138,0.4)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, color:"#fff", transition:"transform 0.2s", transform: open ? "scale(0.9)" : "scale(1)" }}>
        {open ? "✕" : "🎵"}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{ position:"fixed", bottom:88, right:20, width:340, maxHeight:480, borderRadius:20,
          background:"rgba(15,15,25,0.98)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)",
          display:"flex", flexDirection:"column", zIndex:999, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.5)",
          animation:"slideUp 0.3s ease", fontFamily:"'DM Sans', sans-serif" }}>

          {/* Header */}
          <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg, #e84b8a, #a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🎵</div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:"#fff" }}>T.A.M.i</p>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Your Musical AI Assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:10, maxHeight:320 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role==="user" ? "flex-end" : "flex-start", maxWidth:"85%" }}>
                <div style={{ padding:"10px 14px", borderRadius: m.role==="user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role==="user" ? "linear-gradient(135deg, #e84b8a, #a855f7)" : "rgba(255,255,255,0.06)",
                  color:"#fff", fontSize:13, lineHeight:1.5 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf:"flex-start", padding:"10px 14px", background:"rgba(255,255,255,0.06)", borderRadius:"14px 14px 14px 4px" }}>
                <div style={{ display:"flex", gap:4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(255,255,255,0.3)", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding:12, borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask T.A.M.i anything..."
              style={{ flex:1, padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, fontFamily:"'DM Sans'", outline:"none" }} />
            <button onClick={send}
              style={{ width:40, height:40, borderRadius:10, border:"none",
                background: input.trim() ? "linear-gradient(135deg, #e84b8a, #a855f7)" : "rgba(255,255,255,0.06)",
                color:"#fff", cursor: input.trim() ? "pointer" : "default", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
              →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:0.6 } 50% { transform:scale(1.4); opacity:1 } }
      `}</style>
    </>
  )
}
