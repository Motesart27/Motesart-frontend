import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

export default function TamiChat() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [hasGreeted, setHasGreeted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const messagesEndRef = useRef(null)

  const studentName = user?.name || user?.email?.split('@')[0] || 'Friend'

  // Load Puter.js for TTS
  useEffect(() => {
    if (!document.getElementById('puter-js')) {
      const s = document.createElement('script')
      s.id = 'puter-js'
      s.src = 'https://js.puter.com/v2/'
      document.head.appendChild(s)
    }
  }, [])

  // Listen for open-tami-chat event
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-tami-chat', handler)
    return () => window.removeEventListener('open-tami-chat', handler)
  }, [])

  // Inject pulse animation keyframes
  useEffect(() => {
    if (!document.getElementById('tami-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'tami-pulse-style'
      style.textContent = `
        @keyframes tamiPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 15px 5px rgba(139, 92, 246, 0.3); }
        }
        @keyframes tamiBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes tamiGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes tamiSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tamiDots {
          0%, 20% { opacity: 0.3; }
          50% { opacity: 1; }
          80%, 100% { opacity: 0.3; }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // Stop speech when chat closes
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Greeting on first open
  useEffect(() => {
    if (!isOpen || hasGreeted || !user) return
    const fetchGreeting = async () => {
      setHasGreeted(true)
      const firstName = studentName.split(' ')[0]
      // Show instant frontend greeting
      setMessages([{
        role: 'assistant',
        content: `Yo ${firstName}! What's good? I'm T.A.M.i, your music coach.`
      }])
      // Then get real greeting from backend
      try {
        const res = await api.chatWithTami(
          studentName,
          'I just opened the app. Greet me by name and tell me what I should work on today based on my DPM data.',
          []
        )
        const reply = res.reply || res.response || res.message
        if (reply) {
          setMessages([{ role: 'assistant', content: reply }])
          setHistory([
            { role: 'user', content: 'I just opened the app.' },
            { role: 'assistant', content: reply }
          ])
          if (autoPlay) speakText(reply)
        }
      } catch (err) {
        console.error('T.A.M.i greeting error:', err)
      }
    }
    fetchGreeting()
  }, [isOpen, hasGreeted, user])

  // Speak text with Puter.js (primary) or Web Speech API (fallback)
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !text) return
    const cleanText = text
      .replace(/[*_~`#]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim()
    if (!cleanText || cleanText.length > 3000) return
    setIsSpeaking(true)
    if (window.puter && window.puter.ai) {
      window.puter.ai.txt2speech(cleanText, {
        voice: 'Joanna', engine: 'neural', language: 'en-US'
      }).then(audio => {
        audio.onended = () => setIsSpeaking(false)
        audio.onerror = () => setIsSpeaking(false)
        audio.play().catch(() => setIsSpeaking(false))
      }).catch(() => setIsSpeaking(false))
    } else {
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance(cleanText)
      u.rate = 1.05
      u.pitch = 1.15
      u.onend = () => setIsSpeaking(false)
      u.onerror = () => setIsSpeaking(false)
      synth.speak(u)
    }
  }, [voiceEnabled])

  // Send message
  const sendMessage = useCallback(async (messageText) => {
    const userMsg = messageText || input.trim()
    if (!userMsg || loading) return
    setInput('')
    setLoading(true)

    const userMessage = { role: 'user', content: userMsg }
    setMessages(prev => [...prev, userMessage])

    try {
      const res = await api.chatWithTami(studentName, userMsg, history)
      const reply = res.reply || res.response || res.message
      if (reply) {
        const assistantMessage = { role: 'assistant', content: reply }
        setMessages(prev => [...prev, assistantMessage])
        setHistory(prev => [...prev, userMessage, assistantMessage])
        if (autoPlay) speakText(reply)
      }
    } catch (err) {
      console.error('T.A.M.i chat error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Try again in a sec!"
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, history, studentName, speakText, autoPlay])

  // Replay last assistant message
  const replayLastMessage = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
    if (lastAssistant) speakText(lastAssistant.content)
  }

  // Reset chat
  const resetChat = () => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setMessages([])
    setHistory([])
    setHasGreeted(false)
    setLoading(false)
  }

  // Quick actions
  const quickActions = [
    { label: 'How am I doing?', icon: '\u{1F4CA}' },
    { label: 'What should I practice?', icon: '\u{1F3B5}' },
    { label: 'Check my homework', icon: '\u{1F4DD}' }
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          animation: 'tamiPulse 2s infinite',
          zIndex: 9999,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        title="Chat with T.A.M.i"
      >
        {'\u{1F3B5}'}
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '380px',
      height: '560px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#0F0A1A',
      animation: 'tamiSlideUp 0.3s ease-out'
    }}>
      {/* HEADER - Gradient with avatar */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 50%, #F59E0B 100%)',
        padding: '16px 16px 20px',
        position: 'relative'
      }}>
        {/* Top row: close + controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >{'\u2715'}</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Replay button */}
            <button
              onClick={replayLastMessage}
              title="Replay last message"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                animation: isSpeaking ? 'tamiBounce 0.6s infinite' : 'none'
              }}
            >{isSpeaking ? '\u{1F50A}' : '\u{1F509}'}</button>
            {/* Reset button */}
            <button
              onClick={resetChat}
              title="Reset chat"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}
            >{'\u{1F504}'}</button>
          </div>
        </div>

        {/* Avatar + Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>{'\u{1F3B6}'}</div>
          <div>
            <div style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '-0.3px'
            }}>T.A.M.i</div>
            <div style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '13px',
              fontWeight: '500'
            }}>Fun Coach {'\u{1F3B5}'}</div>
          </div>
          {/* Voice status dot */}
          <div style={{
            marginLeft: 'auto',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: voiceEnabled ? '#4ADE80' : '#EF4444',
            boxShadow: voiceEnabled ? '0 0 8px rgba(74, 222, 128, 0.6)' : '0 0 8px rgba(239, 68, 68, 0.6)',
            animation: voiceEnabled ? 'tamiGlow 2s infinite' : 'none'
          }} title={voiceEnabled ? 'Voice ON' : 'Voice OFF'} />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      {messages.length <= 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 16px',
          background: '#130E22',
          overflowX: 'auto'
        }}>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action.label)}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#C4B5FD',
                padding: '8px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))'
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'
                e.target.style.color = '#E9D5FF'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))'
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                e.target.style.color = '#C4B5FD'
              }}
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* MESSAGES */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#0F0A1A'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'tamiSlideUp 0.3s ease-out'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                marginRight: '8px',
                flexShrink: 0,
                marginTop: '2px'
              }}>{'\u{1F3B6}'}</div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user'
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                : 'rgba(255, 255, 255, 0.08)',
              color: msg.role === 'user' ? 'white' : '#E2E8F0',
              fontSize: '14px',
              lineHeight: '1.5',
              wordBreak: 'break-word'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'tamiSlideUp 0.3s ease-out'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0
            }}>{'\u{1F3B6}'}</div>
            <div style={{
              padding: '10px 16px',
              borderRadius: '16px 16px 16px 4px',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '4px'
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#8B5CF6',
                  animation: `tamiDots 1.4s infinite ${j * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER - Audio toggle + Input */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: '#130E22'
      }}>
        {/* Audio auto-play toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              background: 'none',
              border: 'none',
              color: autoPlay ? '#A78BFA' : '#64748B',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 0',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
          >
            {autoPlay ? '\u{1F50A}' : '\u{1F507}'} Audio auto-play {autoPlay ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled)
              if (voiceEnabled) {
                window.speechSynthesis?.cancel()
                setIsSpeaking(false)
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '2px 0',
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
          </button>
        </div>

        {/* Input area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px'
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask T.A.M.i anything..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '24px',
              padding: '10px 16px',
              color: '#E2E8F0',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: loading || !input.trim()
                ? 'rgba(139, 92, 246, 0.2)'
                : 'linear-gradient(135deg, #7C3AED, #DB2777)',
              border: 'none',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: 'white',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {loading ? '\u23F3' : '\u{1F3B5}'}
          </button>
        </div>
      </div>
    </div>
  )
}
