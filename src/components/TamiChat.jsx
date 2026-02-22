import { useState, useRef, useEffect } from "react"
import { tamiChat } from "../services/api"

export default function TamiChat({ user }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hey ${user?.name?.split(" ")[0] || "there"}! 🎵 I'm T.A.M.i, your music coach. Ask me anything about your practice, games, or homework!` }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const res = await tamiChat(user?.name || "Demo Student", userMsg, history)
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }])
      setHistory(res.updated_history || [])
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Check your API connection! 🔧"
      }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 1000,
          width: 60, height: 60, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #e84b8a, #f97316)",
          boxShadow: "0 8px 32px rgba(232,75,138,0.4)",
          cursor: "pointer", fontSize: 26,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
          transform: open ? "scale(0.9)" : "scale(1)",
        }}
      >
        {open ? "✕" : "🎵"}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 999,
          width: 380, height: 520, borderRadius: 20,
          background: "#0d0d14", border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          animation: "slideUp 0.2s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #e84b8a, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🎵</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>T.A.M.i</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Your music coach · Always here</div>
            </div>
            <div style={{
              marginLeft: "auto", width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e", boxShadow: "0 0 8px #22c55e",
            }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginRight: 8, marginTop: 2,
                    background: "linear-gradient(135deg, #e84b8a, #f97316)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                  }}>🎵</div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", borderRadius: 14,
                  background: msg.role === "user" ? "linear-gradient(135deg, #e84b8a, #f97316)" : "rgba(255,255,255,0.06)",
                  color: "#fff", fontSize: 14, lineHeight: 1.5,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: msg.role === "assistant" ? 4 : 14,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 8, padding: "0 0 8px 36px" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#e84b8a", opacity: 0.6,
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 10,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask T.A.M.i anything..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff", fontSize: 14, outline: "none",
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 42, height: 42, borderRadius: 12, border: "none",
              background: input.trim() ? "linear-gradient(135deg, #e84b8a, #f97316)" : "rgba(255,255,255,0.06)",
              color: "#fff", cursor: input.trim() ? "pointer" : "default",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.4); opacity: 1; } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
      `}</style>
    </>
  )
}
