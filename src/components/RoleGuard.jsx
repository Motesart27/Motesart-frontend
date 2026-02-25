import { useAuth } from '../context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

/**
 * RoleGuard — wraps pages to enforce role-based access.
 * 
 * Usage: <RoleGuard allow={['Student', 'Admin']}><StudentPage /></RoleGuard>
 * 
 * Admin always gets through (view-only mode).
 * If role not in allow list → redirect to /dashboard
 */
export default function RoleGuard({ allow = [], children }) {
  const { user, role, isAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  // Admin can view everything
  if (isAdmin()) return children

  // Check if user's role is in the allow list
  if (allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
