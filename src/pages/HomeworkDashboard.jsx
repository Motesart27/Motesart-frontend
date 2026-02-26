import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const css = `
.hw-page{min-height:100vh;background:linear-gradient(135deg,#111827,#111827,#1f2937);color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.hw-header{border-bottom:1px solid #1f2937;position:sticky;top:0;background:rgba(17,24,39,.95);backdrop-filter:blur(12px);z-index:10;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.hw-back{padding:8px;background:none;border:none;cursor:pointer;border-radius:8px;display:flex;align-items:center;color:#9ca3af}
.hw-main{max-width:1280px;margin:0 auto;padding:24px 16px}
.hw-tabs{display:flex;gap:8px;margin-bottom:24px;overflow-x:auto;padding-bottom:8px}
.hw-tab{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .2s;white-space:nowrap}
.hw-tab.active{background:linear-gradient(135deg,#9333ea,#ec4899);color:#fff;box-shadow:0 4px 15px rgba(147,51,234,.3)}
.hw-tab.inactive{background:rgba(31,41,55,.5);color:#9ca3af}
.hw-tab.inactive:hover{color:#fff;background:rgba(55,65,81,.5)}
.hw-tab-count{padding:2px 8px;font-size:11px;border-radius:9999px}
.hw-tab.active .hw-tab-count{background:rgba(255,255,255,.2)}
.hw-tab.inactive .hw-tab-count{background:#374151}
.hw-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}
.hw-card{background:rgba(31,41,55,.8);backdrop-filter:blur(8px);border-radius:12px;border:1px solid rgba(55,65,81,.5);margin-bottom:24px}
.hw-card:last-child{margin-bottom:0}
.hw-card-h{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid rgba(55,65,81,.5)}
.hw-card-t{font-size:14px;font-weight:600}
.hw-card-b{padding:16px}
.hw-filters{display:flex;gap:6px}
.hw-fbtn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;border:none;cursor:pointer;transition:all .2s}
.hw-fbtn.on{background:linear-gradient(135deg,#9333ea,#ec4899);color:#fff}
.hw-fbtn.off{background:rgba(55,65,81,.5);color:#9ca3af}
.hw-th{display:grid;grid-template-columns:4fr 2fr 2fr 2fr 2fr;gap:8px;padding:12px 16px;background:rgba(55,65,81,.3);font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em}
.hw-tr{display:grid;grid-template-columns:4fr 2fr 2fr 2fr 2fr;gap:8px;padding:14px 16px;align-items:center;border-bottom:1px solid rgba(55,65,81,.5);cursor:pointer;transition:background .2s}
.hw-tr:hover{background:rgba(55,65,81,.3)}
.hw-tr:last-child{border-bottom:none}
.hw-tr.od{background:rgba(127,29,29,.1)}
.hw-rt{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hw-rtype{display:inline-block;padding:3px 10px;font-size:11px;font-weight:600;background:rgba(147,51,234,.2);color:#c084fc;border-radius:4px}
.hw-rtxt{font-size:13px;color:#9ca3af}
.hw-st{display:inline-block;padding:3px 10px;font-size:11px;font-weight:600;border-radius:9999px;border:1px solid}
.hw-st-c{background:rgba(34,197,94,.2);color:#4ade80;border-color:rgba(34,197,94,.3)}
.hw-st-p{background:rgba(59,130,246,.2);color:#60a5fa;border-color:rgba(59,130,246,.3)}
.hw-st-n{background:rgba(107,114,128,.2);color:#9ca3af;border-color:rgba(107,114,128,.3)}
.hw-st-o{background:rgba(239,68,68,.2);color:#f87171;border-color:rgba(239,68,68,.3)}
.hw-mc{background:rgba(55,65,81,.3);border-radius:12px;padding:16px;margin-bottom:12px;cursor:pointer;transition:background .2s}
.hw-mc:last-child{margin-bottom:0}
.hw-mc:hover{background:rgba(55,65,81,.5)}
.hw-stars{display:flex;gap:2px;font-size:14px}
.hw-pbar{flex:1;height:8px;background:#374151;border-radius:9999px;overflow:hidden}
.hw-pfill{height:100%;border-radius:9999px;background:#8b5cf6}
.hw-tip{padding:16px;border-radius:12px;border:1px solid;display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
.hw-tip:last-child{margin-bottom:0}
.hw-tip.blue{background:rgba(30,58,138,.2);border-color:rgba(59,130,246,.3)}
.hw-tip.green{background:rgba(20,83,45,.2);border-color:rgba(34,197,94,.3)}
.hw-tip.purple{background:rgba(88,28,135,.2);border-color:rgba(147,51,234,.3)}
.hw-qs{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.hw-qsi{background:rgba(55,65,81,.3);border-radius:8px;padding:12px;text-align:center}
.hw-qsi-v{font-size:24px;font-weight:700}
.hw-qsi-l{font-size:11px;color:#9ca3af;margin-top:2px}
.hw-due{display:flex;align-items:center;justify-content:space-between;padding:8px;background:rgba(55,65,81,.3);border-radius:8px;margin-bottom:8px}
.hw-due:last-child{margin-bottom:0}
.hw-qa-btn{width:100%;padding:10px;border-radius:8px;font-size:13px;font-weight:600;border:none;cursor:pointer;margin-bottom:8px}
.hw-qa-btn:last-child{margin-bottom:0}
.hw-qa-teal{background:linear-gradient(135deg,#0d9488,#0891b2);color:#fff}
.hw-qa-gray{background:rgba(55,65,81,.5);color:#fff;border:1px solid #4b5563}
.hw-cm{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.hw-cm-item{display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(55,65,81,.3);border-radius:8px}
.hw-cm-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#14b8a6,#06b6d4);display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
@media(max-width:1023px){.hw-grid{grid-template-columns:1fr}}
@media(max-width:639px){.hw-th,.hw-tr{grid-template-columns:3fr 2fr 2fr}.hw-th>:nth-child(3),.hw-th>:nth-child(4),.hw-tr>:nth-child(3),.hw-tr>:nth-child(4){display:none}.hw-cm{grid-template-columns:1fr}}
`

