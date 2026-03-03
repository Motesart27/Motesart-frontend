import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://deployable-python-codebase-som-production.up.railway.app'

// âââ NOTE DATA ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const NOTE_FREQS = [
  261.63,293.66,329.63,349.23,392.00,440.00,493.88,
  523.25,587.33,659.25,698.46,783.99,880.00,987.77,
  1046.50,1174.66,1318.51,1396.91,
]

const NOTE_NAMES = ['C','D','E','F','G','A','B','C','D','E','F','G','A','B','C','D','E','F']

const SCALE_NOTES = [
  { name:'C', freq:261.63, top:96, hasLedger:true },
  { name:'D', freq:293.66, top:88, hasLedger:false },
  { name:'E', freq:329.63, top:81, hasLedger:false },
  { name:'F', freq:349.23, top:73, hasLedger:false },
  { name:'G', freq:392.00, top:65, hasLedger:false },
  { name:'A', freq:440.00, top:57, hasLedger:false },
  { name:'B', freq:493.88, top:49, hasLedger:false },
  { name:'C', freq:523.25, top:41, hasLedger:false },
]

// âââ LEVEL HELPERS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function getOctaves(level) { if (level <= 3) return 1; if (level <= 9) return 2; return 3 }
function getNoteCount(level) { return level }
function getMaxScaleReplays(level) { if (level <= 12) return 2; return 3 }
function getMaxFindReplays() { return 2 }
function getOctaveLabel(level) {
  const o = getOctaves(level)
  return o === 1 ? 'One octave' : o === 2 ? 'Two octaves' : 'Three octaves'
}

// âââ MYSTERY SEQUENCE GENERATOR (prevents consecutive identical sequences) âââ
function generateMystery(length, prevMystery) {
  let seq
  let attempts = 0
  do {
    seq = Array.from({ length }, () => Math.floor(Math.random() * 8))
    attempts++
  } while (
    attempts < 10 &&
    prevMystery &&
    prevMystery.length > 0 &&
    seq.length === prevMystery.length &&
    seq.every((n, i) => n === prevMystery[i])
  )
  return seq
}

// âââ TAMI LEVEL UP MESSAGES ââââââââââââââââââââââââââââââââââââââââââââââââââ
function getTamiLevelUpMsg(level) {
  if (level === 2) return "You found your first note! Your ear is waking up ðµ"
  if (level === 3) return "Two notes at once â your memory is growing! ð§ "
  if (level === 4) return "Three notes! You're building real pitch memory now ð¯"
  if (level === 5) return "Level 5! You're officially a music student now ð"
  if (level === 6) return "Six levels deep â your ear is sharper than you think! â¨"
  if (level === 7) return "Seven! TAMi is taking notes on your progress ð"
  if (level === 8) return "Eight notes incoming â you're entering expert territory! ð¥"
  if (level === 9) return "Almost at double digits! Your pitch memory is elite ð¸"
  if (level === 10) return "LEVEL 10! Double digits â TAMi is seriously impressed â¡"
  if (level === 12) return "Level 12! Three octaves unlocked. You're a force ð"
  if (level >= 15) return "LEGENDARY status. TAMi bows to your ear training ð"
  return `Level ${level}! Keep climbing â TAMi believes in you! ð`
}

function getPianoKeys(level) {
  const oct = getOctaves(level)
  const keys = []
  for (let o = 0; o < oct; o++) {
    for (let n = 0; n < 7; n++) {
      const globalIdx = o * 7 + n
      keys.push({
        num: n + 1,
        name: NOTE_NAMES[globalIdx],
        freq: NOTE_FREQS[globalIdx],
        idx: globalIdx,
        isOctaveC: false,
        scaleNote: n   // FIX: 0-6 maps to C D E F G A B in SCALE_NOTES
      })
    }
  }
  const finalIdx = oct * 7
  keys.push({
    num: 8,
    name: "C",
    freq: NOTE_FREQS[finalIdx],
    idx: finalIdx,
    isOctaveC: true,
    scaleNote: 7   // FIX: 7 maps to high C in SCALE_NOTES
  })
  return keys
}

