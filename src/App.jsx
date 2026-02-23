import { useState } from "react"
import TeacherDashboard from "./pages/TeacherDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import TamiChat from "./components/TamiChat"
import Login from "./pages/Login"

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState("login")

  const handleLogin = (userData) => {
    setUser(userData)
    setView(userData.role === "Teacher" ? "teacher" : "student")
  }

  if (view === "login") return <Login onLogin={handleLogin} />

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", minHeight: "100vh" }}>
      <Nav user={user} view={view} setView={setView} />
      {view === "teacher" && <TeacherDashboard />}
      {view === "student" && <StudentDashboard user={user} />}
      <TamiChat user={user} />
    </div>
  )
}

function Nav({ user, view, setView }) {
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 64, background: "#0d0d14",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #e84b8a, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>🎵</div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>
          School of Motesart
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {user?.role === "Teacher" && (
          <>
            <NavBtn active={view === "teacher"} onClick={() => setView("teacher")}>Dashboard</NavBtn>
            <NavBtn active={view === "homework"} onClick={() => setView("homework")}>Homework</NavBtn>
          </>
        )}
        {user?.role === "Student" && (
          <NavBtn active={view === "student"} onClick={() => setView("student")}>My Progress</NavBtn>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #e84b8a, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: 14,
        }}>
          {user?.name?.[0] || "U"}
        </div>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{user?.name}</span>
      </div>
    </nav>
  )
}

function NavBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
      background: active ? "rgba(232,75,138,0.15)" : "transparent",
      color: active ? "#e84b8a" : "rgba(255,255,255,0.5)",
      fontWeight: active ? 600 : 400, fontSize: 14,
      transition: "all 0.2s",
    }}>{children}</button>
  )
}
