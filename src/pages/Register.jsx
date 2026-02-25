import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://deployable-python-codebase-som-production.up.railway.app';

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1117 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'DM Sans', sans-serif",
    color: '#e2e8f0',
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '16px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '20px',
    color: '#fff',
  },
  titleAccent: { color: '#9f7aea' },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#161b26',
    borderRadius: '24px',
    border: '1px solid rgba(99,179,237,0.12)',
    padding: '28px 24px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
  },
  stepLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '9px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#4ecdc4',
    marginBottom: '14px',
  },
  progress: {
    display: 'flex',
    gap: '5px',
    marginBottom: '22px',
    justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '22px',
    fontWeight: 800,
    marginBottom: '4px',
  },
  stepSub: {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  fieldWrap: { marginBottom: '14px' },
  label: {
    display: 'block',
    fontSize: '10px',
    color: '#718096',
    marginBottom: '5px',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    background: '#1c2333',
    border: '1px solid rgba(99,179,237,0.15)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputFocus: { borderColor: '#4ecdc4' },
  row: { display: 'flex', gap: '10px' },
  btnRow: { display: 'flex', gap: '10px', marginTop: '8px' },
  btnPrimary: {
    flex: 1,
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #38b2ac, #4ecdc4)',
    color: '#0d1117',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
  },
  btnSecondary: {
    flex: 1,
    padding: '13px',
    borderRadius: '12px',
    border: '1px solid rgba(99,179,237,0.15)',
    background: '#1c2333',
    color: '#718096',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
  btnFull: {
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #38b2ac, #4ecdc4)',
    color: '#0d1117',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '6px',
  },
  error: {
    background: 'rgba(252,129,74,0.1)',
    border: '1px solid rgba(252,129,74,0.3)',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '12px',
    color: '#fc814a',
    marginBottom: '14px',
  },
};

// ── Progress dots ─────────────────────────────────────────────────────────────
function ProgressDots({ current, total }) {
  return (
    <div style={S.progress}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: '5px',
          borderRadius: '3px',
          background: i < current ? 'rgba(56,178,172,0.5)' : i === current ? '#4ecdc4' : '#2d3748',
          width: i === current ? '28px' : '16px',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );
}

// ── Chip selector ─────────────────────────────────────────────────────────────
function Chips({ options, value, onChange, multi = false }) {
  const toggle = (opt) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt]);
    } else {
      onChange(opt);
    }
  };
  const isSelected = (opt) => multi ? (Array.isArray(value) && value.includes(opt)) : value === opt;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
      {options.map(opt => (
        <div key={opt} onClick={() => toggle(opt)} style={{
          padding: '6px 12px',
          borderRadius: '8px',
          border: `1.5px solid ${isSelected(opt) ? '#4ecdc4' : 'rgba(99,179,237,0.15)'}`,
          background: isSelected(opt) ? 'rgba(78,205,196,0.1)' : '#1c2333',
          color: isSelected(opt) ? '#4ecdc4' : '#718096',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
          {opt}
        </div>
      ))}
    </div>
  );
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={S.fieldWrap}>
      {label && <label style={S.label}>{label}</label>}
      {children}
    </div>
  );
}

