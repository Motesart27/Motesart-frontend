import { useState } from 'react'
import Login from './pages/Login.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import TamiChat from './components/TamiChat.jsx'

function App() {
  const [user, setUser] = useState(null)

  const handleLogout = () => setUser(null)

  if (!user) return <Login onLogin={setUser} />

  if (user.role === 'Teacher' || user.role === 'Admin') {
    return (
      <>
        <TeacherDashboard user={user} onLogout={handleLogout} />
        <TamiChat user={user} />
      </>
    )
  }

  return (
    <>
      <StudentDashboard user={user} onLogout={handleLogout} />
      <TamiChat user={user} />
    </>
  )
}

export default App
