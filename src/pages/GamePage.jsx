import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── NOTE DATA ───────────────────────────────────────────────────────────────
const NOTE_FREQS = [
  261.63,293.66,329.63,349.23,392.00,440.00,493.88,
  523.25,587.33,659.25,698.46,783.99,880.00,987.77,
  1046.50,1174.66,1318.51,1396.91,
]
const NOTE_NAMES = ['C','D','E','F','G','A','B','C','D','E','F','G','A','B','C','D','E','F']

// C Major scale: 8 notes, real treble clef vertical positions (px from top of 130px staff area)
// Lines: E4=88, G4=72, B4=56, D5=40, F5=24
// Spaces: F4=80, A4=64, C5=48, E5=32
// C4 = 96 (below staff, ledger line at 104)
const SCALE_NOTES = [
  { name:'C', freq:261.63, top:96,  hasLedger:true  },
  { name:'D', freq:293.66, top:88,  hasLedger:false },
  { name:'E', freq:329.63, top:81,  hasLedger:false },
  { name:'F', freq:349.23, top:73,  hasLedger:false },
  { name:'G', freq:392.00, top:65,  hasLedger:false },
  { name:'A', freq:440.00, top:57,  hasLedger:false },
  { name:'B', freq:493.88, top:49,  hasLedger:false },
  { name:'C', freq:523.25, top:41,  hasLedger:false },
]

// ─── LEVEL HELPERS ───────────────────────────────────────────────────────────
function getOctaves(level) {
  if (level <= 3) return 1
  if (level <= 9) return 2
  return 3
}
function getNoteCount(level) { return level }
function getMaxReplays(level) {
  if (level <= 3) return 2
  if (level <= 12) return 3
  return 4
}
function getOctaveLabel(level) {
  const o = getOctaves(level)
  return o === 1 ? 'One octave' : o === 2 ? 'Two octaves' : 'Three octaves'
}

// Piano keys per octave count — numbers cycle 1-8, 2-8, 2-8
function getPianoKeys(level) {
  const oct = getOctaves(level)
  const keys = []
  for (let o = 0; o < oct; o++) {
    for (let n = 0; n < 7; n++) {
      const globalIdx = o * 7 + n
      // number: first octave = 1-7, octave start C = 8, then repeats 2-8
      let num
      if (o === 0) num = n + 1          // 1–7
      else num = n === 0 ? 8 : n + 1   // octave C = 8, then D=2,E=3...
      keys.push({ num, name: NOTE_NAMES[globalIdx], freq: NOTE_FREQS[globalIdx], idx: globalIdx, isOctaveC: n === 0 && o > 0 })
    }
    // final C of each octave
    const finalIdx = o * 7 + 7
    keys.push({ num: 8, name: 'C', freq: NOTE_FREQS[finalIdx], idx: finalIdx, isOctaveC: true })
  }
  return keys
}

// Black key layout — 5 per octave, repeated
function BlackKeys({ octaves }) {
  const groups = []
  for (let o = 0; o < octaves; o++) {
    groups.push(
      <div key={o} style={{display:'flex',flex:8,position:'relative'}}>
        <div style={{flex:1}}/>
        <div className="gp-bkey"/>
        <div style={{flex:.6}}/>
        <div className="gp-bkey"/>
        <div style={{flex:1.4}}/>
        <div className="gp-bkey"/>
        <div style={{flex:.6}}/>
        <div className="gp-bkey"/>
        <div style={{flex:.6}}/>
        <div className="gp-bkey"/>
        <div style={{flex:1}}/>
      </div>
    )
  }
  return (
    <div className="gp-bkeys">
      {groups}
    </div>
  )
}

// ─── STREAK CONFIG ────────────────────────────────────────────────────────────
function getStreakStyle(streak) {
  if (streak === 0) return { border:'#374151', bg:'rgba(55,65,81,.2)', color:'#6b7280', label:'', emoji:'' }
  if (streak < 3)   return { border:'#f97316', bg:'rgba(249,115,22,.1)', color:'#fb923c', label:'Warming Up', emoji:'🔥' }
  if (streak < 5)   return { border:'#f97316', bg:'rgba(249,115,22,.12)', color:'#fb923c', label:'Warming Up!', emoji:'🔥' }
  if (streak < 10)  return { border:'#ef4444', bg:'rgba(239,68,68,.15)', color:'#fbbf24', label:'ON FIRE!', emoji:'🔥' }
  if (streak < 15)  return { border:'#fbbf24', bg:'rgba(251,191,36,.2)', color:'#fbbf24', label:'INFERNO!', emoji:'🌋' }
  return              { border:'#a855f7', bg:'rgba(168,85,247,.2)', color:'#e879f9', label:'LEGENDARY!', emoji:'⚡' }
}

