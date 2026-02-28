import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Registration from './pages/Registration.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import TeacherTamiDashboard from './pages/TeacherTamiDashboard.jsx'
import ParentDashboard from './pages/ParentDashboard.jsx'
import GamePage from './pages/GamePage.jsx'
import HomeworkDashboard from './pages/HomeworkDashboard.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import PracticeTracking from './pages/PracticeTracking.jsx'
import SessionSummary from './pages/SessionSummary.jsx'
import Settings from './pages/Settings.jsx'
import TamiChat from './components/TamiChat.jsx'
import TamiDashboard from './pages/TamiDashboard.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return <>{children}<TamiChat /></>
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  const role = (user.role || 'User').toLowerCase()
  if (role === 'teacher' || role === 'admin') return <Navigate to="/teacher" replace />
  if (role === 'parent') return <Navigate to="/parent" replace />
  return <Navigate to="/student" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/tami" element={<ProtectedRoute><TamiDashboard /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher-tami" element={<ProtectedRoute><TeacherTamiDashboard /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
      <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="/homework" element={<ProtectedRoute><HomeworkDashboard /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeTracking /></ProtectedRoute>} />
      <Route path="/session-summary" element={<ProtectedRoute><SessionSummary /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
