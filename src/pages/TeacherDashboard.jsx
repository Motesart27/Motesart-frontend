import { useState } from 'react'

const STUDENTS_DATA = [
  { id:1, name:'Emma Rodriguez', initials:'ER', instrument:'Violin', grade:4, dpm:25, dpmColor:'#f87171', drive:18, passion:25, motivation:32, weeklyMin:0, goalMin:150, hw:'0 / 3', status:'critical', statusLabel:'⚠ Critical', avBg:'#dc2626', lastPractice:'14 days ago' },
  { id:2, name:'Tyler Kim', initials:'TK', instrument:'Piano', grade:3, dpm:20, dpmColor:'#f87171', drive:12, passion:20, motivation:28, weeklyMin:0, goalMin:120, hw:'1 / 3', status:'critical', statusLabel:'⚠ Critical', avBg:'#dc2626', lastPractice:'21 days ago' },
  { id:3, name:'Mia Thompson', initials:'MT', instrument:'Cello', grade:5, dpm:28, dpmColor:'#f87171', drive:22, passion:30, motivation:33, weeklyMin:10, goalMin:120, hw:'0 / 2', status:'critical', statusLabel:'⚠ Critical', avBg:'#dc2626', lastPractice:'10 days ago' },
  { id:4, name:'Aiden Jackson', initials:'AJ', instrument:'Guitar', grade:5, dpm:45, dpmColor:'#fb923c', drive:42, passion:55, motivation:38, weeklyMin:35, goalMin:120, hw:'1 / 2', status:'atrisk', statusLabel:'🔔 At Risk', avBg:'#d97706', lastPractice:'5 days ago' },
  { id:5, name:'Zoe Martinez', initials:'ZM', instrument:'Voice', grade:4, dpm:40, dpmColor:'#fb923c', drive:38, passion:48, motivation:35, weeklyMin:25, goalMin:100, hw:'1 / 3', status:'atrisk', statusLabel:'🔔 At Risk', avBg:'#d97706', lastPractice:'6 days ago' },
  { id:6, name:'Noah Davis', initials:'ND', instrument:'Trumpet', grade:6, dpm:42, dpmColor:'#fb923c', drive:40, passion:50, motivation:36, weeklyMin:30, goalMin:120, hw:'1 / 2', status:'atrisk', statusLabel:'🔔 At Risk', avBg:'#d97706', lastPractice:'4 days ago' },
  { id:7, name:'Lily Park', initials:'LP', instrument:'Clarinet', grade:3, dpm:38, dpmColor:'#fb923c', drive:35, passion:44, motivation:34, weeklyMin:20, goalMin:100, hw:'0 / 2', status:'atrisk', statusLabel:'🔔 At Risk', avBg:'#d97706', lastPractice:'7 days ago' },
  { id:8, name:'Ethan Brown', initials:'EB', instrument:'Saxophone', grade:5, dpm:43, dpmColor:'#fb923c', drive:41, passion:49, motivation:39, weeklyMin:32, goalMin:120, hw:'2 / 3', status:'atrisk', statusLabel:'🔔 At Risk', avBg:'#d97706', lastPractice:'3 days ago' },
  { id:9, name:'Sofia Patel', initials:'SP', instrument:'Flute', grade:6, dpm:57, dpmColor:'#facc15', drive:58, passion:62, motivation:50, weeklyMin:65, goalMin:120, hw:'2 / 3', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'2 days ago' },
  { id:10, name:'James Lee', initials:'JL', instrument:'Piano', grade:4, dpm:55, dpmColor:'#facc15', drive:52, passion:60, motivation:53, weeklyMin:60, goalMin:120, hw:'2 / 2', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'1 day ago' },
  { id:11, name:'Ava Wilson', initials:'AW', instrument:'Violin', grade:7, dpm:60, dpmColor:'#facc15', drive:58, passion:65, motivation:56, weeklyMin:70, goalMin:120, hw:'2 / 3', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'Today' },
  { id:12, name:'Oliver Garcia', initials:'OG', instrument:'Guitar', grade:3, dpm:52, dpmColor:'#facc15', drive:50, passion:58, motivation:48, weeklyMin:55, goalMin:100, hw:'1 / 2', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'2 days ago' },
  { id:13, name:'Isabella Nguyen', initials:'IN', instrument:'Harp', grade:6, dpm:54, dpmColor:'#facc15', drive:51, passion:59, motivation:52, weeklyMin:58, goalMin:120, hw:'2 / 3', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'1 day ago' },
  { id:14, name:'Liam Scott', initials:'LS', instrument:'Drums', grade:5, dpm:56, dpmColor:'#facc15', drive:55, passion:61, motivation:51, weeklyMin:62, goalMin:120, hw:'1 / 2', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'Today' },
  { id:15, name:'Chloe Adams', initials:'CA', instrument:'Voice', grade:4, dpm:53, dpmColor:'#facc15', drive:50, passion:57, motivation:52, weeklyMin:56, goalMin:100, hw:'2 / 3', status:'watch', statusLabel:'👀 Watch', avBg:'#a16207', lastPractice:'1 day ago' },
  { id:16, name:'Marcus Williams', initials:'MW', instrument:'Drums', grade:7, dpm:88, dpmColor:'#34d399', drive:85, passion:92, motivation:88, weeklyMin:145, goalMin:120, hw:'3 / 3 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
  { id:17, name:'Luna Chen', initials:'LC', instrument:'Piano', grade:8, dpm:92, dpmColor:'#34d399', drive:90, passion:95, motivation:91, weeklyMin:180, goalMin:150, hw:'3 / 3 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
  { id:18, name:'Harper Jones', initials:'HJ', instrument:'Violin', grade:6, dpm:82, dpmColor:'#34d399', drive:80, passion:85, motivation:81, weeklyMin:130, goalMin:120, hw:'2 / 2 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
  { id:19, name:'Jack Taylor', initials:'JT', instrument:'Cello', grade:7, dpm:86, dpmColor:'#34d399', drive:84, passion:89, motivation:85, weeklyMin:140, goalMin:120, hw:'3 / 3 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
  { id:20, name:'Ella Robinson', initials:'ERo', instrument:'Flute', grade:5, dpm:79, dpmColor:'#34d399', drive:76, passion:83, motivation:78, weeklyMin:115, goalMin:100, hw:'2 / 2 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Yesterday' },
  { id:21, name:'Daniel White', initials:'DW', instrument:'Trumpet', grade:8, dpm:84, dpmColor:'#34d399', drive:82, passion:87, motivation:83, weeklyMin:135, goalMin:120, hw:'3 / 3 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
  { id:22, name:'Grace Kim', initials:'GK', instrument:'Piano', grade:6, dpm:81, dpmColor:'#34d399', drive:79, passion:84, motivation:80, weeklyMin:125, goalMin:120, hw:'2 / 2 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
  { id:23, name:'Ryan Mitchell', initials:'RM', instrument:'Guitar', grade:7, dpm:80, dpmColor:'#34d399', drive:78, passion:83, motivation:79, weeklyMin:122, goalMin:120, hw:'3 / 3 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Yesterday' },
  { id:24, name:'Aria Lopez', initials:'AL', instrument:'Voice', grade:5, dpm:83, dpmColor:'#34d399', drive:81, passion:86, motivation:82, weeklyMin:128, goalMin:100, hw:'2 / 2 ✓', status:'ontrack', statusLabel:'✓ On Track', avBg:'#059669', lastPractice:'Today' },
]

const SCHEDULE = [
  { time:'2:00 PM', name:'Luna Chen', inst:'Piano · 45 min', dot:'done', label:'Done', cls:'sched-complete' },
  { time:'3:00 PM', name:'Marcus Williams', inst:'Drums · 30 min', dot:'done', label:'Done', cls:'sched-complete' },
  { time:'4:00 PM', name:'Emma Rodriguez', inst:'Violin · 45 min', dot:'now', label:'● Live', cls:'sched-live', timeColor:'#34d399' },
  { time:'5:00 PM', name:'Aiden Jackson', inst:'Guitar · 30 min', dot:'upcoming', label:'Next', cls:'sched-next' },
  { time:'5:45 PM', name:'Sofia Patel', inst:'Flute · 30 min', dot:'upcoming', label:'5:45', cls:'sched-next' },
]

const STATUS_STYLES = {
  critical: { background:'rgba(220,38,38,0.2)', color:'#f87171', border:'1px solid rgba(220,38,38,0.3)' },
  atrisk:   { background:'rgba(217,119,6,0.2)', color:'#fb923c', border:'1px solid rgba(217,119,6,0.3)' },
  watch:    { background:'rgba(161,98,7,0.2)',   color:'#facc15', border:'1px solid rgba(161,98,7,0.3)' },
  ontrack:  { background:'rgba(6,95,70,0.2)',    color:'#34d399', border:'1px solid rgba(6,95,70,0.3)' },
}

export default function TeacherDashboard() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const counts = {
    all: STUDENTS_DATA.length,
    critical: STUDENTS_DATA.filter(s=>s.status==='critical').length,
    atrisk: STUDENTS_DATA.filter(s=>s.status==='atrisk').length,
    watch: STUDENTS_DATA.filter(s=>s.status==='watch').length,
    ontrack: STUDENTS_DATA.filter(s=>s.status==='ontrack').length,
  }

  const filtered = STUDENTS_DATA.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.instrument.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const avgDPM = Math.round(STUDENTS_DATA.reduce((a,s)=>a+s.dpm,0)/STUDENTS_DATA.length)
  const avgPractice = Math.round(STUDENTS_DATA.reduce((a,s)=>a+s.weeklyMin,0)/STUDENTS_DATA.length)
  const ringCirc = 2 * Math.PI * 85
  const ringOffset = ringCirc - (ringCirc * avgDPM / 100)

  return (
    <div style={{fontFamily:"'Inter',-apple-system,sans-serif",background:'#0a0e1a',color:'#e2e8f0',minHeight:'100vh',fontSize:13,paddingBottom:80}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fu{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      {/* HEADER */}
      <div style={{background:'#0d1525',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'8px 20px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:200,flexWrap:'wrap'}}>
        <div style={{color:'#9ca3af',cursor:'pointer',fontSize:16}}>←</div>
        <div style={{width:40,height:40,borderRadius:'50%',border:'2px solid rgba(251,191,36,0.55)',boxShadow:'0 0 12px rgba(251,191,36,0.25)',background:'linear-gradient(135deg,#7c3aed,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:'#fff',flexShrink:0}}>JM</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#fff',display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
            Prof. J. Motes
            <span style={{fontSize:9,fontWeight:600,background:'rgba(251,191,36,0.15)',color:'#fbbf24',padding:'2px 7px',borderRadius:4}}>TEACH</span>
          </div>
          <div style={{fontSize:10,color:'#3d4f63',marginTop:1}}>Piano &amp; Theory · {counts.all} Students</div>
        </div>
        <div style={{flex:1,minWidth:8}}></div>
        <div style={{width:32,height:32,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer',position:'relative'}}>
          🔔
          <div style={{position:'absolute',top:5,right:5,width:7,height:7,background:'#ef4444',borderRadius:'50%',border:'1.5px solid #0d1525'}}></div>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {[
            {label:'👁 Student View',cls:{background:'rgba(45,212,191,0.12)',color:'#2dd4bf',border:'1px solid rgba(45,212,191,0.2)'}},
            {label:'🎵 T.A.M.i',cls:{background:'rgba(251,191,36,0.14)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.2)'}},
            {label:'📊 Academic',cls:{background:'rgba(255,255,255,0.06)',color:'#a0aec0',border:'1px solid rgba(255,255,255,0.08)'}},
            {label:'🎮 Game Mode',cls:{background:'#7c3aed',color:'#fff',border:'none'}},
          ].map((b,i) => (
            <button key={i} style={{padding:'6px 11px',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap',...b.cls}}>{b.label}</button>
          ))}
        </div>
      </div>

      {/* PAGE */}
      <div style={{padding:20,maxWidth:1400,margin:'0 auto'}}>

        {/* 1. WELCOME BANNER */}
        <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(45,212,191,0.08))',border:'1px solid rgba(124,58,237,0.2)',borderRadius:16,padding:'22px 26px',marginBottom:18,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap',animation:'fu .3s ease both'}}>
          <div>
            <h2 style={{fontSize:20,fontWeight:800,color:'#fff',marginBottom:4}}>Good evening, Prof. Motes 🎹</h2>
            <p style={{fontSize:12,color:'#9ca3af',margin:0}}>You have <span style={{color:'#2dd4bf',fontWeight:600}}>3 lessons today</span> · Next: Emma Rodriguez at 4:00 PM</p>
          </div>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            {[
              {num:counts.all,label:'Students',color:'#a78bfa'},
              {num:avgPractice+'min',label:'Avg Practice/Wk',color:'#2dd4bf'},
              {num:'72%',label:'HW Completion',color:'#34d399'},
              {num:counts.critical,label:'Need Attention',color:'#fbbf24'},
            ].map((q,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'14px 18px',minWidth:120,textAlign:'center'}}>
                <div style={{fontSize:24,fontWeight:800,lineHeight:1,marginBottom:4,color:q.color}}>{q.num}</div>
                <div style={{fontSize:10,color:'#9ca3af',fontWeight:500}}>{q.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. QUICK ACTIONS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:22}}>
          {[
            {icon:'➕',iconBg:'rgba(124,58,237,0.2)',text:'Add Student',sub:'Enroll new student'},
            {icon:'📝',iconBg:'rgba(45,212,191,0.15)',text:'Create Assignment',sub:'Assign to class or student'},
            {icon:'📅',iconBg:'rgba(251,191,36,0.15)',text:"Today's Schedule",sub:'3 lessons remaining'},
            {icon:'📊',iconBg:'rgba(59,130,246,0.15)',text:'Generate Report',sub:'Weekly T.A.M.i summary'},
          ].map((a,i)=>(
            <div key={i} style={{background:'#131c2e',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:16,cursor:'pointer',display:'flex',alignItems:'center',gap:12,animation:`fu .3s ease ${.04*(i+1)}s both`}}>
              <div style={{width:42,height:42,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0,background:a.iconBg}}>{a.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>{a.text}</div>
                <div style={{fontSize:10,color:'#6b7280',marginTop:2}}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. STUDENT ROSTER */}
        <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
          🎓 Student Roster
          <span style={{fontSize:11,fontWeight:600,color:'#9ca3af',background:'rgba(255,255,255,0.06)',padding:'2px 8px',borderRadius:10}}>{filtered.length} students</span>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search students by name, instrument..."
            style={{flex:1,minWidth:200,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'9px 14px',color:'#fff',fontSize:12,outline:'none'}}
          />
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[
              {key:'all',label:'All',count:counts.all},
              {key:'critical',label:'🔴 Critical',count:counts.critical},
              {key:'atrisk',label:'🟠 At Risk',count:counts.atrisk},
              {key:'watch',label:'🟡 Watch',count:counts.watch},
              {key:'ontrack',label:'🟢 On Track',count:counts.ontrack},
            ].map(f=>(
              <div key={f.key} onClick={()=>setFilter(f.key)} style={{padding:'5px 12px',borderRadius:16,border:filter===f.key?'1px solid #7c3aed':'1px solid rgba(255,255,255,0.1)',background:filter===f.key?'#7c3aed':'rgba(255,255,255,0.05)',color:filter===f.key?'#fff':'#9ca3af',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                {f.label}
                <span style={{background:filter===f.key?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.15)',borderRadius:8,padding:'1px 5px',fontSize:9,fontWeight:700}}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'#131c2e',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,overflow:'hidden',marginBottom:22,animation:'fu .3s ease both'}}>
          <div style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 100px',padding:'10px 16px',fontSize:10,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:0.5,borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)'}}>
            <div>Student</div><div>DPM Score</div><div>Weekly Practice</div><div>Homework</div><div>Status</div><div>Actions</div>
          </div>
          {filtered.map(s=>(
            <div key={s.id} style={{display:'grid',gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 100px',padding:'12px 16px',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff',flexShrink:0,background:s.avBg}}>{s.initials}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>{s.name}</div>
                  <div style={{fontSize:10,color:'#6b7280'}}>{s.instrument} · Grade {s.grade}</div>
                </div>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:s.dpmColor}}>{s.dpm}%</div>
              <div style={{fontSize:12,color:'#9ca3af'}}>{s.weeklyMin} / {s.goalMin} min</div>
              <div style={{fontSize:12,color:'#9ca3af'}}>{s.hw}</div>
              <div>
                <span style={{padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,display:'inline-flex',alignItems:'center',gap:3,...STATUS_STYLES[s.status]}}>{s.statusLabel}</span>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button style={{width:30,height:30,borderRadius:7,border:'none',background:'rgba(255,255,255,0.06)',color:'#9ca3af',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer'}} title="View">📊</button>
                <button style={{width:30,height:30,borderRadius:7,border:'none',background:'rgba(255,255,255,0.06)',color:'#9ca3af',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer'}} title="Message">💬</button>
                <button style={{width:30,height:30,borderRadius:7,border:'none',background:'rgba(255,255,255,0.06)',color:'#9ca3af',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,cursor:'pointer'}} title="Remove">✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM: Schedule + Homework side by side */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18}}>

          {/* 4. TODAY'S SCHEDULE */}
          <div style={{background:'#131c2e',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:18,animation:'fu .3s ease both'}}>
            <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>📅 Today's Schedule</div>
            {SCHEDULE.map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<SCHEDULE.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                <div style={{fontSize:11,fontWeight:700,color:s.timeColor||'#a78bfa',minWidth:60,textAlign:'center'}}>{s.time}</div>
                <div style={{width:8,height:8,borderRadius:'50%',flexShrink:0,background:s.dot==='now'?'#34d399':s.dot==='done'?'rgba(255,255,255,0.15)':'#6b7280',boxShadow:s.dot==='now'?'0 0 8px rgba(52,211,153,0.5)':'none'}}></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>{s.name}</div>
                  <div style={{fontSize:10,color:'#6b7280'}}>{s.inst}</div>
                </div>
                <span style={{fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:5,
                  background:s.cls==='sched-live'?'rgba(52,211,153,0.15)':s.cls==='sched-complete'?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.06)',
                  color:s.cls==='sched-live'?'#34d399':s.cls==='sched-complete'?'#4b5563':'#9ca3af'
                }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* 5. HOMEWORK TRACKER */}
          <div style={{background:'#131c2e',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:18,animation:'fu .3s ease both'}}>
            <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>📝 Homework Tracker</div>
            <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
              {[
                {num:12,label:'Assigned',color:'#a78bfa'},
                {num:8,label:'Submitted',color:'#2dd4bf'},
                {num:5,label:'Graded',color:'#34d399'},
                {num:4,label:'Overdue',color:'#f87171'},
              ].map((h,i)=>(
                <div key={i} style={{flex:1,minWidth:70,textAlign:'center',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:10,padding:'12px 8px'}}>
                  <div style={{fontSize:22,fontWeight:800,lineHeight:1,marginBottom:3,color:h.color}}>{h.num}</div>
                  <div style={{fontSize:9,color:'#6b7280',fontWeight:500,textTransform:'uppercase',letterSpacing:0.3}}>{h.label}</div>
                </div>
              ))}
            </div>
            {[
              {label:'Submitted',pct:67,grad:'linear-gradient(90deg,#7c3aed,#2dd4bf)'},
              {label:'Graded',pct:42,grad:'linear-gradient(90deg,#7c3aed,#a78bfa)'},
              {label:'Overdue',pct:33,grad:'linear-gradient(90deg,#dc2626,#f87171)'},
            ].map((b,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#9ca3af',marginBottom:4}}>
                  <span>{b.label}</span><span>{b.pct}%</span>
                </div>
                <div style={{height:8,background:'rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:4,width:`${b.pct}%`,background:b.grad}}></div>
                </div>
              </div>
            ))}
            <div style={{marginTop:14,fontSize:11,color:'#6b7280',padding:'8px 10px',background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.04)'}}>
              ⚡ <span style={{color:'#fbbf24'}}>4 overdue</span> assignments need follow-up
            </div>
          </div>
        </div>

        {/* 6. CLASS DPM HEALTH — Full Width */}
        <div style={{background:'#131c2e',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:24,animation:'fu .3s ease both'}}>
          <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>🎯 Class DPM Health</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:50,flexWrap:'wrap'}}>
            <div style={{position:'relative',width:200,height:200}}>
              <svg width="200" height="200" style={{transform:'rotate(-90deg)'}}>
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#2dd4bf"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#ringGrad)" strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={ringCirc} strokeDashoffset={ringOffset} style={{transition:'stroke-dashoffset .6s'}}/>
              </svg>
              <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
                <div style={{fontSize:42,fontWeight:900,color:'#fff',lineHeight:1}}>{avgDPM}</div>
                <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Class DPM</div>
              </div>
            </div>
            <div style={{width:'100%',maxWidth:320}}>
              {[
                {dot:'#a78bfa',label:'Avg Drive',val:'68%',valColor:'#fff'},
                {dot:'#2dd4bf',label:'Avg Passion',val:'74%',valColor:'#fff'},
                {dot:'#fbbf24',label:'Avg Motivation',val:'71%',valColor:'#fff'},
                {dot:'#34d399',label:'On Track',val:`${counts.ontrack} students (${Math.round(counts.ontrack/counts.all*100)}%)`,valColor:'#34d399'},
                {dot:'#facc15',label:'Watch',val:`${counts.watch} students (${Math.round(counts.watch/counts.all*100)}%)`,valColor:'#facc15'},
                {dot:'#fb923c',label:'At Risk',val:`${counts.atrisk} students (${Math.round(counts.atrisk/counts.all*100)}%)`,valColor:'#fb923c'},
                {dot:'#f87171',label:'Critical',val:`${counts.critical} students (${Math.round(counts.critical/counts.all*100)}%)`,valColor:'#f87171'},
              ].map((p,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:i<6?'1px solid rgba(255,255,255,0.04)':'none',fontSize:12}}>
                  <span style={{color:'#9ca3af',display:'flex',alignItems:'center'}}>
                    <span style={{width:8,height:8,borderRadius:'50%',marginRight:8,flexShrink:0,background:p.dot}}></span>
                    {p.label}
                  </span>
                  <span style={{fontWeight:700,color:p.valColor}}>{p.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* TAMI FAB */}
      <div style={{position:'fixed',bottom:24,right:20,width:50,height:50,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#db2777)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',zIndex:300,boxShadow:'0 4px 18px rgba(124,58,237,0.45)',fontSize:20,color:'#fff'}}>
        🎵
      </div>
    </div>
  )
}
