import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('motesart_user')
    return saved ? JSON.parse(saved) : null
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('motesart_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('motesart_user')
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('motesart_user')
  }

  // Primary role from user's role array — first match wins
  const getRole = () => {
    if (!user?.role) return null
    const roles = Array.isArray(user.role) ? user.role : [user.role]
    // Priority: Admin > Teacher > Parent > Student > User
    const priority = ['Admin', 'Teacher', 'Parent', 'Student', 'User']
    for (const r of priority) {
      if (roles.includes(r)) return r
    }
    return roles[0] || 'User'
  }

  const hasRole = (role) => {
    if (!user?.role) return false
    const roles = Array.isArray(user.role) ? user.role : [user.role]
    return roles.includes(role)
  }

  const isAdmin = () => hasRole('Admin')

  return (
    <AuthContext.Provider value={{
      user,
      role: getRole(),
      loading,
      setLoading,
      login,
      logout,
      hasRole,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