// âââ PIANO COMPONENT âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Piano({ keys, octaves, pressed, onKeyPress }) {
  const whiteKeys = keys
  const totalWhite = whiteKeys.length
  const BLACK_OFFSETS = [0,1,3,4,5]
  return (
    <div style={{
      width:'100%', maxWidth:960, position:'relative', height:150,
      background:'linear-gradient(180deg,#1a2744,#0f172a)',
      borderRadius:'0 0 12px 12px', border:'2px solid #2d3f5e',
      borderTop:'6px solid #3b4f6b', overflow:'visible',
      display:'flex', padding:'0 2px', gap:'2px',
      boxShadow:'inset 0 2px 8px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.5)'
    }}>
      {whiteKeys.map((k,i) => (
        <div key={i}
          onClick={() => onKeyPress(k.idx, i, k.scaleNote)}
          style={{
            flex:1,
            background: pressed===i
              ? 'linear-gradient(180deg,#bfdbfe,#93c5fd)'
              : k.isOctaveC
                ? 'linear-gradient(180deg,#dbeafe 0%,#c7d9f5 60%,#b8cef0 100%)'
                : 'linear-gradient(180deg,#f1f5f9 0%,#e2e8f0 60%,#cbd5e1 100%)',
            borderLeft:'none', borderRight:'none', borderBottom:'none',
            borderRadius:'0 0 6px 6px',
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'flex-end', paddingBottom:8, cursor:'pointer',
            position:'relative', zIndex:1, minWidth:0,
            transform: pressed===i ? 'translateY(3px) scaleY(0.98)' : 'none',
            transition:'all .08s',
            boxShadow: pressed===i
              ? 'inset 0 -1px 0 rgba(0,0,0,.15), inset 0 2px 4px rgba(0,0,0,.2)'
              : k.isOctaveC
                ? 'inset -2px 0 0 rgba(100,140,220,.3), inset 2px 0 0 rgba(100,140,220,.3), inset 0 -3px 0 #8baad4, 2px 0 4px rgba(0,0,0,.25)'
                : 'inset -2px 0 0 rgba(0,0,0,.08), inset 2px 0 0 rgba(255,255,255,.6), inset 0 -3px 0 #94a3b8, 2px 0 4px rgba(0,0,0,.2)',
          }}
        >
          <span style={{fontSize:10,fontWeight:700,color: k.isOctaveC ? '#1d4ed8' : '#94a3b8',pointerEvents:'none'}}>{k.num}</span>
          <span style={{fontSize:11,fontWeight:800,color: k.isOctaveC ? '#1d4ed8' : '#475569',pointerEvents:'none'}}>{k.name}</span>
        </div>
      ))}
      {Array.from({length: octaves}, (_,o) => {
        const octaveStart = o * 8
        return BLACK_OFFSETS.map(offset => {
          const whiteIdx = octaveStart + offset
          if (whiteIdx >= totalWhite - 1) return null
          const keyWidth = 100 / totalWhite
          const leftPct = (whiteIdx + 1) * keyWidth - (keyWidth * 0.35)
          return (
            <div key={`b-${o}-${offset}`} style={{
              position:'absolute', left: leftPct + '%', top:0,
              width: keyWidth * 0.65 + '%', height:'62%',
              background:'linear-gradient(180deg,#1e2a3a 0%,#162030 50%,#0f1820 100%)',
              border:'1px solid #0a1520', borderTop:'2px solid #2d3f52',
              borderRadius:'0 0 5px 5px', zIndex:2,
              boxShadow:'2px 4px 8px rgba(0,0,0,.7), inset 1px 0 0 rgba(255,255,255,.06), inset -1px 0 0 rgba(0,0,0,.4)',
              cursor:'pointer', pointerEvents:'none',
            }} />
          )
        })
      })}
    </div>
  )
}

// âââ STREAK CONFIG ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function getStreakStyle(streak) {
  if (streak === 0) return { border:'#374151', bg:'rgba(55,65,81,.2)', color:'#6b7280', label:'', emoji:'' }
  if (streak < 3) return { border:'#f97316', bg:'rgba(249,115,22,.1)', color:'#fb923c', label:'Warming Up', emoji:'ð¥' }
  if (streak < 5) return { border:'#f97316', bg:'rgba(249,115,22,.12)', color:'#fb923c', label:'Warming Up!', emoji:'ð¥' }
  if (streak < 10) return { border:'#ef4444', bg:'rgba(239,68,68,.15)', color:'#fbbf24', label:'ON FIRE!', emoji:'ð¥' }
  if (streak < 15) return { border:'#fbbf24', bg:'rgba(251,191,36,.2)', color:'#fbbf24', label:'INFERNO!', emoji:'ð' }
  return { border:'#a855f7', bg:'rgba(168,85,247,.2)', color:'#e879f9', label:'LEGENDARY!', emoji:'â¡' }
}

// âââ AUDIO âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
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
  } catch(e) { console.warn('Audio error:', e) }
}