const ASSIGNS = [
  { title:'Level 3 Mastery', type:'Practice', game:'Find the Note', due:'2026-01-20', status:'progress', stCls:'hw-st-p', stText:'In Progress' },
  { title:'Scale Recognition Quiz', type:'Quiz', game:'Find the Note', due:'2026-01-22', status:'pending', stCls:'hw-st-n', stText:'Pending' },
  { title:'Weekly Practice Goal', type:'Homework', game:'Find the Note', due:'2026-01-19', status:'overdue', stCls:'hw-st-o', stText:'Overdue', od:true },
  { title:'Interval Training', type:'Practice', game:'Find the Note', due:'2026-01-18', status:'completed', stCls:'hw-st-c', stText:'Completed' },
]
const SHEETS = [
  { title:'Twinkle Twinkle Little Star', sub:'Melody Recognition', stars:4, pct:85 },
  { title:'Mary Had a Little Lamb', sub:'Rhythm Basics', stars:3, pct:60 },
  { title:'Ode to Joy', sub:'Note Reading', stars:2, pct:40 },
  { title:'Hot Cross Buns', sub:'Simple Patterns', stars:5, pct:95 },
]

export default function HomeworkDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('assignments')
  const [filter, setFilter] = useState('all')

  const filtered = ASSIGNS.filter(a => filter==='all' || (filter==='due' && ['pending','progress'].includes(a.status)) || filter===a.status)

  return (
    <div className="hw-page"><style>{css}</style>
      <div className="hw-header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button className="hw-back" onClick={()=>navigate('/')}><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
          <div><div style={{fontSize:18,fontWeight:700}}>Homework Dashboard</div><div style={{fontSize:11,color:'#9ca3af'}}>Academic Mode • Music Theory 101</div></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#a855f7,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,border:'2px solid rgba(147,51,234,.5)'}}>M</div>
        </div>
      </div>
      <div className="hw-main">
        <div className="hw-tabs">
          {[['assignments','📝 Assignments','3'],['sheetMusic','🎼 Sheet Music','4'],['aiTips','💡 AI Recommendations',null],['classroom','👥 Classroom','5']].map(([id,label,count])=>(
            <button key={id} className={`hw-tab ${activeTab===id?'active':'inactive'}`} onClick={()=>setActiveTab(id)}>{label}{count && <span className="hw-tab-count">{count}</span>}</button>
          ))}
        </div>
        <div className="hw-grid">
          <div>
            {activeTab==='assignments' && <div className="hw-card">
              <div className="hw-card-h"><span className="hw-card-t">Assignments</span>
                <div className="hw-filters">{['all','due','overdue','completed'].map(f=><button key={f} className={`hw-fbtn ${filter===f?'on':'off'}`} onClick={()=>setFilter(f)}>{f==='all'?'All':f==='due'?'Due Soon':f.charAt(0).toUpperCase()+f.slice(1)}</button>)}</div>
              </div>
              <div className="hw-th"><div>Title</div><div>Type</div><div>Game</div><div>Due Date</div><div>Status</div></div>
              {filtered.map(a=><div key={a.title} className={`hw-tr ${a.od?'od':''}`}><div className="hw-rt">{a.title}</div><div><span className="hw-rtype">{a.type}</span></div><div className="hw-rtxt">{a.game}</div><div className="hw-rtxt">{a.due}</div><div><span className={`hw-st ${a.stCls}`}>{a.stText}</span></div></div>)}
            </div>}
            {activeTab==='sheetMusic' && <div className="hw-card"><div className="hw-card-h"><span className="hw-card-t">Sheet Music Library</span></div><div className="hw-card-b">
              {SHEETS.map(s=><div key={s.title} className="hw-mc"><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}><div><div className="hw-rt" style={{fontSize:14}}>{s.title}</div><div style={{fontSize:12,color:'#9ca3af',marginTop:2}}>{s.sub}</div></div><div className="hw-stars">{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=s.stars?'#facc15':'#374151'}}>★</span>)}</div></div><div style={{display:'flex',alignItems:'center',gap:12}}><div className="hw-pbar"><div className="hw-pfill" style={{width:`${s.pct}%`}}/></div><span style={{fontSize:13,color:'#a855f7',fontWeight:600}}>{s.pct}%</span></div></div>)}
            </div></div>}
            {activeTab==='aiTips' && <div className="hw-card"><div className="hw-card-h"><span className="hw-card-t">AI Recommendations</span></div><div className="hw-card-b">
              <div className="hw-tip blue"><span>💡</span><div><div style={{color:'#60a5fa',fontWeight:600}}>Focus Area Suggestion</div><div style={{fontSize:13,color:'#cbd5e1',lineHeight:1.5,marginTop:4}}>Based on your recent sessions, we recommend focusing on Level 3-4 interval recognition.</div></div></div>
              <div className="hw-tip green"><span>🎯</span><div><div style={{color:'#4ade80',fontWeight:600}}>Practice Schedule</div><div style={{fontSize:13,color:'#cbd5e1',lineHeight:1.5,marginTop:4}}>You practice most effectively in 15-minute sessions. Consider breaking your weekly goal into four 15-minute sessions.</div></div></div>
              <div className="hw-tip purple"><span>⭐</span><div><div style={{color:'#c084fc',fontWeight:600}}>Strength Highlight</div><div style={{fontSize:13,color:'#cbd5e1',lineHeight:1.5,marginTop:4}}>Your rhythm recognition is excellent! You've maintained 90%+ accuracy for the past 2 weeks.</div></div></div>
            </div></div>}
            {activeTab==='classroom' && <div className="hw-card"><div className="hw-card-h"><span className="hw-card-t">Classroom</span></div><div className="hw-card-b">
              <div style={{padding:16,borderRadius:12,border:'1px solid rgba(147,51,234,.3)',background:'linear-gradient(135deg,rgba(88,28,135,.3),rgba(131,24,67,.3))',display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#a855f7,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,flexShrink:0}}>J</div>
                <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700}}>Ms. Johnson</div><div style={{fontSize:13,color:'#9ca3af'}}>Music Theory 101</div></div>
                <button style={{padding:'8px 16px',background:'#9333ea',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>💬 Message</button>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:'#9ca3af',marginBottom:12,textTransform:'uppercase',letterSpacing:'.05em'}}>CLASSMATES (5)</div>
              <div className="hw-cm">
                {['Alex','Maria','Sam','Jordan','Taylor'].map(n=>(
                  <div key={n} className="hw-cm-item"><div style={{display:'flex',alignItems:'center',gap:12}}><div className="hw-cm-av">{n[0]}</div><span style={{fontWeight:600}}>{n}</span></div><button style={{padding:8,background:'none',border:'none',cursor:'pointer',borderRadius:8,color:'#9ca3af',fontSize:16}}>💬</button></div>
                ))}
              </div>
            </div></div>}
          </div>
          {/* Sidebar */}
          <div>
            <div className="hw-card"><div className="hw-card-h"><span className="hw-card-t">This Week</span></div><div className="hw-card-b">
              <div className="hw-qs">
                <div className="hw-qsi"><div className="hw-qsi-v" style={{color:'#14b8a6'}}>2</div><div className="hw-qsi-l">Pending</div></div>
                <div className="hw-qsi"><div className="hw-qsi-v" style={{color:'#f87171'}}>1</div><div className="hw-qsi-l">Overdue</div></div>
                <div className="hw-qsi"><div className="hw-qsi-v" style={{color:'#4ade80'}}>1</div><div className="hw-qsi-l">Completed</div></div>
                <div className="hw-qsi"><div className="hw-qsi-v" style={{color:'#c084fc'}}>75%</div><div className="hw-qsi-l">Avg Accuracy</div></div>
              </div>
            </div></div>
            <div className="hw-card"><div className="hw-card-h"><span className="hw-card-t">Due Soon</span></div><div className="hw-card-b">
              {[{t:'Level 3 Mastery',d:'2026-01-20',cls:'hw-st-p',s:'In Progress'},{t:'Scale Recognition Quiz',d:'2026-01-22',cls:'hw-st-n',s:'Pending'},{t:'Weekly Practice Goal',d:'2026-01-19',cls:'hw-st-o',s:'Overdue'}].map(i=>(
                <div key={i.t} className="hw-due"><div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{i.t}</div><div style={{fontSize:11,color:'#9ca3af'}}>{i.d}</div></div><span className={`hw-st ${i.cls}`}>{i.s}</span></div>
              ))}
            </div></div>
            <div className="hw-card"><div className="hw-card-h"><span className="hw-card-t">Quick Actions</span></div><div className="hw-card-b">
              <button className="hw-qa-btn hw-qa-teal" onClick={()=>navigate('/game')}>🎮 Start Practice</button>
              <button className="hw-qa-btn hw-qa-gray" onClick={()=>navigate('/')}>📊 T.A.M.i Dashboard</button>
            </div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
