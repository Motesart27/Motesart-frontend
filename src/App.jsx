import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import RoleGuard from './components/RoleGuard.jsx'

// Pages
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GamePage from './pages/GamePage.jsx'
import PracticePage from './pages/PracticePage.jsx'
import HomeworkPage from './pages/HomeworkPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import TeacherPage from './pages/TeacherPage.jsx'
import ParentPage from './pages/ParentPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SessionSummary from './pages/SessionSummary.jsx'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />

      {/* Everyone → T.A.M.i Dashboard (role-aware) */}
      <Route path="/dashboard" element={
        <RoleGuard allow={['Admin', 'Teacher', 'Parent', 'Student', 'User']}>
          <Dashboard />
        </RoleGuard>
      } />

      {/* Game — Student + User + Admin */}
      <Route path="/game" element={
        <RoleGuard allow={['Student', 'User', 'Admin']}>
          <GamePage />
        </RoleGuard>
      } />

      {/* Session Summary — after game */}
      <Route path="/session-summary" element={
        <RoleGuard allow={['Student', 'User', 'Admin']}>
          <SessionSummary />
        </RoleGuard>
      } />

      {/* Practice — all roles */}
      <Route path="/practice" element={
        <RoleGuard allow={['Student', 'User', 'Teacher', 'Parent', 'Admin']}>
          <PracticePage />
        </RoleGuard>
      } />

      {/* Homework — Student + Teacher + Parent + Admin */}
      <Route path="/homework" element={
        <RoleGuard allow={['Student', 'Teacher', 'Parent', 'Admin']}>
          <HomeworkPage />
        </RoleGuard>
      } />

      {/* Leaderboard — everyone */}
      <Route path="/leaderboard" element={
        <RoleGuard allow={['Student', 'User', 'Teacher', 'Parent', 'Admin']}>
          <LeaderboardPage />
        </RoleGuard>
      } />

      {/* Teacher Dashboard — Teacher + Admin */}
      <Route path="/teacher" element={
        <RoleGuard allow={['Teacher', 'Admin']}>
          <TeacherPage />
        </RoleGuard>
      } />

      {/* Parent Dashboard — Parent + Admin */}
      <Route path="/parent" element={
        <RoleGuard allow={['Parent', 'Admin']}>
          <ParentPage />
        </RoleGuard>
      } />

      {/* Settings — everyone */}
      <Route path="/settings" element={
        <RoleGuard allow={['Student', 'User', 'Teacher', 'Parent', 'Admin']}>
          <SettingsPage />
        </RoleGuard>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
