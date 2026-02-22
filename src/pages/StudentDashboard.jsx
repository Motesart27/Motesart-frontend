import { useState, useEffect } from "react"
import { getPracticeStats, getStudentAssignments, getRecentLogs } from "../services/api"

export default function StudentDashboard({ user }) {
  const [stats, setStats] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const name = user?.name || "Demo Student"
    Promise.all([
      getPracticeStats(name).catch(() => DEMO_STATS),
      getStudentAssignments(name).catch(() => DEMO_ASSIGNMENTS),
      getRecentLogs(name).catch(() => DEMO_LOGS),
    ]).then(([s, a, l]) => {
      setStats(s)
      setAssignments(a)
      setLogs(l)
      setLoading(false)
    })
  }, [user])

  if (loading) return (
    <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 80, fontFamily: "'DM Sans', sans-serif" }}>
      Loading your progress...
    </div>
  )

  const weeklyTarget = 60
  const weeklyMinutes = stats?.total_weekly_minutes || 0
  const weeklyProgress = Math.min(100, (weeklyMinutes / weeklyTarget) * 100)

  // Fake DPM breakdown from stats
  const drive = Math.min(100, weeklyProgress)
  const passion = stats?.games_played?.length > 0 ? 65 : 20
  const motivation = assignments.filter(a => a.status === "Completed").length > 0 ? 70 : 30
  const dpm = Math.round(drive * 0.5 + passion * 0.3 + motivation * 0.2)

  return (
    <div style={{ padding: "32px", maxWidth: 1100, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            Hey {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 6, fontSize: 15 }}>
            Keep the momentum going — T.A.M.i is watching your progress
          </p>
        </div>
        <div style={{
          padding: "8px 16px", borderRadius: 12,
          background: dpm >= 60 ? "rgba(34,197,94,0.1)" : dpm >= 30 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${dpm >= 60 ? "rgba(34,197,94,0.3)" : dpm >= 30 ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)"}`,
          color: dpm >= 60 ? "#22c55e" : dpm >= 30 ? "#eab308" : "#ef4444",
          fontWeight: 700, fontSize: 14,
        }}>
          DPM: {dpm}% — {dpm >= 60 ? "On Track ✅" : dpm >= 30 ? "Needs Attention ⚠️" : "At Risk 🚨"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Weekly Progress */}
        <div style={{ gridColumn: "1 / 3" }}>
          <StatCard title="Weekly Practice Goal">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                  <span style={{ color: "#e84b8a", fontWeight: 800, fontSize: 24 }}>{Math.round(weeklyMinutes)}</span> / {weeklyTarget} min
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{Math.round(weeklyProgress)}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.06)" }}>
                <div style={{
                  height: "100%", borderRadius: 5,
                  width: `${weeklyProgress}%`,
                  background: "linear-gradient(90deg, #e84b8a, #f97316)",
                  transition: "width 0.8s ease",
                }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <MiniStat label="Sessions" value={stats?.weekly_sessions || 0} />
              <MiniStat label="Last Practice" value={stats?.days_since_last_practice !== null ? `${stats?.days_since_last_practice}d ago` : "Never"} />
              <MiniStat label="Games Played" value={stats?.games_played?.length || 0} />
            </div>
          </StatCard>
        </div>

        {/* DPM Ring */}
        <StatCard title="Power Level">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <BigDPMRing value={dpm} />
            <div style={{ width: "100%" }}>
              <MiniBar label="Drive" value={drive} color="#e84b8a" />
              <MiniBar label="Passion" value={passion} color="#f97316" />
              <MiniBar label="Motivation" value={motivation} color="#a855f7" />
            </div>
          </div>
        </StatCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Practice */}
        <StatCard title="Recent Practice">
          {logs.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
              No recent practice — let's get started! 🎹
            </p>
          ) : (
            logs.slice(0, 5).map((log, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: i < logs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                    {log.practice_type || "Practice"} {log.game_name ? `— ${log.game_name}` : ""}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{log.practice_date}</div>
                </div>
                <div style={{ color: "#e84b8a", fontWeight: 700, fontSize: 15 }}>{log.minutes}m</div>
              </div>
            ))
          )}
        </StatCard>

        {/* Homework */}
        <StatCard title="Homework">
          {assignments.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
              No assignments right now 🎉
            </p>
          ) : (
            assignments.slice(0, 4).map((hw, i) => (
              <div key={i} style={{
                padding: "12px", borderRadius: 10, marginBottom: 8,
                background: hw.status === "Completed" ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${hw.status === "Completed" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{hw.title || "Homework Assignment"}</div>
                    {hw.due_date && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>Due: {hw.due_date}</div>}
                  </div>
                  <span style={{
                    padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: hw.status === "Completed" ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                    color: hw.status === "Completed" ? "#22c55e" : "#f97316",
                  }}>{hw.status}</span>
                </div>
                {hw.minutes_target && (
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 6 }}>
                    Target: {hw.minutes_target} min
                  </div>
                )}
              </div>
            ))
          )}
        </StatCard>
      </div>
    </div>
  )
}

function StatCard({ title, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 18, padding: 24,
    }}>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 18px" }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div style={{ textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{label}</div>
    </div>
  )
}

function MiniBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{label}</span>
        <span style={{ color, fontSize: 12, fontWeight: 700 }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", borderRadius: 2, width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

function BigDPMRing({ value }) {
  const size = 100
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const color = value >= 60 ? "#22c55e" : value >= 30 ? "#eab308" : "#ef4444"
  return (
    <svg width={size} height={size}>
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <text x={50} y={46} textAnchor="middle" fill="#fff" fontSize={20} fontWeight="800">{value}%</text>
      <text x={50} y={62} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={11}>DPM</text>
    </svg>
  )
}

const DEMO_STATS = { total_weekly_minutes: 35, weekly_sessions: 3, days_since_last_practice: 1, games_played: ["Find the Note"] }
const DEMO_ASSIGNMENTS = [{ title: "Piano Scales Practice", status: "Assigned", due_date: "2026-02-28", minutes_target: 20 }]
const DEMO_LOGS = [
  { practice_type: "Academic", minutes: 20, practice_date: "2026-02-22" },
  { practice_type: "Game", game_name: "Find the Note", minutes: 15, practice_date: "2026-02-21" },
]
