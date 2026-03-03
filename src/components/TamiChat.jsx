import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

export default function TamiChat() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [suggestedActions, setSuggestedActions] = useState([])
  const [hasGreeted, setHasGreeted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef(null)

  const studentName = user?.name || user?.email?.split('@')[0] || 'Student'

// Listen for external open-tami-chat events (from header buttons)
  useEffect(() => {
    const handleOpenTami = () => setIsOpen(true);
    window.addEventListener('open-tami-chat', handleOpenTami);
    return () => window.removeEventListener('open-tami-chat', handleOpenTami);
  }, []);

  // Inject pulse animation keyframes
  useEffect(() => {
    const styleId = 'tami-pulse-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = '@keyframes tami-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }';
      document.head.appendChild(style);
    }
  }, []);



    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Stop speech when chat closes
  useEffect(() => {
    if (!isOpen && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
    }
  }, [])

  // ---- Text-to-Speech using Puter.js (Neural voices) ----
  // Load Puter.js script on mount
  useEffect(() => {
    if (!document.getElementById('puter-js')) {
      const s = document.createElement('script');
      s.id = 'puter-js';
      s.src = 'https://js.puter.com/v2/';
      document.head.appendChild(s);
    }
  }, []);

  const speakText = useCallback((text) => {
    if (!voiceEnabled || !text) return;
    // Clean the text for speech (remove markdown, emojis, links)
    const cleanText = text
      .replace(/[*_~`#]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();
    if (!cleanText || cleanText.length > 3000) return;

    setIsSpeaking(true);
    if (window.puter && window.puter.ai) {
      window.puter.ai.txt2speech(cleanText, {
        voice: 'Joanna',
        engine: 'neural',
        language: 'en-US'
      }).then(audio => {
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        audio.play().catch(() => setIsSpeaking(false));
      }).catch(() => setIsSpeaking(false));
    } else {
      // Fallback to Web Speech API if Puter not loaded yet
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(cleanText);
      u.rate = 1.05; u.pitch = 1.15;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      synth.speak(u);
    }
  }, [voiceEnabled])

  // T.A.M.i greets the student when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      fetchGreeting()
    }
  }, [isOpen])

  const fetchGreeting = async () => {
    setHasGreeted(true)
    setLoading(true)
    try {
      const res = await api.chatWithTami(
        studentName,
        'I just opened the app. Greet me by name and tell me what I should work on today based on my DPM data.',
        []
      )
      const reply = res.reply || "Hey! I'm T.A.M.i, your AI music coach. What are we working on today?"
      setMessages([{ role: 'assistant', content: reply }])
      speakText(reply)
      if (res.updated_history) setHistory(res.updated_history)
      if (res.suggested_actions?.length) setSuggestedActions(res.suggested_actions)
    } catch (err) {
      console.error('T.A.M.i greeting error:', err)
      const fallback = `Yo ${studentName.split(' ')[0]}! What's good?`
      setMessages([{ role: 'assistant', content: fallback }])
      speakText(fallback)
    }
    setLoading(false)
  }

  const sendMessage = useCallback(async (overrideMsg) => {
    const userMsg = overrideMsg || input.trim()
    if (!userMsg || loading) return
    if (!overrideMsg) setInput('')

    // Stop any current speech when user sends a new message
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setSuggestedActions([])
    setLoading(true)
    try {
      const res = await api.chatWithTami(studentName, userMsg, history)
      const reply = res.reply || res.response || res.message || "I'm here to help!"
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      speakText(reply)
      if (res.updated_history) setHistory(res.updated_history)
      if (res.suggested_actions?.length) setSuggestedActions(res.suggested_actions)
    } catch (err) {
      console.error('T.A.M.i chat error:', err)
      const errMsg = "Sorry, I'm having trouble connecting right now. Try again in a moment!"
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }])
    }
    setLoading(false)
  }, [input, loading, history, studentName, speakText])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleVoice = () => {
    if (voiceEnabled && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setVoiceEnabled(prev => !prev)
  }

  const s = {
    fab: {
      position: 'fixed', bottom: 24, right: 24, width: 60, height: 60,
      borderRadius: '50%', border: '3px solid rgba(139,92,246,0.5)',
      cursor: 'pointer', zIndex: 9999,
      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(6,182,212,0.4)',
      transition: 'transform 0.2s', fontSize: 28, overflow: 'hidden', padding: 0
    },
    panel: {
      position: 'fixed', bottom: 96, right: 24, width: 360, maxHeight: 520,
      background: '#1f2937', borderRadius: 16, zIndex: 9998,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(6,182,212,0.3)', overflow: 'hidden'
    },
    header: {
      padding: '14px 16px',
      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex', alignItems: 'center', gap: 8
    },
    headerRight: {
      display: 'flex', alignItems: 'center', gap: 6
    },
    headerTitle: { color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 },
    voiceBtn: {
      background: 'rgba(255,255,255,0.2)', border: 'none',
      borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 4,
      color: '#fff', fontSize: 12, fontFamily: 'inherit',
      transition: 'background 0.2s'
    },
    voiceBtnOff: {
      background: 'rgba(0,0,0,0.3)', border: 'none',
      borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 4,
      color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'inherit',
      transition: 'background 0.2s'
    },
    closeBtn: {
      background: 'none', border: 'none', color: '#fff',
      fontSize: 20, cursor: 'pointer', padding: '0 4px'
    },
    body: {
      flex: 1, overflowY: 'auto', padding: 12,
      display: 'flex', flexDirection: 'column', gap: 8,
      maxHeight: 340, minHeight: 200
    },
    msgUser: {
      alignSelf: 'flex-end', background: 'rgba(6,182,212,0.2)',
      borderRadius: '12px 12px 4px 12px', padding: '8px 12px',
      color: '#e5e7eb', fontSize: 14, maxWidth: '80%', lineHeight: 1.5
    },
    msgBot: {
      alignSelf: 'flex-start', background: 'rgba(139,92,246,0.15)',
      borderRadius: '12px 12px 12px 4px', padding: '8px 12px',
      color: '#e5e7eb', fontSize: 14, maxWidth: '80%', lineHeight: 1.5
    },
    speakingIndicator: {
      display: 'inline-block', marginLeft: 6, width: 8, height: 8,
      borderRadius: '50%', background: '#34d399',
      animation: 'tami-pulse 1s ease-in-out infinite'
    },
    inputRow: {
      display: 'flex', padding: '8px 12px',
      borderTop: '1px solid rgba(255,255,255,0.1)', gap: 8,
      background: '#111827'
    },
    input: {
      flex: 1, background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 12px', color: '#fff',
      fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit'
    },
    sendBtn: {
      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
      border: 'none', borderRadius: 8, padding: '8px 14px',
      color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14
    },
    actionBtn: {
      padding: '5px 12px', borderRadius: 16,
      background: 'rgba(139,92,246,0.12)',
      border: '1px solid rgba(139,92,246,0.3)',
      color: '#a78bfa', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit'
    }
  }

  return (
    <>
      {/* Pulse animation for speaking indicator */}
      <style>{`
        @keyframes tami-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>

      {isOpen && (
        <div style={s.panel}>
          <div style={s.header}>
            <div style={s.headerLeft}>
              <img src="/tami-avatar.png" alt="T.A.M.i"
                style={{ width: 24, height: 24, borderRadius: '50%' }} />
              <span style={s.headerTitle}>
                T.A.M.i
                {isSpeaking && <span style={s.speakingIndicator} />}
              </span>
            </div>
            <div style={s.headerRight}>
              <div
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Voice On' : 'Voice Off'}
                style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: voiceEnabled ? '#00e676' : '#ff1744',
                  boxShadow: voiceEnabled
                    ? (isSpeaking ? '0 0 8px 4px rgba(0,230,118,0.7)' : '0 0 6px 2px rgba(0,230,118,0.4)')
                    : '0 0 6px 2px rgba(255,23,68,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: isSpeaking ? 'tami-pulse 1s infinite' : 'none',
                  marginRight: 8
                }}
              />
              <button style={s.closeBtn} onClick={() => setIsOpen(false)}>â</button>
            </div>
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
            {suggestedActions.length > 0 && !loading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {suggestedActions.map((action, i) => (
                  <button key={i} onClick={() => sendMessage(action)}
                    style={s.actionBtn}>{action}</button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={s.inputRow}>
            <textarea style={s.input} rows={1}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Ask T.A.M.i anything..." />
            <button style={s.sendBtn} onClick={() => sendMessage()}
              disabled={loading}>Send</button>
          </div>
        </div>
      )}

      <button style={s.fab}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with T.A.M.i"
      >
        {isOpen ? 'â' : (
          <img src="/tami-avatar.png" alt="T.A.M.i"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        )}
      </button>
    </>
  )
}