// ── WYL Questions data ────────────────────────────────────────────────────────
const WYL_QUESTIONS = [
  {
    id: 'q1', emoji: '🎮',
    text: "You want to learn a speed boost in Mario Kart. Do you:",
    options: ['A. Watch a video online', 'B. Figure it out by trying', 'C. Ask someone to explain it'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q2', emoji: '🗺️',
    text: "You've just arrived in a new town. How do you find the supermarket?",
    options: ['A. Find and follow a map', 'B. Walk and figure it out using landmarks', 'C. Ask someone for directions'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q3', emoji: '🔤',
    text: "When you're not sure how to spell a word, what do you do?",
    options: ['A. Write it down and see what it looks like', 'B. Trace the letters in the air', 'C. Spell it out loud to hear if it sounds right'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q4', emoji: '📞',
    text: "You make a new friend — how do you remember their phone number?",
    options: ['A. Write it down', 'B. Practice dialing out the numbers', 'C. Keep saying it out loud over and over'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q5', emoji: '📚',
    text: "What do you find most distracting when trying to study?",
    options: ['A. People walking past', 'B. An uncomfortable chair', 'C. Loud noises'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q6', emoji: '🤝',
    text: "When you meet someone new, what are you most likely to remember?",
    options: ['A. Their face', 'B. What they did', 'C. Their name'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q7', emoji: '📱',
    text: "You're buying a new phone. What helps you choose (other than price)?",
    options: ['A. Reading online reviews', 'B. Trying or testing it', 'C. A friend explaining the features'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q8', emoji: '🎤',
    text: "You're doing a presentation. How do you learn it?",
    options: ['A. Flash cards', 'B. Practice delivering it out loud', 'C. Record yourself and listen back'],
    scores: ['visual', 'kinesthetic', 'auditory'],
  },
  {
    id: 'q9', emoji: '🧩',
    text: "You've been given a challenging task. How do you prefer to learn how to do it?",
    options: ['A. Get someone to show you and talk you through it', 'B. Read detailed step-by-step instructions', 'C. Try it yourself first, then ask for help'],
    scores: ['auditory', 'visual', 'kinesthetic'],
  },
  {
    id: 'q10', emoji: '📅',
    text: "How do you typically remember important dates (birthdays, appointments)?",
    options: ['A. Write them down or use a planner', 'B. Repeat them out loud or tell someone', 'C. Set up physical reminders like post-it notes'],
    scores: ['visual', 'auditory', 'kinesthetic'],
  },
];

// ── Music Assessment Questions ────────────────────────────────────────────────
const MUSIC_QUESTIONS = [
  { id: 'mq1', text: 'How long have you been learning piano?', options: ['Less than 6 months', '6 months to 2 years', 'More than 2 years'] },
  { id: 'mq2', text: 'Can you read sheet music?', options: ['Not at all', 'With some difficulty', 'Comfortably'] },
  { id: 'mq3', text: 'How confident are you identifying notes on the piano?', options: ['Not confident', 'Somewhat confident', 'Very confident'] },
  { id: 'mq4', text: 'How often do you practice piano each week?', options: ['Less than 1 hour', '1–3 hours', 'More than 3 hours'] },
  { id: 'mq5', text: 'Can you play basic scales and chords?', options: ['No', 'Yes, but with difficulty', 'Yes, comfortably'] },
  { id: 'mq6', text: 'Do you have experience playing pieces hands together?', options: ['Not at all', 'Some experience', 'Comfortable with it'] },
  { id: 'mq7', text: 'Are you familiar with musical terminology (tempo, dynamics)?', options: ['Not at all', 'Somewhat', 'Very familiar'] },
  { id: 'mq8', text: 'Can you play pieces from memory?', options: ['No', 'Yes, simple pieces', 'Yes, more complex pieces'] },
  { id: 'mq9', text: 'How comfortable are you with sight-reading new music?', options: ['Not comfortable', 'Somewhat comfortable', 'Very comfortable'] },
  { id: 'mq10', text: 'What is your goal with learning piano?', options: ['Just for fun', 'To play for friends/family', 'To perform or take exams'] },
];

// ── Avatars ───────────────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'lyric',  emoji: '👩🏿‍🎤', name: 'Lyric',  role: 'The Storyteller' },
  { id: 'jazz',   emoji: '👦🏽',   name: 'Jazz',   role: 'The Performer' },
  { id: 'coda',   emoji: '👧🏻',   name: 'Coda',   role: 'The Dreamer' },
  { id: 'forte',  emoji: '🧑🏾',   name: 'Forte',  role: 'The Rockstar' },
  { id: 'sol',    emoji: '👧🏾',   name: 'Sol',    role: 'The Composer' },
  { id: 'riff',   emoji: '👦🏻',   name: 'Riff',   role: 'The Freestyler' },
];

// ── Compute WYL result ────────────────────────────────────────────────────────
function computeWYL(answers) {
  const tally = { visual: 0, kinesthetic: 0, auditory: 0 };
  WYL_QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (ans !== undefined) {
      const styleIndex = ans;
      const style = q.scores[styleIndex];
      if (style) tally[style]++;
    }
  });
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Register Component
// ══════════════════════════════════════════════════════════════════════════════
export default function Register() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wylStarted, setWylStarted] = useState(false);
  const [showWylModal, setShowWylModal] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', displayName: '',
    email: '', phone: '', password: '',
    role: 'student',
    dob: '', grade: '', genre: '', favoriteSong: '',
    instrument: 'Piano', level: 'Beginner', weeklyTarget: 60,
    wylAnswers: {},
    musicAnswers: {},
    avatar: 'lyric',
    avatarCustom: null,
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const totalSteps = 7;

  // Determine if WYL is required (teacher-enrolled = role is 'student-teacher')
  // For now: self-registered student → optional, else skip
  const isStudent = form.role === 'student';
  const isTeacherEnrolled = form.role === 'student-teacher';

  // ── Navigation ──────────────────────────────────────────────────────────────
  const next = () => { setError(''); setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  // ── Step validation ─────────────────────────────────────────────────────────
  const validate = () => {
    if (step === 0) {
      if (!form.firstName.trim()) return 'First name is required';
      if (!form.email.trim()) return 'Email is required';
      if (!form.password.trim() || form.password.length < 6) return 'Password must be at least 6 characters';
    }
    if (step === 2) {
      if (!form.dob) return 'Date of birth is required';
      if (!form.grade.trim()) return 'Grade level is required';
      if (!form.genre.trim()) return 'Favorite genre is required';
      if (!form.favoriteSong.trim()) return 'Favorite song is required';
    }
    if (step === 3 && (isTeacherEnrolled || wylStarted)) {
      const answered = Object.keys(form.wylAnswers).length;
      if (answered < WYL_QUESTIONS.length) return `Please answer all ${WYL_QUESTIONS.length} WYL questions (${answered}/${WYL_QUESTIONS.length} done)`;
    }
    if (step === 4) {
      const answered = Object.keys(form.musicAnswers).length;
      if (answered < MUSIC_QUESTIONS.length) return `Please answer all ${MUSIC_QUESTIONS.length} music questions (${answered}/${MUSIC_QUESTIONS.length} done)`;
    }
    return null;
  };

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    next();
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const username = form.displayName.trim() || `${form.firstName} ${form.lastName}`.trim();
      const wylResult = Object.keys(form.wylAnswers).length > 0 ? computeWYL(form.wylAnswers) : null;

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password: form.password,
          role: form.role,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
          grade: form.grade,
          genre: form.genre,
          favoriteSong: form.favoriteSong,
          instrument: form.instrument,
          level: form.level,
          weeklyTarget: form.weeklyTarget,
          wylResult,
          wylAnswers: form.wylAnswers,
          musicAnswers: form.musicAnswers,
          avatar: form.avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');

      // Save user to localStorage and navigate
      localStorage.setItem('user', JSON.stringify(data.user));
      const routes = { teacher: '/teacher', admin: '/admin', ambassador: '/ambassador', parent: '/parent', student: '/student' }; navigate(routes[form.role] || '/student');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Handle avatar upload ────────────────────────────────────────────────────
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('avatarCustom', ev.target.result);
    reader.readAsDataURL(file);
    set('avatar', 'custom');
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Render steps
  // ══════════════════════════════════════════════════════════════════════════

  const renderStep = () => {
    switch (step) {

      // ── Step 1: Profile ──────────────────────────────────────────────────
      case 0: return (
        <>
          <div style={S.stepTitle}>Set up your profile</div>
          <div style={S.stepSub}>Tell us a bit about yourself</div>
          <div style={S.row}>
            <Field label="First Name *">
              <input style={S.input} placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
            </Field>
            <Field label="Last Name *">
              <input style={S.input} placeholder="Doe" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
            </Field>
          </div>
          <Field label="Display Name (optional)">
            <input style={S.input} placeholder="How you'll appear in the app" value={form.displayName} onChange={e => set('displayName', e.target.value)} />
          </Field>
          <Field label="Email *">
            <input style={S.input} type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Phone (optional)">
            <input style={S.input} placeholder="+1 (555) 123-4567" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </Field>
          <Field label="Password *">
            <input style={S.input} type="password" placeholder="At least 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          </Field>
          {error && <div style={S.error}>{error}</div>}
          <button style={S.btnFull} onClick={handleNext}>Continue →</button>
          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: '#718096' }}>
            Already have an account?{' '}
            <span style={{ color: '#4ecdc4', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in</span>
          </div>
        </>
      );

      // ── Step 2: Role ─────────────────────────────────────────────────────
      case 1: return (
        <>
          <div style={S.stepTitle}>Choose your role</div>
          <div style={S.stepSub}>How will you use School of Motesart?</div>
          {/* Main 4 roles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            {[
              { id: 'student',    icon: '🎹', name: 'Student',    desc: 'Learn & practice music' },
              { id: 'parent',     icon: '👨‍👩‍👧', name: 'Parent',     desc: 'Monitor your child' },
              { id: 'teacher',    icon: '👩‍🏫', name: 'Teacher',    desc: 'Manage students' },
              { id: 'ambassador', icon: '⭐', name: 'Ambassador', desc: 'Grow the community' },
            ].map(r => (
              <div key={r.id} onClick={() => set('role', r.id)} style={{
                border: `2px solid ${form.role === r.id ? '#4ecdc4' : 'rgba(99,179,237,0.15)'}`,
                borderRadius: '14px',
                padding: '14px 12px',
                cursor: 'pointer',
                background: form.role === r.id ? 'rgba(78,205,196,0.07)' : '#1c2333',
              }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{r.icon}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: '10px', color: '#718096', marginTop: '2px' }}>{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Admin — small, tucked below */}
          <div onClick={() => set('role', 'admin')} style={{
            border: `2px solid ${form.role === 'admin' ? '#9f7aea' : 'rgba(159,122,234,0.15)'}`,
            borderRadius: '12px',
            padding: '10px 14px',
            cursor: 'pointer',
            background: form.role === 'admin' ? 'rgba(159,122,234,0.07)' : '#1c2333',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
          }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700, color: form.role === 'admin' ? '#9f7aea' : '#e2e8f0' }}>Admin</div>
              <div style={{ fontSize: '9px', color: '#718096' }}>Read-only access to all dashboards & data</div>
            </div>
            {form.role === 'admin' && <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#9f7aea' }}>✓</div>}
          </div>

          {isStudent && (
            <div style={{ fontSize: '10px', color: '#718096', textAlign: 'center', marginBottom: '12px', lineHeight: '1.6' }}>
              🎹 Selecting <strong style={{ color: '#e2e8f0' }}>Student</strong> — the WYL Assessment will be optional
            </div>
          )}
          {error && <div style={S.error}>{error}</div>}
          <div style={S.btnRow}>
            <button style={S.btnSecondary} onClick={back}>← Back</button>
            <button style={S.btnPrimary} onClick={handleNext}>Continue →</button>
          </div>
        </>
      );

      // ── Step 3: Music Journey ─────────────────────────────────────────────
      case 2: return (
        <>
          <div style={S.stepTitle}>Your music journey</div>
          <div style={S.stepSub}>Help T.A.M.i personalize your experience</div>
          <Field label="Date of Birth *">
            <input style={S.input} type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
          </Field>
          <Field label="Grade Level *">
            <input style={S.input} placeholder="e.g. 5th Grade" value={form.grade} onChange={e => set('grade', e.target.value)} />
          </Field>
          <Field label="Favorite Music Genre *">
            <input style={S.input} placeholder="e.g. R&B, Classical, Pop" value={form.genre} onChange={e => set('genre', e.target.value)} />
          </Field>
          <Field label="Favorite Song *">
            <input style={S.input} placeholder="e.g. Moonlight Sonata" value={form.favoriteSong} onChange={e => set('favoriteSong', e.target.value)} />
          </Field>
          <Field label="Primary Instrument">
            <select style={S.input} value={form.instrument} onChange={e => set('instrument', e.target.value)}>
              {['Piano','Organ','Guitar','Violin','Drums','Bass','Voice','Trumpet','Flute','Saxophone'].map(i => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </Field>
          <Field label="Experience Level">
            <Chips options={['Beginner','Intermediate','Advanced']} value={form.level} onChange={v => set('level', v)} />
          </Field>
          <Field label={`Weekly Practice Target: ${form.weeklyTarget} min`}>
            <input type="range" min="15" max="120" step="15" value={form.weeklyTarget}
              onChange={e => set('weeklyTarget', parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#4ecdc4' }} />
          </Field>
          {error && <div style={S.error}>{error}</div>}
          <div style={S.btnRow}>
            <button style={S.btnSecondary} onClick={back}>← Back</button>
            <button style={S.btnPrimary} onClick={handleNext}>Continue →</button>
          </div>
        </>
      );

      // ── Step 4: WYL Assessment ────────────────────────────────────────────
      case 3: return (
        <>
          <div style={S.stepTitle}>Way You Learn</div>
          <div style={S.stepSub}>Helps T.A.M.i teach in the way that works best for you</div>

          {/* Optional card for self-registered students */}
          {isStudent && !wylStarted && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(78,205,196,0.08), rgba(99,179,237,0.04))',
              border: '1px solid rgba(78,205,196,0.25)',
              borderRadius: '16px',
              padding: '22px 18px',
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧠</div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(78,205,196,0.15)',
                color: '#4ecdc4',
                fontSize: '9px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                padding: '3px 12px',
                borderRadius: '20px',
                marginBottom: '12px',
                fontFamily: "'Outfit', sans-serif",
              }}>Optional</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '17px', fontWeight: 800, marginBottom: '10px' }}>
                Way You Learn Assessment
              </div>
              <div style={{ fontSize: '12px', color: '#718096', lineHeight: '1.7', marginBottom: '18px' }}>
                10 quick questions help T.A.M.i understand how you learn best — so lessons feel made just for you.
                You can always take it later from your dashboard.
              </div>
              <div style={S.btnRow}>
                <button style={S.btnSecondary} onClick={() => { set('wylAnswers', {}); next(); }}>
                  Skip for now
                </button>
                <button style={S.btnPrimary} onClick={() => setWylStarted(true)}>
                  Take Assessment
                </button>
              </div>
            </div>
          )}

          {/* Required banner for teacher-enrolled */}
          {isTeacherEnrolled && !wylStarted && (
            <div style={{
              background: 'rgba(246,173,85,0.08)',
              border: '1px solid rgba(246,173,85,0.3)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '14px',
            }}>
              <div style={{ fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f6ad55', marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>Required by your teacher</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Way You Learn Assessment</div>
              <div style={{ fontSize: '11px', color: '#718096' }}>Your teacher needs this to personalize your lessons. It only takes 2 minutes!</div>
            </div>
          )}

          {/* Questions — shown once started or if teacher-enrolled */}
          {(wylStarted || isTeacherEnrolled) && WYL_QUESTIONS.map((q, qi) => (
            <div key={q.id} style={{
              background: '#1c2333',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '10px',
              border: '1px solid rgba(99,179,237,0.1)',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '10px', lineHeight: '1.5' }}>
                {q.emoji} {q.text}
              </div>
              {q.options.map((opt, oi) => (
                <div key={oi} onClick={() => set('wylAnswers', { ...form.wylAnswers, [q.id]: oi })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 10px', borderRadius: '8px',
                    background: form.wylAnswers[q.id] === oi ? 'rgba(78,205,196,0.1)' : 'transparent',
                    color: form.wylAnswers[q.id] === oi ? '#4ecdc4' : '#718096',
                    fontSize: '11px', cursor: 'pointer', marginBottom: '3px',
                  }}>
                  <div style={{
                    width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${form.wylAnswers[q.id] === oi ? '#4ecdc4' : 'rgba(99,179,237,0.2)'}`,
                    background: form.wylAnswers[q.id] === oi ? '#4ecdc4' : 'transparent',
                  }} />
                  {opt}
                </div>
              ))}
            </div>
          ))}

          {error && <div style={S.error}>{error}</div>}

          {(wylStarted || isTeacherEnrolled) && (
            <div style={S.btnRow}>
              <button style={S.btnSecondary} onClick={back}>← Back</button>
              <button style={S.btnPrimary} onClick={handleNext}>Continue →</button>
            </div>
          )}

          {isStudent && !wylStarted && (
            <div style={{ marginTop: '8px' }}>
              <button style={S.btnSecondary} onClick={back}>← Back</button>
            </div>
          )}
        </>
      );

      // ── Step 5: Music Assessment ──────────────────────────────────────────
      case 4: return (
        <>
          <div style={S.stepTitle}>Music Assessment</div>
          <div style={S.stepSub}>Helps T.A.M.i set your perfect starting point</div>
          {MUSIC_QUESTIONS.map((q) => (
            <div key={q.id} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>{q.text}</div>
              <Chips
                options={q.options}
                value={form.musicAnswers[q.id]}
                onChange={v => set('musicAnswers', { ...form.musicAnswers, [q.id]: v })}
              />
            </div>
          ))}
          {error && <div style={S.error}>{error}</div>}
          <div style={S.btnRow}>
            <button style={S.btnSecondary} onClick={back}>← Back</button>
            <button style={S.btnPrimary} onClick={handleNext}>Continue →</button>
          </div>
        </>
      );

      // ── Step 6: Avatar ────────────────────────────────────────────────────
      case 5: return (
        <>
          <div style={S.stepTitle}>Choose your avatar</div>
          <div style={S.stepSub}>Pick a character or upload your own</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {AVATARS.map(av => (
              <div key={av.id} onClick={() => { set('avatar', av.id); set('avatarCustom', null); }}
                style={{
                  background: form.avatar === av.id ? 'rgba(78,205,196,0.07)' : '#1c2333',
                  border: `2px solid ${form.avatar === av.id ? '#4ecdc4' : 'rgba(99,179,237,0.15)'}`,
                  borderRadius: '16px',
                  padding: '16px 8px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: form.avatar === av.id ? '0 0 18px rgba(78,205,196,0.18)' : 'none',
                }}>
                {form.avatar === av.id && (
                  <div style={{ position: 'absolute', top: '7px', right: '9px', fontSize: '9px', color: '#4ecdc4', fontWeight: 700 }}>✓</div>
                )}
                <div style={{ fontSize: '36px', marginBottom: '7px' }}>{av.emoji}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700 }}>{av.name}</div>
                <div style={{ fontSize: '9px', color: '#718096', marginTop: '2px' }}>{av.role}</div>
              </div>
            ))}
          </div>

          {/* Upload custom */}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          <div onClick={() => fileRef.current.click()} style={{
            border: `2px dashed ${form.avatar === 'custom' ? '#4ecdc4' : 'rgba(99,179,237,0.2)'}`,
            borderRadius: '14px',
            padding: '18px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '16px',
            background: form.avatar === 'custom' ? 'rgba(78,205,196,0.05)' : 'transparent',
          }}>
            {form.avatarCustom ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <img src={form.avatarCustom} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} alt="custom" />
                <div>
                  <div style={{ fontSize: '12px', color: '#4ecdc4', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Custom image selected ✓</div>
                  <div style={{ fontSize: '10px', color: '#718096', marginTop: '2px' }}>Click to change</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '22px', marginBottom: '5px' }}>📷</div>
                <div style={{ fontSize: '12px', color: '#4ecdc4', fontFamily: "'Outfit', sans-serif", fontWeight: 600, marginBottom: '2px' }}>Upload your own photo or image</div>
                <div style={{ fontSize: '9px', color: '#718096' }}>JPG, PNG or GIF · Max 5MB</div>
              </>
            )}
          </div>

          <div style={S.btnRow}>
            <button style={S.btnSecondary} onClick={back}>← Back</button>
            <button style={S.btnPrimary} onClick={handleNext}>Continue →</button>
          </div>
        </>
      );

      // ── Step 7: Confirm ───────────────────────────────────────────────────
      case 6:
        const selectedAvatar = AVATARS.find(a => a.id === form.avatar);
        const wylResult = Object.keys(form.wylAnswers).length > 0 ? computeWYL(form.wylAnswers) : null;
        const wylLabels = { visual: 'Visual 👁️', kinesthetic: 'Kinesthetic 🤸', auditory: 'Auditory 👂' };
        return (
          <>
            <div style={S.stepTitle}>Confirm your profile</div>
            <div style={S.stepSub}>Make sure everything looks right</div>

            {/* Profile card */}
            <div style={{ background: '#1c2333', borderRadius: '14px', padding: '16px', marginBottom: '10px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              {form.avatarCustom
                ? <img src={form.avatarCustom} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
                : <div style={{ fontSize: '42px' }}>{selectedAvatar?.emoji || '🎹'}</div>
              }
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 800 }}>
                  {form.displayName || `${form.firstName} ${form.lastName}`}
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>{form.email}</div>
                <div style={{ display: 'inline-block', background: 'rgba(78,205,196,0.15)', color: '#4ecdc4', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', marginTop: '5px', fontFamily: "'Outfit', sans-serif", textTransform: 'capitalize' }}>{form.role}</div>
              </div>
            </div>

            {/* Music */}
            <div style={{ background: '#1c2333', borderRadius: '12px', padding: '12px', marginBottom: '8px', fontSize: '11px', color: '#718096', lineHeight: '1.9' }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: '#e2e8f0', marginBottom: '4px', fontWeight: 700 }}>🎵 Music Profile</div>
              Instrument: {form.instrument} · Level: {form.level}<br />
              Weekly Goal: {form.weeklyTarget} min · Favorite: {form.genre}
            </div>

            {/* WYL result — clickable to open modal */}
            {wylResult ? (
              <div onClick={() => setShowWylModal(true)} style={{
                background: '#1c2333', borderRadius: '12px', padding: '12px',
                marginBottom: '8px', fontSize: '11px', color: '#718096', lineHeight: '1.9',
                cursor: 'pointer', border: '1px solid rgba(78,205,196,0.15)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: '#e2e8f0', fontWeight: 700 }}>🧠 Learning Style</div>
                  <div style={{ fontSize: '9px', color: '#4ecdc4', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>Tap to learn more →</div>
                </div>
                Primary style: <span style={{ color: '#4ecdc4' }}>{wylLabels[wylResult]}</span> learner
              </div>
            ) : (
              <div style={{ background: '#1c2333', borderRadius: '12px', padding: '12px', marginBottom: '8px', fontSize: '11px', color: '#718096' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: '#e2e8f0', marginBottom: '4px', fontWeight: 700 }}>🧠 Learning Style</div>
                WYL Assessment skipped — complete later from your dashboard
              </div>
            )}

            {error && <div style={S.error}>{error}</div>}
            <div style={S.btnRow}>
              <button style={S.btnSecondary} onClick={back}>← Back</button>
              <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating account...' : 'Finish Setup ✓'}
              </button>
            </div>
          </>
        );

      default: return null;
    }
  };

  // ── WYL Modal content ────────────────────────────────────────────────────────
  const WYL_INFO = {
    visual: {
      emoji: '👁️',
      label: 'Visual Learner',
      color: '#63b3ed',
      tagline: 'You learn best by seeing.',
      description: 'Visual learners process information most effectively through images, diagrams, written notes, and seeing patterns. When you read sheet music, watch a teacher demonstrate technique, or follow along with a video, your brain is firing on all cylinders.',
      howTami: [
        'Show you visual diagrams of hand positions and music theory concepts',
        'Use color-coded sheet music and notation breakdowns',
        'Send you video references and visual practice guides',
        'Present progress charts so you can literally see yourself improving',
        'Use written step-by-step instructions alongside demonstrations',
      ],
      tip: 'Try writing down what you\'re learning after each session — your brain loves turning sound into something you can see on paper.',
    },
    kinesthetic: {
      emoji: '🤸',
      label: 'Kinesthetic Learner',
      color: '#4ecdc4',
      tagline: 'You learn best by doing.',
      description: 'Kinesthetic learners retain information through physical movement, hands-on practice, and real experience. You don\'t just want to hear about a chord — you want to feel it under your fingers. Repetition through action is how knowledge becomes instinct for you.',
      howTami: [
        'Break every new concept into small, immediately playable exercises',
        'Prioritize "muscle memory" drills and finger pattern repetition',
        'Give you challenges to try before explaining the theory behind them',
        'Track your practice minutes closely — your progress comes from doing',
        'Suggest physical warm-ups and finger exercises before each session',
      ],
      tip: 'Don\'t skip the practice log! For kinesthetic learners, tracking physical reps is one of the most powerful motivators. Every minute counts.',
    },
    auditory: {
      emoji: '👂',
      label: 'Auditory Learner',
      color: '#f6ad55',
      tagline: 'You learn best by hearing.',
      description: 'Auditory learners absorb information most powerfully through sound, rhythm, verbal explanation, and listening. You probably find yourself humming melodies without thinking, picking up songs by ear, and remembering music after hearing it just once or twice.',
      howTami: [
        'Explain theory and technique through verbal descriptions and analogies',
        'Encourage you to sing or hum along while you play',
        'Use rhythm patterns and counting out loud as learning tools',
        'Play reference recordings so you can hear what you\'re working toward',
        'Give verbal feedback that connects what you hear to what you\'re playing',
      ],
      tip: 'Record yourself playing often and listen back. Your ear is your superpower — use it to self-correct and celebrate how far you\'ve come.',
    },
  };

  const wylResult = Object.keys(form.wylAnswers).length > 0 ? computeWYL(form.wylAnswers) : null;
  const wylInfo = wylResult ? WYL_INFO[wylResult] : null;

  // ── WYL Modal ────────────────────────────────────────────────────────────────
  const WylModal = () => {
    if (!showWylModal || !wylInfo) return null;
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }} onClick={() => setShowWylModal(false)}>
        <div onClick={e => e.stopPropagation()} style={{
          width: '100%', maxWidth: '420px',
          background: '#161b26',
          borderRadius: '24px',
          border: `1px solid ${wylInfo.color}33`,
          padding: '28px 24px',
          boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${wylInfo.color}15`,
          maxHeight: '85vh',
          overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>{wylInfo.emoji}</div>
            <div style={{
              display: 'inline-block',
              background: `${wylInfo.color}20`,
              color: wylInfo.color,
              fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '3px 12px', borderRadius: '20px', marginBottom: '10px',
              fontFamily: "'Outfit', sans-serif",
            }}>Your Learning Style</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
              {wylInfo.label}
            </div>
            <div style={{ fontSize: '14px', color: wylInfo.color, fontWeight: 600 }}>
              {wylInfo.tagline}
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(99,179,237,0.1)', marginBottom: '18px' }} />

          {/* Description */}
          <div style={{ fontSize: '12px', color: '#a0aec0', lineHeight: '1.8', marginBottom: '20px' }}>
            {wylInfo.description}
          </div>

          {/* How T.A.M.i will use this */}
          <div style={{
            background: '#1c2333',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '16px',
            border: `1px solid ${wylInfo.color}22`,
          }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#e2e8f0' }}>
              🤖 How T.A.M.i will teach you
            </div>
            {wylInfo.howTami.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '11px', color: '#718096', lineHeight: '1.6' }}>
                <div style={{ color: wylInfo.color, flexShrink: 0, marginTop: '1px' }}>✦</div>
                <div>{item}</div>
              </div>
            ))}
          </div>

          {/* Pro tip */}
          <div style={{
            background: `${wylInfo.color}10`,
            border: `1px solid ${wylInfo.color}30`,
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
          }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, color: wylInfo.color, marginBottom: '6px' }}>
              💡 Pro Tip for {wylInfo.label}s
            </div>
            <div style={{ fontSize: '11px', color: '#a0aec0', lineHeight: '1.7' }}>
              {wylInfo.tip}
            </div>
          </div>

          <button onClick={() => setShowWylModal(false)} style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: `linear-gradient(135deg, ${wylInfo.color}cc, ${wylInfo.color})`,
            color: '#0d1117', fontFamily: "'Outfit', sans-serif",
            fontWeight: 700, fontSize: '13px', cursor: 'pointer',
          }}>
            Got it — back to my profile ✓
          </button>
        </div>
      </div>
    );
  };

  // ── Page render ─────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* WYL Info Modal */}
      <WylModal />

      <div style={S.title}>
        School of <span style={S.titleAccent}>Motesart</span>
      </div>

      <div style={S.card}>
        <div style={S.stepLabel}>
          Step {step + 1} of {totalSteps} — {['Profile','Role','Music','WYL','Assessment','Avatar','Confirm'][step]}
        </div>
        <ProgressDots current={step} total={totalSteps} />
        {renderStep()}
      </div>
    </div>
  );
}
