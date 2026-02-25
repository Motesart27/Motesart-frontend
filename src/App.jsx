import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TamiChat from './components/TamiChat';

// ── Role access rules ─────────────────────────────────────────────────────────
// admin      → ALL dashboards (read-only)
// teacher    → their students + Leadership Dashboard
// parent     → their child's dashboard + Leadership Dashboard
// student    → their own dashboard + Leadership Dashboard
// ambassador → their own dashboard only

function PrivateRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  // Admin bypasses all role checks — sees everything
  if (user.role === 'admin') return children;
  // Redirect if role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student — own dashboard + ambassador view */}
        <Route path="/student" element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        } />

        {/* Teacher — their students dashboards + ambassador */}
        <Route path="/teacher" element={
          <PrivateRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </PrivateRoute>
        } />

        {/* T.A.M.i chat — all roles */}
        <Route path="/chat" element={
          <PrivateRoute allowedRoles={['student', 'teacher', 'parent', 'ambassador', 'admin']}>
            <TamiChat />
          </PrivateRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
