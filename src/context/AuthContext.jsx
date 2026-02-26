import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('motesart_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    if (user) localStorage.setItem('motesart_user', JSON.stringify(user))
    else localStorage.removeItem('motesart_user')
  }, [user])

  const login = (userData) => { setUser(userData); setCurrentPage('dashboard') }
  const logout = () => { setUser(null); setCurrentPage('dashboard'); localStorage.removeItem('motesart_user') }
  const navigate = (page) => setCurrentPage(page)

  return (
    <AuthContext.Provider value={{ user, login, logout, currentPage, navigate }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
