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

function AppContent() {
  const { user, currentPage, navigate, logout } = useAuth()

  if (!user) return <Login />

  const renderPage = () => {
    switch (currentPage) {
      case 'teacher-dashboard': return <TeacherDashboard user={user} onLogout={logout} onNavigate={navigate} />
      case 'student-dashboard': return <StudentDashboard user={user} onLogout={logout} onNavigate={navigate} />
      case 'parent-dashboard': return <ParentDashboard user={user} onLogout={logout} onNavigate={navigate} />
      case 'game': return <GamePage user={user} onNavigate={navigate} />
      case 'homework': return <HomeworkDashboard user={user} onNavigate={navigate} />
      case 'leaderboard': return <Leaderboard user={user} onNavigate={navigate} />
      case 'practice': return <PracticeTracking user={user} onNavigate={navigate} />
      case 'session-summary': return <SessionSummary user={user} onNavigate={navigate} />
      case 'settings': return <Settings user={user} onLogout={logout} onNavigate={navigate} />
      case 'registration': return <Registration />
      default: return <StudentDashboard user={user} onLogout={logout} onNavigate={navigate} />
    }
  }

  const getHomePage = () => {
    const role = (user.role || 'User').toLowerCase()
    if (role === 'teacher') return 'teacher-dashboard'
    if (role === 'parent') return 'parent-dashboard'
    return 'student-dashboard'
  }

  const homePage = getHomePage()
  const isOnHomePage = currentPage === homePage
  const role = (user.role || 'User').toLowerCase()

  return (
    <div style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif", background: '#0a0a0f', minHeight: '100vh', color: '#fff' }}>
      {/* Top Nav Bar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 56, background: '#0d0d14',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Left: Back or Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isOnHomePage ? (
            <button onClick={() => navigate(homePage)} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '6px 14px', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            }}>
              ← Back
            </button>
          ) : (
            <>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
                background: 'linear-gradient(135deg, #e84b8a, #f97316)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700,
              }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name?.[0] || 'U'
                )}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{user.name || 'Student'}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>T.A.M.i Dashboard</div>
              </div>
            </>
          )}
        </div>

        {/* Center: Role-specific view toggles */}
        <div style={{ display: 'flex', gap: 6 }}>
          {role === 'student' && (
            <>
              <NavBtn active={currentPage === 'student-dashboard'} onClick={() => navigate('student-dashboard')}>✨ Academic</NavBtn>
              <NavBtn active={currentPage === 'game'} onClick={() => navigate('game')}>🎮 Game</NavBtn>
              <NavBtn active={false} onClick={() => navigate('game')}>▶ Play</NavBtn>
            </>
          )}
          {role === 'teacher' && (
            <>
              <NavBtn active={currentPage === 'teacher-dashboard'} onClick={() => navigate('teacher-dashboard')}>Dashboard</NavBtn>
              <NavBtn active={currentPage === 'homework'} onClick={() => navigate('homework')}>Homework</NavBtn>
            </>
          )}
          {role === 'parent' && (
            <NavBtn active={currentPage === 'parent-dashboard'} onClick={() => navigate('parent-dashboard')}>Overview</NavBtn>
          )}
        </div>

        {/* Right: Settings + Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('settings')} title="Settings" style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 18, padding: 4,
          }}>⚙️</button>
          <button onClick={logout} title="Sign out" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '5px 12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            fontSize: 12, fontFamily: "'DM Sans', sans-serif",
          }}>Sign Out</button>
        </div>
      </nav>

      {renderPage()}
      <TamiChat user={user} />
    </div>
  )
}

function NavBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 10, border: active ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
      cursor: 'pointer',
      background: active ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
      color: active ? '#22c55e' : 'rgba(255,255,255,0.5)',
      fontWeight: active ? 600 : 400, fontSize: 13, transition: 'all 0.2s',
      fontFamily: "'DM Sans', sans-serif",
    }}>{children}</button>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
