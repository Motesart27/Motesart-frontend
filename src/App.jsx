import { Component } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import ParentDashboard from './pages/ParentDashboard.jsx'
import GamePage from './pages/GamePage.jsx'
import HomeworkDashboard from './pages/HomeworkDashboard.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import PracticeTracking from './pages/PracticeTracking.jsx'
import SessionSummary from './pages/SessionSummary.jsx'
import Settings from './pages/Settings.jsx'
import Registration from './pages/Registration.jsx'
import TamiChat from './components/TamiChat.jsx'

/* Error Boundary — catches crashes, shows recovery UI instead of black screen */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 style={{ color: '#f87171', fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontSize: 13 }}>{this.state.error?.message}</p>
          <button onClick={() => { this.setState({ hasError: false }); this.props.onReset?.() }}
            style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            ← Back to Dashboard
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppContent() {
  const { user, login, logout, navigate, currentPage, getHomePage } = useAuth()

  // Not logged in — show the EXISTING Login page (passes onLogin prop, no changes needed!)
  if (!user) return <Login onLogin={login} />

  const homePage = getHomePage()
  const isOnHomePage = currentPage === homePage
  const role = (user.role || 'User').toLowerCase()

  const renderPage = () => {
    switch (currentPage) {
      case 'teacher-dashboard': return <TeacherDashboard user={user} onLogout={logout} />
      case 'student-dashboard': return <StudentDashboard user={user} onLogout={logout} />
      case 'parent-dashboard': return <ParentDashboard user={user} onLogout={logout} />
      case 'game': return <GamePage user={user} />
      case 'homework': return <HomeworkDashboard user={user} />
      case 'leaderboard': return <Leaderboard user={user} />
      case 'practice': return <PracticeTracking user={user} />
      case 'session-summary': return <SessionSummary user={user} />
      case 'settings': return <Settings user={user} onLogout={logout} />
      case 'registration': return <Registration onLogin={login} />
      default: return <StudentDashboard user={user} onLogout={logout} />
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif", background: '#0a0a0f', minHeight: '100vh', color: '#fff' }}>
      {/* Top Nav Bar */}
      <nav style={navStyle}>
        {/* Left: Back or User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isOnHomePage ? (
            <button onClick={() => navigate(homePage)} style={backBtnStyle}>← Back</button>
          ) : (
            <>
              <div style={avatarStyle}>
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.name?.[0] || 'U')
                }
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{user.name || 'Student'}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>T.A.M.i Dashboard</div>
              </div>
            </>
          )}
        </div>

        {/* Center: Role-specific nav */}
        <div style={{ display: 'flex', gap: 6 }}>
          {role === 'student' && (
            <>
              <NavBtn active={currentPage === 'student-dashboard'} onClick={() => navigate('student-dashboard')} color="teal">✨ Academic</NavBtn>
              <NavBtn active={currentPage === 'game'} onClick={() => navigate('game')} color="default">🎮 Game</NavBtn>
              <NavBtn active={false} onClick={() => navigate('game')} color="green">▶ Play</NavBtn>
            </>
          )}
          {role === 'teacher' && (
            <>
              <NavBtn active={currentPage === 'teacher-dashboard'} onClick={() => navigate('teacher-dashboard')} color="teal">Dashboard</NavBtn>
              <NavBtn active={currentPage === 'homework'} onClick={() => navigate('homework')} color="default">Homework</NavBtn>
            </>
          )}
          {role === 'parent' && (
            <NavBtn active={currentPage === 'parent-dashboard'} onClick={() => navigate('parent-dashboard')} color="teal">Overview</NavBtn>
          )}
        </div>

        {/* Right: Settings + Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('settings')} title="Settings" style={iconBtnStyle}>⚙️</button>
          <button onClick={logout} title="Sign out" style={signOutStyle}>Sign Out</button>
        </div>
      </nav>

      {/* Page content wrapped in ErrorBoundary — never shows black screen */}
      <ErrorBoundary onReset={() => navigate(homePage)}>
        {renderPage()}
      </ErrorBoundary>

      <TamiChat user={user} />
    </div>
  )
}

function NavBtn({ children, active, onClick, color }) {
  const colors = {
    teal: { activeBg: 'rgba(20,184,166,0.15)', activeBorder: 'rgba(20,184,166,0.3)', activeColor: '#14b8a6' },
    green: { activeBg: 'rgba(34,197,94,0.15)', activeBorder: 'rgba(34,197,94,0.3)', activeColor: '#22c55e' },
    default: { activeBg: 'rgba(255,255,255,0.08)', activeBorder: 'rgba(255,255,255,0.15)', activeColor: 'rgba(255,255,255,0.7)' },
  }
  const c = colors[color] || colors.default
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 10, cursor: 'pointer',
      background: active ? c.activeBg : 'rgba(255,255,255,0.04)',
      border: active ? `1px solid ${c.activeBorder}` : '1px solid rgba(255,255,255,0.08)',
      color: active ? c.activeColor : 'rgba(255,255,255,0.5)',
      fontWeight: active ? 600 : 400, fontSize: 13,
      fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
    }}>{children}</button>
  )
}

const navStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 20px', height: 56, background: '#0d0d14',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  position: 'sticky', top: 0, zIndex: 100,
}
const backBtnStyle = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '6px 14px', color: '#fff', cursor: 'pointer',
  fontSize: 13, fontFamily: "'DM Sans', sans-serif",
}
const avatarStyle = {
  width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 15, fontWeight: 700, color: '#fff',
}
const iconBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(255,255,255,0.5)', fontSize: 18, padding: 4,
}
const signOutStyle = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, padding: '5px 12px', color: 'rgba(255,255,255,0.4)',
  cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
