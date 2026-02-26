import { useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import StudentDashboard from "./pages/StudentDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import ParentDashboard from "./pages/ParentDashboard"
import GamePage from "./pages/GamePage"
import HomeworkDashboard from "./pages/HomeworkDashboard"
import Leaderboard from "./pages/Leaderboard"
import PracticeTracking from "./pages/PracticeTracking"
import SessionSummary from "./pages/SessionSummary"
import Settings from "./pages/Settings"
import TamiChat from "./components/TamiChat"

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return (
      <div style={{ background:"#0a0a0f", color:"#fff", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans" }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:48, marginBottom:12 }}>🎵</p>
          <p style={{ fontSize:18, fontWeight:600 }}>Something went wrong</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            style={{ marginTop:16, padding:"10px 24px", background:"#14b8a6", color:"#fff", border:"none", borderRadius:10, fontSize:14, cursor:"pointer" }}>
            Reload
          </button>
        </div>
      </div>
    )
    return this.props.children
  }
}

import React from "react"

function AppContent() {
  const { user, currentPage, navigate, logout } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (!user) {
    if (showRegister) return <Registration onBack={() => setShowRegister(false)} />
    return <Login onRegister={() => setShowRegister(true)} />
  }

  const role = (user.role || "User").toLowerCase()

  const renderPage = () => {
    switch (currentPage) {
      case "game": return <GamePage />
      case "homework": return <HomeworkDashboard />
      case "leaderboard": return <Leaderboard />
      case "practice": return <PracticeTracking />
      case "session": return <SessionSummary />
      case "settings": return <Settings />
      default:
        if (role === "teacher") return <TeacherDashboard />
        if (role === "parent") return <ParentDashboard />
        return <StudentDashboard />
    }
  }

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#fff" }}>
      {currentPage !== "dashboard" && (
        <button onClick={() => navigate("dashboard")}
          style={{ position:"fixed", top:16, left:16, zIndex:100, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fff", padding:"8px 16px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          ← Back
        </button>
      )}
      {renderPage()}
      <TamiChat user={user} />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}
