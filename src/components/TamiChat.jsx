import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

export default function TamiChat() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm T.A.M.i — your AI music assistant. How can I help you today? 🎵" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.chatWithTami(input.trim(), user?.id)
      setMessages(prev => [...prev, { role: 'assistant', content: res.response || res.message || "I'm not sure how to help with that." }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Try again in a moment! 🎶" }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const s = {
    fab: {
      position: 'fixed', bottom: 24, right: 24, width: 60, height: 60,
      borderRadius: '50%', border: '3px solid rgba(139,92,246,0.5)', cursor: 'pointer', zIndex: 9999,
      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(6,182,212,0.4)', transition: 'transform 0.2s',
      fontSize: 28, overflow: 'hidden', padding: 0
    },
    panel: {
      position: 'fixed', bottom: 96, right: 24, width: 360, maxHeight: 500,
      background: '#1f2937', borderRadius: 16, zIndex: 9998,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(6,182,212,0.3)', overflow: 'hidden'
    },
    header: {
      padding: '14px 16px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    },
    headerTitle: { color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 },
    closeBtn: {
      background: 'none', border: 'none', color: '#fff', fontSize: 20,
      cursor: 'pointer', padding: '0 4px'
    },
    body: {
      flex: 1, overflowY: 'auto', padding: 12, display: 'flex',
      flexDirection: 'column', gap: 8, maxHeight: 340, minHeight: 200
    },
    msgUser: {
      alignSelf: 'flex-end', background: 'rgba(6,182,212,0.2)',
      borderRadius: '12px 12px 4px 12px', padding: '8px 12px',
      color: '#e5e7eb', fontSize: 14, maxWidth: '80%'
    },
    msgBot: {
      alignSelf: 'flex-start', background: 'rgba(139,92,246,0.15)',
      borderRadius: '12px 12px 12px 4px', padding: '8px 12px',
      color: '#e5e7eb', fontSize: 14, maxWidth: '80%'
    },
    inputRow: {
      display: 'flex', padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.1)',
      gap: 8, background: '#111827'
    },
    input: {
      flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14,
      outline: 'none', resize: 'none', fontFamily: 'inherit'
    },
    sendBtn: {
      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none',
      borderRadius: 8, padding: '8px 14px', color: '#fff', fontWeight: 600,
      cursor: 'pointer', fontSize: 14
    }
  }

  return (
    <>
      {isOpen && (
        <div style={s.panel}>
          <div style={s.header}>
            <span style={s.headerTitle}><img src="/tami-avatar.png" alt="T.A.M.i" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8, verticalAlign: 'middle' }} />T.A.M.i</span>
            <button style={s.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div style={s.body}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === 'user' ? s.msgUser : s.msgBot}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={s.msgBot}>
                <span style={{ opacity: 0.6 }}>T.A.M.i is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={s.inputRow}>
            <textarea
              style={s.input}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask T.A.M.i anything..."
            />
            <button style={s.sendBtn} onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
      <button
        style={s.fab}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with T.A.M.i"
      >
        {isOpen ? '✕' : <img src="/tami-avatar.png" alt="T.A.M.i" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />}
      </button>
    </>
  )
}
