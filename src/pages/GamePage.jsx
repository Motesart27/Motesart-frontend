import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"

const TEAL = "#14b8a6"
const CARD_BG = "rgba(255,255,255,0.03)"
const CARD_BORDER = "rgba(255,255,255,0.06)"
const TEXT_DIM = "rgba(255,255,255,0.4)"

const NOTES = ["C","D","E","F","G","A","B"]
const NOTE_FREQ = { C:261.63, D:293.66, E:329.63, F:349.23, G:392.00, A:440.00, B:493.88 }

export default function GamePage() {
  const { navigate } = useAuth()
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [round, setRound] = useState(0)
  const [target, setTarget] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioCtx = useRef(null)

  const playNote = (freq) => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    const ctx = audioCtx.current, osc = ctx.createOscillator(), gain = ctx.createGain()
    osc.type = "sine"; osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 1)
  }

  const startRound = () => {
    const note = NOTES[Math.floor(Math.random() * NOTES.length)]
    setTarget(note); setFeedback(null); setPlaying(true); setRound(r => r + 1)
    playNote(NOTE_FREQ[note])
  }

  const guess = (note) => {
    if (note === target) {
      setScore(s => s + 10 + streak * 2); setStreak(s => s + 1)
      setFeedback({ correct: true, msg: "Correct! 🎯" })
    } else {
      setStreak(0)
      setFeedback({ correct: false, msg: `It was ${target}` })
    }
    setPlaying(false)
  }

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff", padding:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:700 }}>🎮 Find the Note</h2>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:12, padding:14, textAlign:"center" }}>
          <p style={{ fontSize:22, fontWeight:800, color:TEAL }}>{score}</p>
          <p style={{ color:TEXT_DIM, fontSize:10 }}>Score</p>
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:12, padding:14, textAlign:"center" }}>
          <p style={{ fontSize:22, fontWeight:800, color:"#f97316" }}>{streak}🔥</p>
          <p style={{ color:TEXT_DIM, fontSize:10 }}>Streak</p>
        </div>
        <div style={{ background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:12, padding:14, textAlign:"center" }}>
          <p style={{ fontSize:22, fontWeight:800, color:"#a855f7" }}>{round}</p>
          <p style={{ color:TEXT_DIM, fontSize:10 }}>Round</p>
        </div>
      </div>

      {feedback && (
        <div style={{ background: feedback.correct ? "rgba(20,184,166,0.1)" : "rgba(239,68,68,0.1)", border:`1px solid ${feedback.correct ? "rgba(20,184,166,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius:12, padding:16, textAlign:"center", marginBottom:20 }}>
          <p style={{ fontSize:18, fontWeight:700, color: feedback.correct ? TEAL : "#ef4444" }}>{feedback.msg}</p>
        </div>
      )}

      {!playing ? (
        <button onClick={startRound}
          style={{ width:"100%", padding:18, background:`linear-gradient(135deg, ${TEAL}, #0d9488)`, border:"none", borderRadius:14, color:"#fff", fontSize:18, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 20px ${TEAL}40`, marginBottom:24 }}>
          {round === 0 ? "🎵 Start Game" : "🎵 Next Note"}
        </button>
      ) : (
        <>
          <p style={{ textAlign:"center", color:TEXT_DIM, fontSize:14, marginBottom:16 }}>What note did you hear?</p>
          <button onClick={() => target && playNote(NOTE_FREQ[target])}
            style={{ width:"100%", padding:12, background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:10, color:"#a855f7", fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:16 }}>
            🔊 Play Again
          </button>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8 }}>
            {NOTES.map(n => (
              <button key={n} onClick={() => guess(n)}
                style={{ padding:16, background:CARD_BG, border:`1px solid ${CARD_BORDER}`, borderRadius:12, color:"#fff", fontSize:18, fontWeight:700, cursor:"pointer" }}>
                {n}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
