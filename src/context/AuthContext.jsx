import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('motesart_user')
    return saved ? JSON.parse(saved) : null
  })
  const [currentPage, setCurrentPage] = useState('login')

  useEffect(() => {
    if (user) {
      localStorage.setItem('motesart_user', JSON.stringify(user))
      const role = (user.role || 'User').toLowerCase()
      if (role === 'teacher') setCurrentPage('teacher-dashboard')
      else if (role === 'student') setCurrentPage('student-dashboard')
      else if (role === 'parent') setCurrentPage('parent-dashboard')
      else if (role === 'admin') setCurrentPage('student-dashboard')
      else if (role === 'ambassador') setCurrentPage('student-dashboard')
      else setCurrentPage('student-dashboard')
    } else {
      localStorage.removeItem('motesart_user')
      setCurrentPage('login')
    }
  }, [user])

  const login = (userData) => setUser(userData)

  const logout = () => {
    setUser(null)
    setCurrentPage('login')
  }

  const navigate = (page) => setCurrentPage(page)

  return (
    <AuthContext.Provider value={{ user, login, logout, navigate, currentPage }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
