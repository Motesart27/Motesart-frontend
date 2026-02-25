import { useState } from 'react'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function TamiChat({ user }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm T.A.M.i, your music learning assistant. How can I help you today? 🎵" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/tami/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, context: { user_name: user?.name } })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || data.message || 'Sorry, I had trouble responding.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having connection issues. Try again in a moment." }])
    }
    setLoading(false)
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', bottom: 90, right: 24,
      width: 360, height: 480,
      background: '#151520', borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'DM Sans', sans-serif",
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎵</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>T.A.M.i</span>
        </div>
        <button onClick={() => setOpen(false)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: 20, cursor: 'pointer',
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px 18px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
            background: m.role === 'user'
              ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
              : 'rgba(255,255,255,0.06)',
            color: '#fff', fontSize: 14, lineHeight: 1.5,
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start', padding: '10px 14px', borderRadius: 14,
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
          }}>Thinking...</div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask T.A.M.i anything..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            color: '#fff', fontSize: 14, outline: 'none',
          }}
        />
        <button onClick={send} style={{
          padding: '10px 16px', borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer',
        }}>Send</button>
      </div>
    </div>
  )
}

// Export the toggle button separately so App.jsx can use it
export function TamiToggle({ onClick }) {
  return null // The toggle is now built into TeacherDashboard
}
