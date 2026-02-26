import { useState, useRef, useEffect } from 'react'
import { api } from '../services/api.js'

export default function TamiChat({ user }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await api.chatWithTami(userMsg, { userName: user?.name, userRole: user?.role })
      setMessages(prev => [...prev, { role: 'assistant', text: res.response || res.message || "I'm here to help!" }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting. Try again in a moment!" }])
    }
    setLoading(false)
  }

  /* === FLOATING BUBBLE — clean pink/purple gradient, no emoji === */
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', bottom: 20, right: 20, width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
        border: '2px solid rgba(168,85,247,0.4)',
        cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(168,85,247,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, transition: 'transform 0.2s', padding: 0,
        color: '#fff', fontSize: 20, fontWeight: 800,
        fontFamily: "'DM Sans', sans-serif",
      }}>T</button>
    )
  }

  /* === POPUP CHAT — T.A.M.i avatar in header (this part already works) === */
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 370, height: 500,
      background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
      display: 'flex', flexDirection: 'column', zIndex: 1000,
      boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    }}>
      {/* Header with T.A.M.i avatar */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(232,75,138,0.1))',
        borderRadius: '20px 20px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
            border: '2px solid rgba(168,85,247,0.4)',
          }}>
            <img src="/tami-avatar.png" alt="T.A.M.i" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.background='linear-gradient(135deg,#a855f7,#ec4899)'; e.target.parentElement.innerHTML='<span style="color:#fff;font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;width:100%;height:100%">T</span>' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>T.A.M.i</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Your AI Music Coach</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
          fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 40, lineHeight: 1.6 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px' }}>
              <img src="/tami-avatar.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.parentElement.innerHTML='<div style="width:100%;height:100%;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:800">T</div>' }} />
            </div>
            Hi{user?.name ? ` ${user.name.split(' ')[0]}` : ''}! I'm T.A.M.i, your AI music assistant.<br/>
            Ask me anything about practice, theory, or your progress!
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.06)',
            color: '#fff', padding: '10px 14px', borderRadius: 14, maxWidth: '80%', fontSize: 13, lineHeight: 1.6,
          }}>{msg.text}</div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '10px 14px' }}>T.A.M.i is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask T.A.M.i..."
          style={{
            flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff',
            fontSize: 13, outline: 'none', fontFamily: "'DM Sans', sans-serif",
          }} />
        <button onClick={sendMessage} disabled={loading} style={{
          padding: '10px 18px', background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          border: 'none', borderRadius: 10, color: '#fff', cursor: loading ? 'wait' : 'pointer',
          fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
        }}>Send</button>
      </div>
    </div>
  )
}
