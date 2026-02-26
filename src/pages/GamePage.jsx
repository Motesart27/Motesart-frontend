import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const css = `
.gp{min-height:100vh;background:linear-gradient(180deg,#0f172a,#1e293b);color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;flex-direction:column}
.gp-top{padding:8px 12px;background:rgba(15,23,42,.95);border-bottom:2px solid rgba(59,130,246,.3);backdrop-filter:blur(8px);position:sticky;top:0;z-index:10}
.gp-top-inner{max-width:1024px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}
.gp-pill{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:700;border:1px solid}
.gp-pill-pts{background:linear-gradient(135deg,rgba(234,179,8,.2),rgba(234,179,8,.1));border-color:rgba(234,179,8,.3);color:#fbbf24}
.gp-lives{display:flex;gap:2px;font-size:18px}
.gp-bpm{background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;border:none;border-radius:9999px;padding:4px 10px;font-size:12px;font-weight:700}
.gp-streak-box{text-align:center}
.gp-streak-lbl{font-size:9px;color:#6b7280}
.gp-streak-val{font-size:18px;font-weight:700;color:#c084fc}
.gp-fire{background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:700;animation:gpPulse 1s infinite}
@keyframes gpPulse{0%,100%{opacity:1}50%{opacity:.7}}
.gp-prog-wrap{display:flex;align-items:center;gap:6px}
.gp-prog-bar{width:64px;height:10px;background:#374151;border-radius:9999px;overflow:hidden;border:1px solid #4b5563}
.gp-prog-fill{height:100%;background:linear-gradient(90deg,#3b82f6,#a855f7);border-radius:9999px}
.gp-mid{padding:16px;display:flex;flex-direction:column;align-items:center;gap:16px}
.gp-staff{width:100%;max-width:640px;background:rgba(30,41,59,.8);border:2px solid rgba(100,116,139,.4);border-radius:12px;padding:16px;position:relative;overflow:hidden}
.gp-staff-lines{position:relative;height:80px}
.gp-staff-line{position:absolute;left:0;right:0;height:1px;background:rgba(148,163,184,.4)}
.gp-clef{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:48px;opacity:.6}
.gp-dots{display:flex;gap:24px;position:absolute;top:50%;left:80px;transform:translateY(-50%)}
.gp-dot{width:16px;height:16px;border-radius:50%;border:2px solid #94a3b8;background:transparent;transition:.3s}
.gp-dot.lit{background:#3b82f6;border-color:#60a5fa;box-shadow:0 0 12px rgba(59,130,246,.5)}
.gp-title h1{font-size:24px;font-weight:700;font-family:Georgia,serif;background:linear-gradient(135deg,#e2e8f0,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gp-info{width:28px;height:28px;border-radius:50%;background:rgba(59,130,246,.2);border:1px solid rgba(59,130,246,.4);color:#60a5fa;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;font-weight:700}
.gp-action-row{display:flex;gap:8px;width:100%;max-width:384px}
.gp-abtn{flex:1;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
.gp-abtn:hover{transform:scale(.98)}
.gp-abtn-scale{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;box-shadow:0 4px 12px rgba(239,68,68,.3)}
.gp-abtn-find{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;box-shadow:0 4px 12px rgba(34,197,94,.3)}
.gp-mode-row{display:flex;gap:8px;width:100%;max-width:384px}
.gp-mbtn{flex:1;padding:8px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:.2s}
.gp-mbtn-off{background:rgba(55,65,81,.8);color:#9ca3af}
.gp-mbtn-game{background:#9333ea;color:#fff;box-shadow:0 2px 8px rgba(147,51,234,.3)}
.gp-kb{flex:1;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.gp-lvl-badge{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border-radius:10px;padding:8px 14px;text-align:center;box-shadow:0 4px 12px rgba(37,99,235,.3)}
.gp-lvl-num{font-size:24px;font-weight:900}
.gp-lvl-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.gp-piano-wrap{width:100%;max-width:960px;padding:0 4px}
.gp-piano{display:flex;position:relative;height:140px;background:linear-gradient(180deg,#1e293b,#0f172a);border-radius:0 0 8px 8px;border:2px solid #334155;border-top:4px solid #475569;overflow:hidden}
.gp-wkey{flex:1;background:linear-gradient(180deg,#e2e8f0,#f8fafc);border-left:1px solid #cbd5e1;border-right:1px solid #cbd5e1;border-bottom:3px solid #94a3b8;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:8px;cursor:pointer;transition:all .1s;position:relative;z-index:1;border-radius:0 0 4px 4px;min-width:0}
.gp-wkey:hover{background:linear-gradient(180deg,#dbeafe,#eff6ff)}
.gp-wkey.pressed{background:linear-gradient(180deg,#93c5fd,#bfdbfe);border-bottom-color:#3b82f6;transform:translateY(2px)}
.gp-wkey-label{font-size:11px;font-weight:700;color:#475569;pointer-events:none}
.gp-wkey-num{font-size:9px;color:#94a3b8;pointer-events:none}
.gp-bkeys{position:absolute;top:0;left:0;right:0;height:85px;display:flex;pointer-events:none;z-index:2}
.gp-bk-spacer{flex:1}
.gp-bkey{width:8%;max-width:48px;background:linear-gradient(180deg,#1e293b,#0f172a);border:1px solid #334155;border-radius:0 0 4px 4px;pointer-events:auto;cursor:pointer;margin-left:-4%;margin-right:-4%;box-shadow:0 4px 8px rgba(0,0,0,.5);z-index:3}
.gp-answer{background:rgba(30,41,59,.8);border:1px solid rgba(59,130,246,.3);border-radius:8px;padding:6px 16px;display:flex;align-items:center;gap:8px}
.gp-footer{padding:8px 12px;border-top:1px solid #1e293b;background:rgba(15,23,42,.95);display:flex;justify-content:center;gap:8px}
.gp-fbtn{padding:6px 16px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer}
.gp-fbtn-dash{background:linear-gradient(135deg,#a855f7,#3b82f6);color:#fff}
.gp-fbtn-gray{background:#4b5563;color:#fff}
.gp-modal-bg{display:none;position:fixed;inset:0;z-index:50;align-items:center;justify-content:center;padding:16px}
.gp-modal-bg.show{display:flex}
.gp-modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px)}
.gp-modal{position:relative;border-radius:16px;width:100%;max-height:90vh;overflow-y:auto}
.gp-htp{background:#1e293b;border:1px solid #334155;max-width:448px;padding:24px}
.gp-go-modal{background:#1e293b;border:1px solid #334155;max-width:400px;padding:32px;text-align:center}
.gp-go-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.gp-go-stat{background:rgba(31,41,55,.5);border:1px solid rgba(55,65,81,.5);border-radius:10px;padding:12px;text-align:center}
.gp-go-actions{display:flex;gap:8px}
.gp-go-restart{flex:1;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#14b8a6,#06b6d4);color:#fff;font-weight:700;font-size:15px;cursor:pointer}
.gp-go-summary{flex:1;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-weight:700;font-size:15px;cursor:pointer}
`