// âââ CSS âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const css = `
.gp-container { max-width:1200px; margin:0 auto; padding:16px; background:#0f172a; color:#e2e8f0; min-height:100vh; font-family:'Inter','system-ui',sans-serif; }
.gp-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
.gp-header h1 { margin:0; font-size:28px; font-weight:700; color:#f1f5f9; }
.gp-button { background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; border:none; padding:10px 16px; border-radius:8px; cursor:pointer; font-weight:600; font-size:14px; transition:all .2s; }
.gp-button:hover { transform:translateY(-2px); box-shadow:0 8px 16px rgba(59,130,246,.4); }
.gp-button:active { transform:translateY(0); }
.gp-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:20px; }
.gp-stat-box { background:rgba(30,41,59,.6); border:1px solid #334155; border-radius:8px; padding:16px; text-align:center; }
.gp-stat-label { font-size:12px; color:#94a3b8; margin-bottom:8px; }
.gp-stat-value { font-size:28px; font-weight:700; color:#38bdf8; }
.gp-stat-value.streak { color:#fbbf24; }
.gp-stat-value.lives { color:#ef4444; }
.gp-flex { display:flex; gap:8px; }
.gp-flex span { font-size:20px; }
.gp-staff-container { background:rgba(15,23,42,.7); border:2px solid #334155; border-radius:12px; padding:24px; margin-bottom:24px; }
.gp-staff { position:relative; width:100%; height:240px; margin-bottom:32px; background:linear-gradient(180deg,rgba(15,23,42,.3) 0%,rgba(30,41,59,.5) 100%); border:1px solid #1e293b; border-radius:8px; }
.gp-staff-lines { position:absolute; width:100%; height:100%; }
.gp-staff-line { position:absolute; width:100%; height:1px; background:#2d3f5e; }
.gp-ledger { position:absolute; width:20px; height:1px; background:#475569; }
.gp-ledger-above { top:16px; left:40%; }
.gp-ledger-below { bottom:16px; left:40%; }
.gp-note { position:absolute; width:24px; height:24px; border-radius:50%; background:radial-gradient(circle at 30% 30%,#fbbf24,#f59e0b); border:2px solid #b45309; left:50%; transform:translateX(-12px); font-weight:700; display:flex; align-items:center; justify-content:center; font-size:10px; color:#78350f; box-shadow:0 4px 12px rgba(251,191,36,.3); cursor:pointer; transition:all .1s; }
.gp-note:hover { transform:translateX(-12px) scale(1.1); }
.gp-note.correct { background:radial-gradient(circle at 30% 30%,#4ade80,#22c55e); border-color:#15803d; color:#15803d; }
.gp-note.wrong { background:radial-gradient(circle at 30% 30%,#f87171,#ef4444); border-color:#7f1d1d; color:#7f1d1d; }
.gp-note-name { position:absolute; bottom:-20px; font-size:11px; color:#94a3b8; left:50%; transform:translateX(-50%); white-space:nowrap; }
.gp-controls { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
.gp-controls button { flex:1; min-width:120px; }
.gp-mode-tabs { display:flex; gap:8px; margin-bottom:20px; background:rgba(30,41,59,.4); padding:8px; border-radius:8px; }
.gp-mode-tab { flex:1; padding:12px; border:none; border-radius:6px; cursor:pointer; font-weight:600; font-size:14px; transition:all .2s; background:transparent; color:#94a3b8; }
.gp-mode-tab.active { background:#3b82f6; color:white; }
.gp-mode-tab:hover { background:rgba(59,130,246,.2); color:#e2e8f0; }
.gp-toast { position:fixed; bottom:24px; left:24px; padding:16px 24px; border-radius:8px; font-weight:600; font-size:14px; animation:slideUp .3s ease-out; z-index:1000; }
@keyframes slideUp { from { transform:translateY(100px); opacity:0 } to { transform:translateY(0); opacity:1 } }
.gp-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.8); display:flex; align-items:center; justify-content:center; z-index:2000; }
.gp-modal { background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%); border:2px solid #334155; border-radius:16px; padding:40px; max-width:500px; color:#e2e8f0; }
.gp-modal h2 { margin:0 0 16px 0; font-size:28px; font-weight:700; }
.gp-modal p { margin:0 0 24px 0; font-size:16px; color:#cbd5e1; line-height:1.6; }
.gp-modal-buttons { display:flex; gap:12px; justify-content:flex-end; }
.gp-modal-buttons button { padding:10px 20px; border-radius:6px; border:none; cursor:pointer; font-weight:600; transition:all .2s; }
.gp-modal-buttons .primary { background:#3b82f6; color:white; }
.gp-modal-buttons .primary:hover { background:#2563eb; transform:translateY(-2px); }
.gp-modal-buttons .secondary { background:rgba(59,130,246,.1); color:#38bdf8; }
.gp-modal-buttons .secondary:hover { background:rgba(59,130,246,.2); }
.gp-confetti-piece { position:fixed; pointer-events:none; animation:confettiFall linear infinite; }
@keyframes confettiFall { to { transform:translateY(100vh) rotate(720deg); opacity:0 } }
.gp-badge { display:inline-block; padding:4px 12px; background:rgba(251,191,36,.15); border:1px solid #fbbf24; border-radius:16px; font-size:12px; color:#fbbf24; margin-right:8px; }
.gp-level-up { background:linear-gradient(135deg,#fbbf24,#f59e0b); color:#78350f; }
.gp-progress-bar { width:100%; height:8px; background:rgba(59,130,246,.1); border-radius:4px; overflow:hidden; margin-bottom:16px; }
.gp-progress-fill { height:100%; background:linear-gradient(90deg,#3b82f6,#38bdf8); transition:width .3s ease; }
.gp-htp-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px; margin-top:24px; }
.gp-htp-card { background:rgba(30,41,59,.5); border:1px solid #334155; border-radius:8px; padding:16px; }
.gp-htp-card h3 { margin:0 0 8px 0; font-size:16px; color:#38bdf8; font-weight:600; }
.gp-htp-card p { margin:0; font-size:14px; color:#cbd5e1; line-height:1.5; }
.gp-replay-btn { background:rgba(100,150,220,.15); border:1px solid #64b6ff; color:#64b6ff; padding:10px 16px; border-radius:6px; cursor:pointer; font-weight:600; transition:all .2s; }
.gp-replay-btn:hover { background:rgba(100,150,220,.25); transform:translateY(-2px); }
.gp-replay-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.gp-session-summary { margin-top:20px; padding:20px; background:rgba(30,41,59,.5); border:1px solid #334155; border-radius:8px; }
.gp-summary-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1e293b; font-size:14px; }
.gp-summary-row:last-child { border-bottom:none; }
.gp-summary-label { color:#94a3b8; }
.gp-summary-value { color:#38bdf8; font-weight:600; }
`

// âââ CONFETTI COMPONENT ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Confetti() {
  const pieces = Array.from({length: 60}, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    color: ['#fbbf24','#a855f7','#14b8a6','#ef4444','#3b82f6','#22c55e','#f97316'][Math.floor(Math.random() * 7)],
    size: 6 + Math.random() * 8,
  }))
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="gp-confetti-piece" style={{
          left: p.left + '%', top: '-10px', width: p.size, height: p.size,
          background: p.color, animationDelay: p.delay + 's', animationDuration: p.duration + 's',
        }}/>
      ))}
    </>
  )
}

// âââ COMPONENT âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function GamePage() {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('som_user') || '{}')

  const [level, setLevel] = useState(1)
  const keys = getPianoKeys(level)
  const noteCount = getNoteCount(level)
  const maxScaleReplays = getMaxScaleReplays(level)
  const maxFindReplays = getMaxFindReplays()
  const octaveLabel = getOctaveLabel(level)

  // Game state
  const [answers, setAnswers] = useState([])
  const [litNote, setLitNote] = useState(null)
  const [noteStates, setNoteStates] = useState({})
  const [pressed, setPressed] = useState(null)
  const [showHtp, setShowHtp] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [scaleReplays, setScaleReplays] = useState(2)
  const [findReplays, setFindReplays] = useState(2)
  const [mystery, setMystery] = useState([])
  const [mode, setMode] = useState('game')
  const [isPlaying, setIsPlaying] = useState(false)
  const [streak, setStreak] = useState(0)
  const [toast, setToast] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)  // FIX: guard against duplicate evaluations

  // Lives
  const [lives, setLives] = useState(3)
  const [maxLives] = useState(6)

  // Progress
  const [levelProgress, setLevelProgress] = useState(0)
  const CORRECT_TO_LEVELUP = 4

  // Level up celebration
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [pendingLevel, setPendingLevel] = useState(null)
  const [sessionLogged, setSessionLogged] = useState(false)
  const [sessionPoints, setSessionPoints] = useState(0)

  const playingRef = useRef(false)
  const sessionRef = useRef({
    correct: 0, attempts: 0, noteErrors: {}, replaysUsed: 0,
    startTime: Date.now(), bestStreak: 0, currentStreak: 0,
  })

  // Session logging
  const logSession = useCallback(async () => {
    if (sessionLogged) return
    setSessionLogged(true)

    const sessionTime = Math.round((Date.now() - sessionRef.current.startTime) / 1000)
    const accuracy = sessionRef.current.attempts > 0
      ? Math.round((sessionRef.current.correct / sessionRef.current.attempts) * 100)
      : 0

    const points = sessionRef.current.correct * (streak >= 5 ? 2 : 1)
    setSessionPoints(points)

    try {
      const payload = {
        userId: storedUser.id || 'anonymous',
        level: level,
        correct: sessionRef.current.correct,
        attempts: sessionRef.current.attempts,
        accuracy: accuracy,
        bestStreak: sessionRef.current.bestStreak,
        sessionTime: sessionTime,
        noteErrors: sessionRef.current.noteErrors,
        replaysUsed: sessionRef.current.replaysUsed,
        points: points,
      }
      const res = await fetch(`${BACKEND_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) console.error('Session log failed:', res.status)
    } catch (err) {
      console.error('Session log error:', err)
    }
  }, [level, streak, sessionLogged, storedUser])

  // Generate mystery sequence whenever level or noteCount changes
  useEffect(() => {
    const seq = generateMystery(noteCount, null)  // FIX: use generateMystery
    setMystery(seq)
    setScaleReplays(getMaxScaleReplays(level))
    setFindReplays(getMaxFindReplays())
  }, [level, noteCount])

  // Play the mystery sequence with visual feedback
  const playSequence = async () => {
    if (isPlaying || playingRef.current || mystery.length === 0) return
    playingRef.current = true
    setIsPlaying(true)

    for (let i = 0; i < mystery.length; i++) {
      const noteIdx = mystery[i]
      setLitNote(noteIdx)
      playTone(SCALE_NOTES[noteIdx].freq, 0.5)
      await new Promise(resolve => setTimeout(resolve, 600))
    }

    setLitNote(null)
    playingRef.current = false
    setIsPlaying(false)
  }

  // Play the scale for learning
  const playSequenceHidden = async () => {
    if (isPlaying || playingRef.current) return
    playingRef.current = true
    setIsPlaying(true)

    for (let i = 0; i < 8; i++) {
      playTone(SCALE_NOTES[i].freq, 0.4)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    playingRef.current = false
    setIsPlaying(false)
  }

  // Play the scale visually
  const playScale = async () => {
    if (isPlaying || playingRef.current) return
    playingRef.current = true
    setIsPlaying(true)

    for (let i = 0; i < 8; i++) {
      setLitNote(i)
      playTone(SCALE_NOTES[i].freq, 0.4)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setLitNote(null)
    playingRef.current = false
    setIsPlaying(false)
  }

  // Find the note game
  const findNote = async () => {
    if (isPlaying || playingRef.current) return
    playingRef.current = true
    setIsPlaying(true)

    const noteIdx = Math.floor(Math.random() * 8)
    setLitNote(noteIdx)
    playTone(SCALE_NOTES[noteIdx].freq, 0.5)

    await new Promise(resolve => setTimeout(resolve, 600))
    setLitNote(null)
    playingRef.current = false
    setIsPlaying(false)
  }

  // Toast notifications
  const showToastMsg = (message, color, bgColor, borderColor) => {
    setToast({ message, color, bgColor, borderColor })
    setTimeout(() => setToast(null), 2000)
  }

  // Level up
  const doLevelUp = useCallback((fromLevel) => {
    const newLevel = fromLevel + 1
    setPendingLevel(newLevel)
    setShowLevelUp(true)
  }, [])

  const dismissLevelUp = () => {
    if (pendingLevel) {
      setLevel(pendingLevel)
      setLevelProgress(0)
      setAnswers([])
      setNoteStates({})
    }
    setShowLevelUp(false)
    setPendingLevel(null)
  }

  // Key press - WITH ALL FIXES
  const pressKey = useCallback((noteIdx, keyPos, scaleNote) => {  // FIX: added scaleNote param
    if (isPlaying) return
    if (isEvaluating) return  // FIX: prevent presses during evaluation
    if (mode === 'game' && lives <= 0) return

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    setPressed(keyPos)
    setTimeout(() => setPressed(null), 180)
    playTone(NOTE_FREQS[noteIdx], 0.4)

    const next = [...answers, scaleNote]  // FIX: use scaleNote instead of noteIdx % 8
    setAnswers(next)

    if (next.length >= noteCount) {
      setIsEvaluating(true)  // FIX: lock out further presses
      sessionRef.current.attempts++

      const allCorrect = next.every((n, i) => n === mystery[i])

      const newStates = {}
      next.forEach((n, i) => {
        const staffPos = mystery[i]
        const isCorrect = n === mystery[i]
        newStates[staffPos] = isCorrect ? 'correct' : 'wrong'
        if (!isCorrect) {
          sessionRef.current.noteErrors[SCALE_NOTES[mystery[i]].name] =
            (sessionRef.current.noteErrors[SCALE_NOTES[mystery[i]].name] || 0) + 1
        }
      })

      if (allCorrect) {
        mystery.forEach(pos => { newStates[pos] = 'correct' })
      }
      setNoteStates(newStates)

      if (allCorrect) {
        sessionRef.current.correct++
        const newStreak = sessionRef.current.currentStreak + 1
        sessionRef.current.currentStreak = newStreak
        sessionRef.current.bestStreak = Math.max(sessionRef.current.bestStreak, newStreak)
        setStreak(newStreak)

        setLevelProgress(prev => {
          const newProgress = prev + 1
          if (newProgress >= CORRECT_TO_LEVELUP) {
            setTimeout(() => doLevelUp(level), 1600)
          }
          return newProgress
        })

        if (newStreak === 3) showToastMsg('ð¥ TRIPLE! +50 pts', '#fb923c', 'rgba(249,115,22,.15)', 'rgba(249,115,22,.4)')
        if (newStreak === 5) {
          showToastMsg('ð¥ ON FIRE! Life recovered! â¤ï¸', '#ef4444', 'rgba(239,68,68,.15)', 'rgba(239,68,68,.4)')
          if (mode === 'game') setLives(l => Math.min(l + 1, maxLives))
        }
        if (newStreak === 10) showToastMsg('ð INFERNO! x2 multiplier!', '#fbbf24', 'rgba(251,191,36,.12)', 'rgba(251,191,36,.4)')
        if (newStreak === 15) showToastMsg('â¡ LEGENDARY! TAMi is impressed!', '#e879f9', 'rgba(168,85,247,.15)', 'rgba(168,85,247,.5)')
      } else {
        sessionRef.current.currentStreak = 0
        setStreak(0)
        if (mode === 'game') {
          setLives(l => {
            const newLives = l - 1
            if (newLives <= 0) {
              setTimeout(() => { logSession(); setShowGameOver(true) }, 1800)
            }
            return Math.max(0, newLives)
          })
        }
      }

      setTimeout(() => {
        setAnswers([])
        setNoteStates({})
        setIsEvaluating(false)  // FIX: unlock key presses
        const seq = generateMystery(noteCount, mystery)  // FIX: use generateMystery
        setMystery(seq)
        setScaleReplays(getMaxScaleReplays(level))
        setFindReplays(getMaxFindReplays())
      }, 1600)
    }
  }, [answers, isPlaying, isEvaluating, mystery, noteCount, mode, maxLives, logSession, level, doLevelUp])  // FIX: added isEvaluating

  const resetGame = () => {
    setLevel(1)
    setAnswers([]); setNoteStates({}); setLitNote(null)
    setScaleReplays(getMaxScaleReplays(1)); setFindReplays(getMaxFindReplays())
    setStreak(0); setLives(3)
    setLevelProgress(0)
    setIsEvaluating(false)  // FIX: reset evaluation guard
    setSessionLogged(false); setSessionPoints(0)
    sessionRef.current = {
      correct: 0, attempts: 0, noteErrors: {}, replaysUsed: 0,
      startTime: Date.now(), bestStreak: 0, currentStreak: 0,
    }
    const seq = generateMystery(1, null)  // FIX: use generateMystery
    setMystery(seq)
  }

  return (
    <>
      <style>{css}</style>

      <div className="gp-container">
        <div className="gp-header">
          <h1>Find The Note</h1>
          <button className="gp-button" onClick={() => navigate('/')}>
            Back
          </button>
        </div>

        <div className="gp-stats">
          <div className="gp-stat-box">
            <div className="gp-stat-label">Level</div>
            <div className="gp-stat-value">{level}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>{octaveLabel}</div>
          </div>
          <div className="gp-stat-box">
            <div className="gp-stat-label">Mode</div>
            <div style={{ fontSize: 14, color: '#38bdf8', fontWeight: 700, textTransform: 'capitalize' }}>{mode}</div>
          </div>
          <div className="gp-stat-box">
            <div className="gp-stat-label">Streak</div>
            <div className={`gp-stat-value streak`}>{streak}</div>
          </div>
          <div className="gp-stat-box">
            <div className="gp-stat-label">Lives</div>
            <div className="gp-flex">
              {Array.from({length: Math.max(3, lives)}, (_,i) => i < lives ? 'â¤ï¸' : 'ð¤')}
            </div>
          </div>
        </div>

        <div className="gp-progress-bar">
          <div className="gp-progress-fill" style={{ width: `${(levelProgress / CORRECT_TO_LEVELUP) * 100}%` }}></div>
        </div>

        {showHtp && (
          <div className="gp-modal-overlay" onClick={() => setShowHtp(false)}>
            <div className="gp-modal" onClick={e => e.stopPropagation()}>
              <h2>How to Play</h2>
              <p>TAMi will play a musical sequence. Try to repeat it on the piano by ear!</p>
              <div className="gp-htp-grid">
                <div className="gp-htp-card">
                  <h3>Listen</h3>
                  <p>Press "Play" to hear the mystery sequence</p>
                </div>
                <div className="gp-htp-card">
                  <h3>Repeat</h3>
                  <p>Click the piano keys to repeat the notes</p>
                </div>
                <div className="gp-htp-card">
                  <h3>Level Up</h3>
                  <p>Get 4 correct in a row to advance</p>
                </div>
                <div className="gp-htp-card">
                  <h3>Streak</h3>
                  <p>Keep your streak alive for bonuses</p>
                </div>
              </div>
              <div className="gp-modal-buttons" style={{ marginTop: 20 }}>
                <button className="gp-button" onClick={() => setShowHtp(false)}>Got it!</button>
              </div>
            </div>
          </div>
        )}

        {showLevelUp && (
          <div className="gp-modal-overlay" onClick={dismissLevelUp}>
            <div className="gp-modal gp-level-up" onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#78350f' }}>Level Up! ð</h2>
              <p style={{ color: '#92400e' }}>
                {pendingLevel ? getTamiLevelUpMsg(pendingLevel) : "Great job!"}
              </p>
              <div className="gp-modal-buttons">
                <button className="gp-button" style={{ background: '#78350f', color: '#fef3c7' }} onClick={dismissLevelUp}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {showGameOver && (
          <div className="gp-modal-overlay" onClick={() => {setShowGameOver(false); resetGame()}}>
            <div className="gp-modal" onClick={e => e.stopPropagation()}>
              <h2>Game Over ð¢</h2>
              <p>You've run out of lives. Great effort though!</p>
              <div className="gp-session-summary">
                <div className="gp-summary-row">
                  <span className="gp-summary-label">Correct</span>
                  <span className="gp-summary-value">{sessionRef.current.correct} / {sessionRef.current.attempts}</span>
                </div>
                <div className="gp-summary-row">
                  <span className="gp-summary-label">Accuracy</span>
                  <span className="gp-summary-value">
                    {sessionRef.current.attempts > 0
                      ? Math.round((sessionRef.current.correct / sessionRef.current.attempts) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="gp-summary-row">
                  <span className="gp-summary-label">Best Streak</span>
                  <span className="gp-summary-value">{sessionRef.current.bestStreak}</span>
                </div>
                <div className="gp-summary-row">
                  <span className="gp-summary-label">Points</span>
                  <span className="gp-summary-value">{sessionPoints}</span>
                </div>
              </div>
              <div className="gp-modal-buttons" style={{ marginTop: 20 }}>
                <button className="gp-button" onClick={() => {setShowGameOver(false); resetGame()}}>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="gp-toast" style={{
            background: toast.bgColor,
            color: toast.color,
            border: `2px solid ${toast.borderColor}`,
          }}>
            {toast.message}
          </div>
        )}

        <div className="gp-mode-tabs">
          <button
            className={`gp-mode-tab ${mode === 'game' ? 'active' : ''}`}
            onClick={() => setMode('game')}
          >
            Game
          </button>
          <button
            className={`gp-mode-tab ${mode === 'learn' ? 'active' : ''}`}
            onClick={() => setMode('learn')}
          >
            Learn
          </button>
          <button
            className={`gp-mode-tab ${mode === 'sandbox' ? 'active' : ''}`}
            onClick={() => setMode('sandbox')}
          >
            Sandbox
          </button>
        </div>

        {mode === 'game' && (
          <div className="gp-staff-container">
            <div className="gp-controls">
              <button className="gp-button" onClick={playSequence} disabled={isPlaying}>
                ð Play
              </button>
              <button
                className="gp-replay-btn"
                onClick={playSequence}
                disabled={scaleReplays <= 0 || isPlaying}
              >
                ð Replay ({scaleReplays})
              </button>
              {answers.length > 0 && (
                <button
                  className="gp-button"
                  style={{ background: 'rgba(239,68,68,.3)', borderColor: '#ef4444' }}
                  onClick={() => { setAnswers([]); setNoteStates({}); setIsEvaluating(false) }}
                >
                  â» Clear
                </button>
              )}
            </div>

            <div className="gp-staff">
              <div className="gp-staff-lines">
                {[1, 2, 3, 4, 5].map(line => (
                  <div
                    key={line}
                    className="gp-staff-line"
                    style={{ top: 40 + (line - 1) * 40 + 'px' }}
                  />
                ))}
                <div className="gp-ledger gp-ledger-above" />
                <div className="gp-ledger gp-ledger-below" />
              </div>
              {mystery.map((notePos, i) => (
                <div
                  key={i}
                  className="gp-note"
                  style={{
                    top: SCALE_NOTES[notePos].top + 'px',
                    left: 80 + i * 50 + 'px',
                    background:
                      noteStates[notePos] === 'correct'
                        ? 'radial-gradient(circle at 30% 30%,#4ade80,#22c55e)'
                        : noteStates[notePos] === 'wrong'
                          ? 'radial-gradient(circle at 30% 30%,#f87171,#ef4444)'
                          : litNote === notePos
                            ? 'radial-gradient(circle at 30% 30%,#fde047,#facc15)'
                            : 'radial-gradient(circle at 30% 30%,#fbbf24,#f59e0b)',
                    borderColor:
                      noteStates[notePos] === 'correct'
                        ? '#15803d'
                        : noteStates[notePos] === 'wrong'
                          ? '#7f1d1d'
                          : litNote === notePos
                            ? '#ca8a04'
                            : '#b45309',
                    color:
                      noteStates[notePos] === 'correct'
                        ? '#15803d'
                        : noteStates[notePos] === 'wrong'
                          ? '#7f1d1d'
                          : '#78350f',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 16, minHeight: 20 }}>
              {answers.length > 0 && `You: ${answers.map(n => SCALE_NOTES[n].name).join(' ')}`}
            </p>
          </div>
        )}

        {mode === 'learn' && (
          <div className="gp-staff-container">
            <div className="gp-controls">
              <button className="gp-button" onClick={playScale} disabled={isPlaying}>
                ð¹ Play Scale
              </button>
              <button className="gp-button" onClick={playSequenceHidden} disabled={isPlaying}>
                ðµ Play Hidden
              </button>
              <button className="gp-button" onClick={findNote} disabled={isPlaying}>
                ð Find the Note
              </button>
              <button
                className="gp-replay-btn"
                onClick={findNote}
                disabled={findReplays <= 0 || isPlaying}
              >
                Replays ({findReplays})
              </button>
              <button className="gp-button" onClick={() => setShowHtp(true)}>
                â¹ï¸ Help
              </button>
            </div>

            <div className="gp-staff">
              <div className="gp-staff-lines">
                {[1, 2, 3, 4, 5].map(line => (
                  <div
                    key={line}
                    className="gp-staff-line"
                    style={{ top: 40 + (line - 1) * 40 + 'px' }}
                  />
                ))}
                <div className="gp-ledger gp-ledger-above" />
                <div className="gp-ledger gp-ledger-below" />
              </div>
              {SCALE_NOTES.map((note, i) => (
                <div
                  key={i}
                  className="gp-note"
                  style={{
                    top: note.top + 'px',
                    left: 80 + i * 50 + 'px',
                    background:
                      litNote === i
                        ? 'radial-gradient(circle at 30% 30%,#fde047,#facc15)'
                        : 'radial-gradient(circle at 30% 30%,#fbbf24,#f59e0b)',
                    borderColor: litNote === i ? '#ca8a04' : '#b45309',
                  }}
                >
                  {note.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'sandbox' && (
          <div className="gp-staff-container">
            <p style={{ color: '#cbd5e1', marginBottom: 16 }}>
              Free play mode. Click the piano to experiment with notes.
            </p>
            <div className="gp-staff">
              <div className="gp-staff-lines">
                {[1, 2, 3, 4, 5].map(line => (
                  <div
                    key={line}
                    className="gp-staff-line"
                    style={{ top: 40 + (line - 1) * 40 + 'px' }}
                  />
                ))}
                <div className="gp-ledger gp-ledger-above" />
                <div className="gp-ledger gp-ledger-below" />
              </div>
            </div>
          </div>
        )}

        <Piano
          keys={keys}
          octaves={getOctaves(level)}
          pressed={pressed}
          onKeyPress={pressKey}
        />

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button className="gp-button" onClick={() => { resetGame(); setShowGameOver(false) }}>
            ð Reset Game
          </button>
        </div>
      </div>

      {showLevelUp && <Confetti />}
    </>
  )
}