// ─── AUDIO ────────────────────────────────────────────────────────────────────
let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}
function playTone(freq, dur = 0.5) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur)
  } catch(e) {}
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
.gp{min-height:100vh;background:linear-gradient(180deg,#0f172a,#1e293b);color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;flex-direction:column}
.gp-top{padding:8px 12px;background:rgba(15,23,42,.98);border-bottom:2px solid rgba(59,130,246,.3);backdrop-filter:blur(8px);position:sticky;top:0;z-index:10}
.gp-top-inner{max-width:1024px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}
.gp-pill-pts{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:700;border:1px solid rgba(234,179,8,.3);background:linear-gradient(135deg,rgba(234,179,8,.2),rgba(234,179,8,.1));color:#fbbf24}
.gp-lives{display:flex;gap:2px;font-size:16px}
.gp-bpm{background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;border:none;border-radius:9999px;padding:4px 10px;font-size:12px;font-weight:700}
.gp-streak-ring{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;border:2px solid;position:relative;transition:all .3s}
.gp-streak-ring.animated{animation:streakPulse 1s infinite}
@keyframes streakPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.85;transform:scale(1.05)}}
.gp-streak-emoji{font-size:11px;position:absolute;top:-8px}
.gp-streak-label{font-size:9px;font-weight:700;margin-top:3px;letter-spacing:.5px}
.gp-prog-wrap{display:flex;align-items:center;gap:6px}
.gp-prog-bar{width:64px;height:10px;background:#374151;border-radius:9999px;overflow:hidden;border:1px solid #4b5563}
.gp-prog-fill{height:100%;background:linear-gradient(90deg,#3b82f6,#a855f7);border-radius:9999px}
.gp-mid{padding:16px;display:flex;flex-direction:column;align-items:center;gap:16px}

/* ── TREBLE STAFF ── */
.gp-staff-wrap{width:100%;max-width:640px;background:rgba(30,41,59,.8);border:2px solid rgba(100,116,139,.4);border-radius:12px;padding:16px 12px 10px}
.gp-staff-outer{position:relative;height:130px}
.gp-staff-line{position:absolute;left:52px;right:8px;height:2px;background:rgba(148,163,184,.5);border-radius:1px}
.gp-ledger{position:absolute;height:2px;background:rgba(148,163,184,.5);border-radius:1px;width:26px}
.gp-clef{position:absolute;left:2px;top:6px;font-size:76px;line-height:1;opacity:.72;color:#94a3b8;user-select:none}
.gp-nh{position:absolute;width:16px;height:11px;border-radius:50%;transform:rotate(-18deg);transition:background .12s,box-shadow .12s,border-color .12s}
.gp-nh-idle{background:rgba(100,116,139,.2);border:2px solid rgba(100,116,139,.35)}
.gp-nh-lit{background:#3b82f6;border:2px solid #93c5fd;box-shadow:0 0 18px rgba(59,130,246,1),0 0 36px rgba(59,130,246,.5)}
.gp-nh-correct{background:#22c55e;border:2px solid #86efac;box-shadow:0 0 18px rgba(34,197,94,1)}
.gp-nh-wrong{background:#ef4444;border:2px solid #fca5a5;box-shadow:0 0 18px rgba(239,68,68,1)}
.gp-stem{position:absolute;width:2px;border-radius:1px;background:rgba(100,116,139,.35)}
.gp-stem-lit{background:#93c5fd}
.gp-stem-correct{background:#86efac}
.gp-note-lbl{position:absolute;font-size:9px;font-weight:700;top:113px;color:#475569;text-align:center;width:16px;pointer-events:none}
.gp-note-lbl-lit{color:#60a5fa}
.gp-staff-hint{font-size:10px;color:#475569;text-align:center;padding-top:4px}

.gp-title h1{font-size:24px;font-weight:700;font-family:Georgia,serif;background:linear-gradient(135deg,#e2e8f0,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gp-info{width:28px;height:28px;border-radius:50%;background:rgba(59,130,246,.2);border:1px solid rgba(59,130,246,.4);color:#60a5fa;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;font-weight:700}
.gp-action-row{display:flex;gap:8px;width:100%;max-width:384px}
.gp-abtn{flex:1;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:.2s}
.gp-abtn:hover{transform:scale(.98)}
.gp-abtn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.gp-abtn-scale{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;box-shadow:0 4px 12px rgba(239,68,68,.3)}
.gp-abtn-find{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;box-shadow:0 4px 12px rgba(34,197,94,.3)}
.gp-abtn-find.depleted{background:linear-gradient(135deg,#4b5563,#374151);box-shadow:none}
.gp-mode-row{display:flex;gap:8px;width:100%;max-width:384px}
.gp-mbtn{flex:1;padding:8px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:.2s}
.gp-mbtn-off{background:rgba(55,65,81,.8);color:#9ca3af}
.gp-mbtn-game{background:#9333ea;color:#fff;box-shadow:0 2px 8px rgba(147,51,234,.3)}
.gp-mbtn-academic{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;box-shadow:0 2px 8px rgba(14,165,233,.3)}
.gp-dpm-bar{width:100%;max-width:384px;background:rgba(30,41,59,.8);border:1px solid rgba(14,165,233,.3);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px}

/* ── KEYBOARD ── */
.gp-kb{flex:1;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.gp-lvl-badge{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border-radius:10px;padding:8px 14px;text-align:center;box-shadow:0 4px 12px rgba(37,99,235,.3)}
.gp-lvl-num{font-size:24px;font-weight:900}
.gp-lvl-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.gp-piano-wrap{width:100%;max-width:960px;padding:0 4px}
.gp-piano{display:flex;position:relative;height:140px;background:linear-gradient(180deg,#1e293b,#0f172a);border-radius:0 0 8px 8px;border:2px solid #334155;border-top:4px solid #475569;overflow:hidden}
.gp-wkey{flex:1;background:linear-gradient(180deg,#e2e8f0,#f8fafc);border-left:1px solid #cbd5e1;border-right:1px solid #cbd5e1;border-bottom:3px solid #94a3b8;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:6px;cursor:pointer;transition:all .1s;position:relative;z-index:1;border-radius:0 0 4px 4px;min-width:0}
.gp-wkey:hover{background:linear-gradient(180deg,#dbeafe,#eff6ff)}
.gp-wkey.pressed{background:linear-gradient(180deg,#93c5fd,#bfdbfe);border-bottom-color:#3b82f6;transform:translateY(2px)}
.gp-wkey.octave-c{background:linear-gradient(180deg,#dbeafe,#bfdbfe)}
.gp-wkey.octave-c:hover{background:linear-gradient(180deg,#bfdbfe,#93c5fd)}
.gp-wkey-label{font-size:10px;font-weight:700;color:#475569;pointer-events:none}
.gp-wkey-label.octave-c-label{color:#1d4ed8}
.gp-wkey-num{font-size:10px;color:#94a3b8;pointer-events:none;font-weight:700}
.gp-wkey-num.octave-c-num{color:#2563eb;font-weight:900}
.gp-bkeys{position:absolute;top:0;left:0;right:0;height:85px;display:flex;pointer-events:none;z-index:2}
.gp-bkey{width:8%;max-width:44px;background:linear-gradient(180deg,#1e293b,#0f172a);border:1px solid #334155;border-radius:0 0 4px 4px;pointer-events:auto;cursor:pointer;margin-left:-4%;margin-right:-4%;box-shadow:0 4px 8px rgba(0,0,0,.5);z-index:3}
.gp-answer{background:rgba(30,41,59,.8);border:1px solid rgba(59,130,246,.3);border-radius:8px;padding:6px 16px;display:flex;align-items:center;gap:8px}

/* ── FOOTER ── */
.gp-footer{padding:8px 12px;border-top:1px solid #1e293b;background:rgba(15,23,42,.95);display:flex;justify-content:center;gap:8px}
.gp-fbtn{padding:6px 16px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer}
.gp-fbtn-dash{background:linear-gradient(135deg,#a855f7,#3b82f6);color:#fff}
.gp-fbtn-gray{background:#4b5563;color:#fff}

/* ── MODALS ── */
.gp-modal-bg{display:none;position:fixed;inset:0;z-index:50;align-items:center;justify-content:center;padding:16px}
.gp-modal-bg.show{display:flex}
.gp-modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px)}
.gp-modal{position:relative;border-radius:16px;width:100%;max-height:90vh;overflow-y:auto}
.gp-htp{background:#1e293b;border:1px solid #334155;max-width:448px;padding:24px;color:#e2e8f0}
.gp-htp-step{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
.gp-htp-badge{width:28px;height:28px;border-radius:6px;background:#334155;color:#e2e8f0;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.gp-go-modal{background:#1e293b;border:1px solid #334155;max-width:440px;padding:28px;text-align:center}
.gp-go-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.gp-go-stat{background:rgba(31,41,55,.5);border:1px solid rgba(55,65,81,.5);border-radius:10px;padding:12px;text-align:center}
.gp-go-actions{display:flex;gap:8px;margin-top:4px}
.gp-go-restart{flex:1;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#14b8a6,#06b6d4);color:#fff;font-weight:700;font-size:14px;cursor:pointer}
.gp-go-summary{flex:1;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-weight:700;font-size:14px;cursor:pointer}
.gp-ear-meter{background:rgba(14,165,233,.08);border:1px solid rgba(14,165,233,.3);border-radius:12px;padding:14px;margin-bottom:14px}
.gp-ear-row{display:flex;align-items:center;gap:8px;margin-bottom:7px}
.gp-ear-label{font-size:11px;color:#64748b;width:110px;flex-shrink:0}
.gp-ear-bar-wrap{flex:1;height:7px;background:#0f172a;border-radius:9999px;overflow:hidden}
.gp-ear-bar-fill{height:100%;border-radius:9999px}
.gp-ear-score{font-size:11px;font-weight:700;width:32px;text-align:right;flex-shrink:0}
.gp-tami-card{background:linear-gradient(135deg,rgba(20,184,166,.08),rgba(6,182,212,.08));border:1px solid rgba(20,184,166,.3);border-radius:12px;padding:14px;margin-bottom:14px}
.gp-tami-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#14b8a6,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;flex-shrink:0}
.gp-tami-tag{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;margin:2px}

/* ── STREAK MILESTONE TOAST ── */
.gp-toast{position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-20px);z-index:100;border-radius:12px;padding:10px 20px;font-size:14px;font-weight:700;display:flex;align-items:center;gap:10px;opacity:0;transition:all .4s;pointer-events:none;white-space:nowrap}
.gp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
`

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function GamePage() {
  const navigate = useNavigate()
  const LEVEL = 1 // wire from context/props
  const keys = getPianoKeys(LEVEL)
  const noteCount = getNoteCount(LEVEL)
  const maxReplays = getMaxReplays(LEVEL)
  const octaveLabel = getOctaveLabel(LEVEL)

  const [answers, setAnswers]       = useState([])
  const [litNote, setLitNote]       = useState(null)   // single index 0-7 or null
  const [noteStates, setNoteStates] = useState({})     // {idx: 'correct'|'wrong'}
  const [pressed, setPressed]       = useState(null)
  const [showHtp, setShowHtp]       = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [replaysLeft, setReplaysLeft]   = useState(maxReplays)
  const [mystery, setMystery]       = useState([])
  const [mode, setMode]             = useState('game')
  const [isPlaying, setIsPlaying]   = useState(false)
  const [streak, setStreak]         = useState(7)
  const [toast, setToast]           = useState(null)
  const playingRef = useRef(false)

  // Game session stats for TAMi/WYL
  const sessionRef = useRef({
    correct: 0, attempts: 0, noteErrors: {}, replaysUsed: 0,
    startTime: Date.now(), bestStreak: 0, currentStreak: 0,
  })

  // Generate mystery sequence on mount
  useEffect(() => {
    const seq = Array.from({ length: noteCount }, () =>
      Math.floor(Math.random() * 8)
    )
    setMystery(seq)
  }, [LEVEL, noteCount])

  // Play a sequence with one note lit at a time
  const playSequence = useCallback((noteIndices, onDone) => {
    if (playingRef.current) return
    playingRef.current = true
    setIsPlaying(true)
    setLitNote(null)
    let i = 0
    const step = () => {
      if (i >= noteIndices.length) {
        setLitNote(null)
        playingRef.current = false
        setIsPlaying(false)
        onDone && onDone()
        return
      }
      const ni = noteIndices[i]
      setLitNote(ni)
      playTone(SCALE_NOTES[ni].freq, 0.5)
      i++
      setTimeout(step, 620)
    }
    step()
  }, [])

  // Play Scale — all 8 notes in order
  const playScale = () => {
    playSequence([0,1,2,3,4,5,6,7])
  }

  // Find Note — play mystery sequence, decrement replays
  const findNote = () => {
    if (replaysLeft <= 0 || !mystery.length || isPlaying) return
    setReplaysLeft(r => r - 1)
    sessionRef.current.replaysUsed++
    playSequence(mystery)
  }

  // Show streak toast
  const showToast = (msg, color, bg, border) => {
    setToast({ msg, color, bg, border })
    setTimeout(() => setToast(null), 2000)
  }

  // Key press handler
  const pressKey = useCallback((noteIdx, keyPos) => {
    if (isPlaying) return
    setPressed(keyPos)
    setTimeout(() => setPressed(null), 180)
    playTone(NOTE_FREQS[noteIdx], 0.4)

    const next = [...answers, noteIdx % 8]
    setAnswers(next)

    if (next.length >= noteCount) {
      sessionRef.current.attempts++
      const allCorrect = next.every((n, i) => n === mystery[i])
      const newStates = {}
      next.forEach((n, i) => {
        newStates[i] = n === mystery[i] ? 'correct' : 'wrong'
        if (n !== mystery[i]) {
          sessionRef.current.noteErrors[SCALE_NOTES[mystery[i]].name] =
            (sessionRef.current.noteErrors[SCALE_NOTES[mystery[i]].name] || 0) + 1
        }
      })
      setNoteStates(newStates)

      if (allCorrect) {
        sessionRef.current.correct++
        const newStreak = sessionRef.current.currentStreak + 1
        sessionRef.current.currentStreak = newStreak
        sessionRef.current.bestStreak = Math.max(sessionRef.current.bestStreak, newStreak)
        setStreak(newStreak)
        // Milestone toasts
        if (newStreak === 3)  showToast('🔥 TRIPLE! +50 pts', '#fb923c', 'rgba(249,115,22,.15)', 'rgba(249,115,22,.4)')
        if (newStreak === 5)  showToast('🔥 ON FIRE! Life recovered! ❤️', '#ef4444', 'rgba(239,68,68,.15)', 'rgba(239,68,68,.4)')
        if (newStreak === 10) showToast('🌋 INFERNO! x2 multiplier!', '#fbbf24', 'rgba(251,191,36,.12)', 'rgba(251,191,36,.4)')
        if (newStreak === 15) showToast('⚡ LEGENDARY! TAMi is impressed!', '#e879f9', 'rgba(168,85,247,.15)', 'rgba(168,85,247,.5)')
      } else {
        sessionRef.current.currentStreak = 0
        setStreak(0)
      }

      setTimeout(() => {
        setAnswers([])
        setNoteStates({})
        if (allCorrect) {
          const seq = Array.from({ length: noteCount }, () => Math.floor(Math.random() * 8))
          setMystery(seq)
          setReplaysLeft(maxReplays)
        }
      }, 1600)
    }
  }, [answers, isPlaying, mystery, noteCount, maxReplays, LEVEL])

  const streakStyle = getStreakStyle(streak)

  // Ear training stats (derived from session)
  const s = sessionRef.current
  const accuracy = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0

  return (
    <div className="gp"><style>{css}</style>

      {/* ── STREAK TOAST ── */}
      {toast && (
        <div className="gp-toast show" style={{background:toast.bg, border:`1px solid ${toast.border}`, color:toast.color}}>
          {toast.msg}
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div className="gp-top"><div className="gp-top-inner">
        <div className="gp-pill-pts">💰 1,250</div>

        {mode === 'game'
          ? <div className="gp-lives">❤️❤️🖤</div>
          : <div style={{fontSize:11,color:'#0ea5e9',fontWeight:700}}>📚 Academic</div>
        }

        <div className="gp-bpm">120 BPM</div>

        {/* Streak ring */}
        <div style={{textAlign:'center'}}>
          <div
            className={`gp-streak-ring ${streak > 0 ? 'animated' : ''}`}
            style={{borderColor:streakStyle.border, background:streakStyle.bg, color:streakStyle.color}}
          >
            {streakStyle.emoji && <span className="gp-streak-emoji">{streakStyle.emoji}</span>}
            <span style={{fontSize:17,fontWeight:900}}>{streak}</span>
            <span style={{fontSize:7,fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Streak</span>
          </div>
          {streakStyle.label && <div className="gp-streak-label" style={{color:streakStyle.color}}>{streakStyle.label}</div>}
        </div>

        <div className="gp-prog-wrap">
          <span style={{fontSize:9,color:'#6b7280'}}>Progress</span>
          <div className="gp-prog-bar"><div className="gp-prog-fill" style={{width:'60%'}}/></div>
          <span style={{fontSize:12,fontWeight:700,color:'#d1d5db'}}>60%</span>
        </div>
      </div></div>

      {/* ── MID ── */}
      <div className="gp-mid">

        {/* TREBLE STAFF */}
        <div className="gp-staff-wrap">
          <div className="gp-staff-outer">
            {/* Treble clef */}
            <div className="gp-clef">𝄞</div>

            {/* 5 staff lines — bottom to top: E4, G4, B4, D5, F5 */}
            <div className="gp-staff-line" style={{top:88}}/>
            <div className="gp-staff-line" style={{top:72}}/>
            <div className="gp-staff-line" style={{top:56}}/>
            <div className="gp-staff-line" style={{top:40}}/>
            <div className="gp-staff-line" style={{top:24}}/>

            {/* 8 C Major notes spread evenly across staff */}
            {SCALE_NOTES.map((note, i) => {
              const left = 60 + i * 54
              const isLit = litNote === i
              const state = noteStates[i]
              const nhClass = state === 'correct' ? 'gp-nh gp-nh-correct'
                            : state === 'wrong'   ? 'gp-nh gp-nh-wrong'
                            : isLit               ? 'gp-nh gp-nh-lit'
                            :                       'gp-nh gp-nh-idle'
              const stemClass = isLit ? 'gp-stem gp-stem-lit' : state === 'correct' ? 'gp-stem gp-stem-correct' : 'gp-stem'

              return (
                <div key={i}>
                  {/* Ledger line for C4 */}
                  {note.hasLedger && (
                    <div className="gp-ledger" style={{top: note.top + 6, left: left - 5}}/>
                  )}
                  {/* Notehead */}
                  <div className={nhClass} style={{left, top: note.top}}>
                    {/* Stem — up from right of notehead */}
                    <div className={stemClass} style={{left:14, bottom:9, height: Math.max(18, 110 - note.top - 18)}}/>
                  </div>
                  {/* Note name below staff */}
                  <div className={`gp-note-lbl ${isLit ? 'gp-note-lbl-lit' : ''}`} style={{left}}>{note.name}</div>
                </div>
              )
            })}
          </div>
          <div className="gp-staff-hint">C Major Scale · One note lights as it plays · Find Note does not reveal the answer</div>
        </div>

        {/* Title */}
        <div className="gp-title" style={{textAlign:'center'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <h1>Find the Note</h1>
            <button className="gp-info" onClick={()=>setShowHtp(true)}>ⓘ</button>
          </div>
          <div style={{fontSize:13,color:'#64748b',marginTop:4}}>
            Level {LEVEL} · {octaveLabel} · {noteCount} {noteCount===1?'note':'notes'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="gp-action-row">
          <button className="gp-abtn gp-abtn-scale" onClick={playScale} disabled={isPlaying}>
            🎵 Play Scale
          </button>
          <button
            className={`gp-abtn gp-abtn-find ${replaysLeft<=0?'depleted':''}`}
            onClick={findNote}
            disabled={isPlaying || replaysLeft<=0}
          >
            ▶ Find Note ({replaysLeft})
          </button>
        </div>

        {/* Mode toggle */}
        <div className="gp-mode-row">
          <button
            className={`gp-mbtn ${mode==='academic'?'gp-mbtn-academic':'gp-mbtn-off'}`}
            onClick={()=>setMode('academic')}
          >🎓 Academic</button>
          <button
            className={`gp-mbtn ${mode==='game'?'gp-mbtn-game':'gp-mbtn-off'}`}
            onClick={()=>setMode('game')}
          >🎮 Game</button>
        </div>

        {mode==='game' && (
          <div style={{fontSize:11,color:'#22c55e',fontWeight:600}}>💚 3 more correct for life recovery!</div>
        )}
        {mode==='academic' && (
          <div className="gp-dpm-bar">
            <span style={{fontSize:18}}>📈</span>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0ea5e9'}}>DPM Tracking</div>
              <div style={{fontSize:10,color:'#64748b'}}>Extra practice beyond homework raises your DPM</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:'#38bdf8'}}>+12 DPM</div>
          </div>
        )}
      </div>

      {/* ── KEYBOARD ── */}
      <div className="gp-kb">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="gp-lvl-badge">
            <div className="gp-lvl-num">{LEVEL}</div>
            <div className="gp-lvl-lbl">Level</div>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>C Major Scale</div>
            <div style={{fontSize:11,color:'#64748b'}}>Tap the keys to answer</div>
          </div>
        </div>

        <div className="gp-piano-wrap"><div className="gp-piano">
          {keys.map((k,i) => (
            <div
              key={i}
              className={`gp-wkey ${pressed===i?'pressed':''} ${k.isOctaveC?'octave-c':''}`}
              onClick={()=>pressKey(k.idx, i)}
            >
              <span className={`gp-wkey-num ${k.isOctaveC?'octave-c-num':''}`}>{k.num}</span>
              <span className={`gp-wkey-label ${k.isOctaveC?'octave-c-label':''}`}>{k.name}</span>
            </div>
          ))}
          <BlackKeys octaves={getOctaves(LEVEL)} />
        </div></div>

        {answers.length > 0 && (
          <div className="gp-answer">
            <span style={{fontSize:12,fontWeight:600,color:'#60a5fa'}}>Your answer:</span>
            <span style={{fontSize:15,fontFamily:'monospace',fontWeight:700,color:'#93c5fd'}}>
              {answers.map(i => SCALE_NOTES[i % 8].name).join(' → ')}
            </span>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="gp-footer">
        <button className="gp-fbtn gp-fbtn-dash" onClick={()=>navigate('/')}>📊 Dashboard</button>
        <button className="gp-fbtn gp-fbtn-gray" onClick={()=>{setAnswers([]);setNoteStates({});setLitNote(null);setReplaysLeft(maxReplays)}}>Reset</button>
        <button className="gp-fbtn gp-fbtn-gray" onClick={()=>setShowGameOver(true)}>Game Over</button>
      </div>

      {/* ── HOW TO PLAY MODAL ── */}
      <div className={`gp-modal-bg ${showHtp?'show':''}`}>
        <div className="gp-modal-backdrop" onClick={()=>setShowHtp(false)}/>
        <div className="gp-modal gp-htp">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h2 style={{fontSize:22,fontWeight:700}}>🎵 How to Play</h2>
            <button style={{background:'none',border:'none',color:'#6b7280',fontSize:22,cursor:'pointer'}} onClick={()=>setShowHtp(false)}>✕</button>
          </div>
          <div style={{padding:16,borderRadius:12,border:'1px solid rgba(59,130,246,.3)',background:'rgba(59,130,246,.1)',marginBottom:16}}>
            <h3 style={{fontWeight:700,marginBottom:8,fontSize:14,color:'#60a5fa'}}>🎯 Goal</h3>
            <p style={{fontSize:13,color:'#cbd5e1',lineHeight:1.6,margin:0}}>Listen to the notes and tap them on the piano keyboard in the correct order!</p>
          </div>
          {[['1','Play Scale','Listen to the C Major scale to tune your ear. Watch the notes light up on the staff!'],
            ['2','Find Note','Listen to the mystery notes. You cannot see which notes play — use your ear!'],
            ['3','Tap the Answer','Tap the piano keys in the same order you heard them.'],
          ].map(([n,t,s])=>(
            <div key={n} className="gp-htp-step">
              <div className="gp-htp-badge">{n}</div>
              <div><p style={{fontWeight:600,fontSize:14,margin:'0 0 2px'}}>{t}</p><p style={{fontSize:12,color:'#94a3b8',margin:0,lineHeight:1.5}}>{s}</p></div>
            </div>
          ))}
          <div style={{padding:14,borderRadius:12,border:'1px solid rgba(168,85,247,.3)',background:'rgba(168,85,247,.1)',margin:'14px 0 12px'}}>
            <h3 style={{fontWeight:700,marginBottom:10,fontSize:14,color:'#c084fc'}}>💡 Tips</h3>
            {['Get 4+ in a row to recover a life!','Streaks of 5 earn bonus replays','Higher levels = more notes & more octaves'].map(tip=>(
              <div key={tip} style={{display:'flex',gap:8,marginBottom:6}}>
                <span style={{color:'#c084fc'}}>•</span>
                <span style={{fontSize:13,color:'#c084fc',lineHeight:1.4}}>{tip}</span>
              </div>
            ))}
          </div>
          <div style={{padding:14,borderRadius:12,border:'1px solid rgba(239,68,68,.3)',background:'rgba(239,68,68,.08)',marginBottom:12}}>
            <h3 style={{fontWeight:700,marginBottom:8,fontSize:14,color:'#f87171'}}>❤️ Lives</h3>
            <p style={{fontSize:13,color:'#fca5a5',margin:0,lineHeight:1.5}}>You start with 3 lives. Wrong answers cost 1 life. Game over at 0 lives! Extra lives (up to 6) only available if you've earned them.</p>
          </div>
          <div style={{padding:14,borderRadius:12,border:'1px solid rgba(34,197,94,.3)',background:'rgba(34,197,94,.08)',marginBottom:16}}>
            <h3 style={{fontWeight:700,marginBottom:8,fontSize:14,color:'#4ade80'}}>🔁 Replays (Level {LEVEL})</h3>
            <p style={{fontSize:13,color:'#86efac',margin:0}}>You have <strong>{maxReplays}</strong> replays per round.</p>
            <p style={{fontSize:11,color:'#64748b',marginTop:4,marginBottom:0}}>L1–3: 2 replays · L4–12: 3 replays · L13–18: 4 replays</p>
          </div>
          <button style={{width:'100%',padding:14,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',background:'linear-gradient(135deg,#3b82f6,#a855f7)',color:'#fff'}} onClick={()=>setShowHtp(false)}>
            Got it! Let's Play 🎹
          </button>
        </div>
      </div>

      {/* ── GAME OVER MODAL ── */}
      <div className={`gp-modal-bg ${showGameOver?'show':''}`}>
        <div className="gp-modal-backdrop" onClick={()=>setShowGameOver(false)}/>
        <div className="gp-modal gp-go-modal">
          <div style={{fontSize:44,marginBottom:4}}>💀</div>
          <div style={{fontSize:26,fontWeight:900}}>Game Over!</div>
          <div style={{fontSize:13,color:'#9ca3af',marginBottom:16}}>Level {LEVEL} · Session Complete</div>

          <div className="gp-go-stats">
            {[[s.correct,'Correct','#4ade80'],[s.attempts,'Attempts','#c084fc'],
              [accuracy+'%','Accuracy','#fb923c'],[s.bestStreak,'Best Streak','#22d3ee']
            ].map(([v,l,c])=>(
              <div key={l} className="gp-go-stat">
                <div style={{fontSize:20,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:11,color:'#6b7280',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Ear Training Meter */}
          <div className="gp-ear-meter">
            <div style={{fontSize:14,fontWeight:700,color:'#0ea5e9',marginBottom:12}}>👂 Ear Training Meter</div>
            {[
              ['Pitch Accuracy', Math.min(accuracy+7,100), 'linear-gradient(90deg,#22c55e,#4ade80)', '#4ade80'],
              ['Note Memory',    Math.max(accuracy-10,0),  'linear-gradient(90deg,#3b82f6,#60a5fa)', '#60a5fa'],
              ['Sequence Order', Math.max(accuracy-20,0),  'linear-gradient(90deg,#f97316,#fb923c)', '#fb923c'],
              ['Speed',          Math.min(accuracy+15,100),'linear-gradient(90deg,#a855f7,#c084fc)', '#c084fc'],
              ['Replay Efficiency', Math.max(accuracy-5,0),'linear-gradient(90deg,#14b8a6,#2dd4bf)', '#2dd4bf'],
            ].map(([label,val,grad,col])=>(
              <div key={label} className="gp-ear-row">
                <div className="gp-ear-label">{label}</div>
                <div className="gp-ear-bar-wrap"><div className="gp-ear-bar-fill" style={{width:val+'%',background:grad}}/></div>
                <div className="gp-ear-score" style={{color:col}}>{val}%</div>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12,paddingTop:12,borderTop:'1px solid #334155'}}>
              <div style={{fontSize:12,color:'#64748b'}}>Overall Ear Score</div>
              <div style={{fontSize:20,fontWeight:900,color:'#fbbf24'}}>{accuracy} <span style={{fontSize:12,color:'#64748b'}}>/ 100</span></div>
            </div>
          </div>

          {/* TAMi insight */}
          <div className="gp-tami-card">
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <div className="gp-tami-avatar">T</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#2dd4bf'}}>TAMi's Insight</div>
                <div style={{fontSize:10,color:'#64748b'}}>Personalized for you</div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#94a3b8',lineHeight:1.6}}>
              {accuracy >= 80
                ? `Great session! Your ear is developing well. You're ${3-LEVEL > 0 ? 3-LEVEL+' levels' : 'ready'} from unlocking the second octave. Keep this up! 🎵`
                : accuracy >= 50
                ? `Good effort! Focus on listening to the interval between notes — that pattern will help your sequence order. TAMi is watching your progress! 🎯`
                : `Keep practicing! Every session trains your ear a little more. Remember: Play Scale first, then really focus on each note before answering. You've got this! 💪`
              }
            </div>
            <div style={{marginTop:8}}>
              <span className="gp-tami-tag" style={{background:'rgba(34,197,94,.2)',color:'#4ade80',border:'1px solid rgba(34,197,94,.3)'}}>📍 WYL Saved</span>
              <span className="gp-tami-tag" style={{background:'rgba(59,130,246,.2)',color:'#60a5fa',border:'1px solid rgba(59,130,246,.3)'}}>📊 DPM Updated</span>
              {s.bestStreak >= 5 && <span className="gp-tami-tag" style={{background:'rgba(239,68,68,.2)',color:'#f87171',border:'1px solid rgba(239,68,68,.3)'}}>🔥 Streak Noted</span>}
            </div>
          </div>

          <div className="gp-go-actions">
            <button className="gp-go-restart" onClick={()=>{setShowGameOver(false);setAnswers([]);setNoteStates({});setLitNote(null);setStreak(0);sessionRef.current={correct:0,attempts:0,noteErrors:{},replaysUsed:0,startTime:Date.now(),bestStreak:0,currentStreak:0}}}>🎮 Play Again</button>
            <button className="gp-go-summary" onClick={()=>navigate('/session-summary')}>📊 Summary</button>
          </div>
        </div>
      </div>

    </div>
  )
}