const KEYS = [
  { num:'1', label:'C' },{ num:'2', label:'D' },{ num:'3', label:'E' },{ num:'4', label:'F' },
  { num:'5', label:'G' },{ num:'6', label:'A' },{ num:'7', label:'B' },{ num:'8', label:'C↑' },
]

export default function GamePage() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState([])
  const [litDots, setLitDots] = useState([])
  const [pressed, setPressed] = useState(null)
  const [showHtp, setShowHtp] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)

  const pressKey = useCallback((num, idx) => {
    setPressed(idx)
    setTimeout(()=>setPressed(null), 200)
    const next = [...answers, num]
    setAnswers(next)
    setLitDots(prev => [...prev, next.length-1])
    if (next.length >= 3) setTimeout(()=>{setAnswers([]);setLitDots([])}, 1500)
  }, [answers])

  const playScale = () => {
    let i = 0
    const iv = setInterval(()=>{
      setLitDots(i < 8 ? [i] : [])
      if (i >= 8) clearInterval(iv)
      i++
    }, 250)
  }

  return (
    <div className="gp"><style>{css}</style>
      <div className="gp-top"><div className="gp-top-inner">
        <div className="gp-pill gp-pill-pts"><span style={{fontSize:16}}>💰</span><span style={{fontSize:16}}>1,250</span></div>
        <div className="gp-lives"><span>❤️</span><span>❤️</span><span>🖤</span></div>
        <div className="gp-bpm">120 BPM</div>
        <div className="gp-streak-box"><div className="gp-streak-lbl">Streak</div><div className="gp-streak-val">7</div></div>
        <div className="gp-fire">🔥 ON FIRE!</div>
        <div className="gp-prog-wrap"><span style={{fontSize:9,color:'#6b7280'}}>Progress</span><div className="gp-prog-bar"><div className="gp-prog-fill" style={{width:'60%'}}/></div><span style={{fontSize:12,fontWeight:700,color:'#d1d5db'}}>60%</span></div>
      </div></div>

      <div className="gp-mid">
        <div className="gp-staff"><div className="gp-staff-lines">
          {[16,32,48,64,80].map(t=><div key={t} className="gp-staff-line" style={{top:`${t}%`}}/>)}
          <div className="gp-clef">𝄞</div>
          <div className="gp-dots">{Array.from({length:8}).map((_,i)=><div key={i} className={`gp-dot ${litDots.includes(i)?'lit':''}`}/>)}</div>
        </div></div>

        <div className="gp-title" style={{textAlign:'center'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <h1>Find the Note</h1>
            <button className="gp-info" onClick={()=>setShowHtp(true)}>ⓘ</button>
          </div>
          <div style={{fontSize:13,color:'#64748b',marginTop:4}}>Level 5 · Two octaves, 3 notes</div>
        </div>

        <div className="gp-action-row">
          <button className="gp-abtn gp-abtn-scale" onClick={playScale}>🎵 Play Scale</button>
          <button className="gp-abtn gp-abtn-find">▶ Find Note (2)</button>
        </div>
        <div className="gp-mode-row">
          <button className="gp-mbtn gp-mbtn-off">🎓 Academic</button>
          <button className="gp-mbtn gp-mbtn-game">🎮 Game</button>
        </div>
        <div style={{fontSize:11,color:'#22c55e',fontWeight:600}}>💚 3 more correct for life recovery!</div>
      </div>

      <div className="gp-kb">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="gp-lvl-badge"><div className="gp-lvl-num">5</div><div className="gp-lvl-lbl">Level</div></div>
          <div><div style={{fontSize:15,fontWeight:700}}>C Major Scale</div><div style={{fontSize:11,color:'#64748b'}}>Tap the keys to answer</div></div>
        </div>
        <div className="gp-piano-wrap"><div className="gp-piano">
          {KEYS.map((k,i)=><div key={i} className={`gp-wkey ${pressed===i?'pressed':''}`} onClick={()=>pressKey(k.num,i)}><span className="gp-wkey-num">{k.num}</span><span className="gp-wkey-label">{k.label}</span></div>)}
          <div className="gp-bkeys">
            <div className="gp-bk-spacer"/><div className="gp-bkey"/>
            <div className="gp-bk-spacer" style={{flex:.6}}/><div className="gp-bkey"/>
            <div className="gp-bk-spacer" style={{flex:1.4}}/><div className="gp-bkey"/>
            <div className="gp-bk-spacer" style={{flex:.6}}/><div className="gp-bkey"/>
            <div className="gp-bk-spacer" style={{flex:.6}}/><div className="gp-bkey"/>
            <div className="gp-bk-spacer"/>
          </div>
        </div></div>
        {answers.length > 0 && <div className="gp-answer"><span style={{fontSize:12,fontWeight:600,color:'#60a5fa'}}>Your answer:</span><span style={{fontSize:16,fontFamily:'monospace',fontWeight:700,color:'#93c5fd'}}>{answers.join(' - ')}</span></div>}
      </div>

      <div className="gp-footer">
        <button className="gp-fbtn gp-fbtn-dash" onClick={()=>navigate('/')}>📊 Dashboard</button>
        <button className="gp-fbtn gp-fbtn-gray" onClick={()=>{setAnswers([]);setLitDots([])}}>Reset</button>
        <button className="gp-fbtn gp-fbtn-gray" onClick={()=>setShowGameOver(true)}>Game Over</button>
      </div>

      {/* How To Play Modal */}
      <div className={`gp-modal-bg ${showHtp?'show':''}`}>
        <div className="gp-modal-backdrop" onClick={()=>setShowHtp(false)}/>
        <div className="gp-modal gp-htp">
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><h2 style={{fontSize:22,fontWeight:700}}>🎵 How to Play</h2><button style={{background:'none',border:'none',color:'#6b7280',fontSize:22,cursor:'pointer'}} onClick={()=>setShowHtp(false)}>✕</button></div>
          <div style={{padding:16,borderRadius:12,border:'1px solid rgba(59,130,246,.3)',background:'rgba(59,130,246,.1)',marginBottom:12}}><h3 style={{fontWeight:700,marginBottom:8,fontSize:14}}>🎯 Goal</h3><p style={{fontSize:13,color:'#cbd5e1',lineHeight:1.5}}>Listen to the notes and tap them on the piano keyboard in the correct order!</p></div>
          {[['1️⃣','Play Scale','First, listen to the C Major scale to tune your ear.'],['2️⃣','Find Note','Listen to the mystery notes. You can replay them a limited number of times.'],['3️⃣','Tap the Answer','Tap the piano keys in the same order you heard them.']].map(([n,t,s])=>(
            <div key={n} style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}><span style={{fontSize:22}}>{n}</span><div><p style={{fontWeight:600,fontSize:14}}>{t}</p><div style={{fontWeight:400,fontSize:12,color:'#94a3b8',marginTop:2}}>{s}</div></div></div>
          ))}
          <button style={{width:'100%',padding:14,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',background:'linear-gradient(135deg,#3b82f6,#a855f7)',color:'#fff',marginTop:8}} onClick={()=>setShowHtp(false)}>Got it! Let's Play 🎹</button>
        </div>
      </div>

      {/* Game Over Modal */}
      <div className={`gp-modal-bg ${showGameOver?'show':''}`}>
        <div className="gp-modal-backdrop" onClick={()=>setShowGameOver(false)}/>
        <div className="gp-modal gp-go-modal">
          <div style={{fontSize:48}}>💀</div>
          <div style={{fontSize:28,fontWeight:700}}>Game Over!</div>
          <div style={{fontSize:14,color:'#9ca3af',marginBottom:20}}>Final Score: 1,250 pts</div>
          <div className="gp-go-stats">
            {[['18','Correct','#4ade80'],['24','Attempts','#c084fc'],['75%','Accuracy','#fb923c'],['7','Best Streak','#22d3ee']].map(([v,l,c])=>(
              <div key={l} className="gp-go-stat"><div style={{fontSize:20,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:11,color:'#6b7280',marginTop:2}}>{l}</div></div>
            ))}
          </div>
          <div className="gp-go-actions">
            <button className="gp-go-restart" onClick={()=>setShowGameOver(false)}>🎮 Play Again</button>
            <button className="gp-go-summary" onClick={()=>navigate('/session-summary')}>📊 Summary</button>
          </div>
        </div>
      </div>
    </div>
  )
}
