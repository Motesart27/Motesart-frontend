import { useState, useEffect } from "react"
import { getStudentsWithRisk, tamiWeeklyReview } from "../services/api"

const RISK_CONFIG = {
  red: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)", emoji: "🚨" },
  orange: { label: "At Risk", color: "#f97316", bg: "rgba(249,115,22,0.1)", emoji: "⚠️" },
  yellow: { label: "Watch", color: "#eab308", bg: "rgba(234,179,8,0.1)", emoji: "👀" },
  green: { label: "On Track", color: "#22c55e", bg: "rgba(34,197,94,0.1)", emoji: "✅" },
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [review, setReview] = useState(null)

  useEffect(() => {
    // Load demo students immediately, try API in background
    setStudents(DEMO_STUDENTS)
    setLoading(false)
    // Try API with timeout — update if successful
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    fetch((import.meta.env?.VITE_API_URL || 'http://localhost:8000') + '/students', { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (Array.isArray(data) && data.length > 0) setStudents(data) })
      .catch(() => {})
      .finally(() => clearTimeout(timeout))
  }, [])

  const filtered = filter === "all" ? students : students.filter(s => s.risk_level === filter)

  const counts = {
    red: students.filter(s => s.risk_level === "red").length,
    orange: students.filter(s => s.risk_level === "orange").length,
    yellow: students.filter(s => s.risk_level === "yellow").length,
    green: students.filter(s => s.risk_level === "green").length,
  }

  const handleWeeklyReview = async (student) => {
    setReviewLoading(true)
    setReview(null)
    try {
      const data = await tamiWeeklyReview(student.name)
      setReview(data)
    } catch {
      setReview({ week_summary: "Unable to generate review — check API connection.", highlights: [], improvement_focus: "N/A" })
    }
    setReviewLoading(false)
  }

  return (
    <div style={{ padding: "0 32px 32px", maxWidth: 1200, margin: "0 auto" }}>

      {/* ═══ TEACHER HEADER — Matches Student Dashboard Structure ═══ */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        marginBottom: 24,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Left: Avatar + Name + Tag + Subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Gold Glow Avatar */}
          <div style={{
            width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 18,
            boxShadow: "0 0 12px rgba(245,158,11,0.5), 0 0 24px rgba(245,158,11,0.2)",
            border: "2px solid #f59e0b",
          }}>
            M
          </div>

          {/* Name row + Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>
                Motesart
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                letterSpacing: "0.04em",
                background: "rgba(245,158,11,0.15)",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.3)",
              }}>
                Teacher View
              </span>
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              T.A.M.i <span style={{ color: "#f59e0b" }}>⚡</span> Risk Monitor Active
            </span>
          </div>

          {/* Bell */}
          <span style={{
            fontSize: 22, marginLeft: 8, cursor: "pointer",
            filter: "drop-shadow(0 0 4px rgba(245,158,11,0.4))",
          }}>🔔</span>
        </div>

        {/* Right: Nav Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <HeaderNavBtn accent="teal">👤 View as Student</HeaderNavBtn>
          <HeaderNavBtn>⚙️ Settings</HeaderNavBtn>
          <HeaderNavBtn accent="gold">🌐 T.A.M.i</HeaderNavBtn>
          <HeaderNavBtn>📋 Dashboard</HeaderNavBtn>
          <HeaderNavBtn>📅 Calendar</HeaderNavBtn>
          <HeaderNavBtn accent="purple">🎮 Game</HeaderNavBtn>
          <HeaderNavBtn muted>Logout</HeaderNavBtn>
        </div>
      </div>
      {/* ═══ END HEADER ═══ */}

      {/* Risk Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {Object.entries(RISK_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(filter === key ? "all" : key)} style={{
            padding: "20px", borderRadius: 16, border: `1px solid ${filter === key ? cfg.color : "rgba(255,255,255,0.06)"}`,
            background: filter === key ? cfg.bg : "rgba(255,255,255,0.03)",
            cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{cfg.emoji}</div>
            <div style={{ color: cfg.color, fontWeight: 800, fontSize: 28 }}>{counts[key]}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 }}>{cfg.label}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 24 }}>
        {/* Student List */}
        <div>
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 60 }}>
              Loading students...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  selected={selected?.id === student.id}
                  onClick={() => { setSelected(selected?.id === student.id ? null : student); setReview(null) }}
                />
              ))}
              {filtered.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 40 }}>
                  No students in this category
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student Detail Panel */}
        {selected && (
          <StudentDetail
            student={selected}
            review={review}
            reviewLoading={reviewLoading}
            onWeeklyReview={() => handleWeeklyReview(selected)}
            onClose={() => { setSelected(null); setReview(null) }}
          />
        )}
      </div>
    </div>
  )
}

/* ─── Header Nav Button (matches student dash style) ─── */
function HeaderNavBtn({ children, accent, muted }) {
  const styles = {
    teal: { color: "#2dd4bf", bg: "rgba(45,212,191,0.08)", border: "rgba(45,212,191,0.3)" },
    gold: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
    purple: { color: "#c084fc", bg: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.4)" },
  }
  const s = accent ? styles[accent] : {}
  return (
    <button style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 14px", borderRadius: 10, cursor: "pointer",
      fontSize: 13, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      color: muted ? "rgba(255,255,255,0.4)" : (s.color || "rgba(255,255,255,0.75)"),
      background: s.bg || "rgba(255,255,255,0.04)",
      border: `1px solid ${s.border || "rgba(255,255,255,0.12)"}`,
      transition: "all 0.2s",
    }}>
      {children}
    </button>
  )
}

function StudentCard({ student, selected, onClick }) {
  const risk = RISK_CONFIG[student.risk_level] || RISK_CONFIG.green
  const dpm = student.overall || 0

  return (
    <div onClick={onClick} style={{
      padding: "20px 24px", borderRadius: 16,
      border: `1px solid ${selected ? risk.color : "rgba(255,255,255,0.06)"}`,
      background: selected ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
      cursor: "pointer", transition: "all 0.2s",
      display: "flex", alignItems: "center", gap: 20,
    }}>
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${risk.color}40, ${risk.color}20)`,
        border: `2px solid ${risk.color}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: risk.color, fontWeight: 800, fontSize: 18,
      }}>
        {student.name?.[0] || "?"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{student.name}</span>
          <span style={{
            padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: risk.bg, color: risk.color,
          }}>{risk.emoji} {risk.label}</span>
          {student.level && (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{student.level}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Stat label="DPM" value={`${dpm}%`} color={risk.color} />
          <Stat label="Weekly min" value={`${Math.round(student.weekly_minutes || 0)}`} />
          {student.days_since_practice !== null && student.days_since_practice !== undefined && (
            <Stat label="Last practice" value={`${student.days_since_practice}d ago`} />
          )}
        </div>
      </div>

      {/* DPM Ring */}
      <DPMRing value={dpm} color={risk.color} size={52} />
    </div>
  )
}

function StudentDetail({ student, review, reviewLoading, onWeeklyReview, onClose }) {
  const risk = RISK_CONFIG[student.risk_level] || RISK_CONFIG.green

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, padding: 24, position: "sticky", top: 80, maxHeight: "calc(100vh - 120px)",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: 800 }}>{student.name}</h3>
          <span style={{ color: risk.color, fontSize: 13 }}>{risk.emoji} {risk.label}</span>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.5)",
          width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16,
        }}>×</button>
      </div>

      {/* DPM Breakdown */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>DPM Breakdown</p>
        <DPMBar label="Drive (Practice)" value={student.drive || 0} color="#e84b8a" />
        <DPMBar label="Passion (Games)" value={student.passion || 0} color="#f97316" />
        <DPMBar label="Motivation (HW)" value={student.motivation || 0} color="#a855f7" />
      </div>

      {/* Flags */}
      {student.flags?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Alerts</p>
          {student.flags.map(flag => (
            <div key={flag} style={{
              padding: "8px 12px", borderRadius: 8, marginBottom: 6,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5", fontSize: 13,
            }}>
              ⚠ {flag.replace(/_/g, " ")}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        <ActionBtn onClick={onWeeklyReview} loading={reviewLoading} color="#e84b8a">
          {reviewLoading ? "Generating..." : "📊 Generate Weekly Review"}
        </ActionBtn>
        <ActionBtn color="#f97316">💬 Send Message</ActionBtn>
        <ActionBtn color="#a855f7">📚 Assign Homework</ActionBtn>
      </div>

      {/* Weekly Review */}
      {review && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: 18,
        }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            T.A.M.i Weekly Review
          </p>
          {review.week_summary && <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{review.week_summary}</p>}
          {review.improvement_focus && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(232,75,138,0.1)", border: "1px solid rgba(232,75,138,0.2)" }}>
              <p style={{ color: "#e84b8a", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>FOCUS THIS WEEK</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>{review.improvement_focus}</p>
            </div>
          )}
          {review.teacher_alert && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>🚨 {review.teacher_alert}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DPMRing({ value, color, size = 60 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={color} fontSize={size < 60 ? 11 : 13} fontWeight="800">
        {Math.round(value)}%
      </text>
    </svg>
  )
}

function DPMBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{label}</span>
        <span style={{ color, fontSize: 13, fontWeight: 700 }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", borderRadius: 3, width: `${value}%`, background: color, transition: "width 0.5s ease" }} />
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <span style={{ color: color || "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600 }}>{value}</span>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginLeft: 4 }}>{label}</span>
    </div>
  )
}

function ActionBtn({ children, onClick, color, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding: "10px 16px", borderRadius: 10, border: `1px solid ${color}40`,
      background: `${color}10`, color, fontSize: 14, fontWeight: 600,
      cursor: "pointer", textAlign: "left", opacity: loading ? 0.6 : 1,
    }}>{children}</button>
  )
}

// Demo data for when API is unavailable
const DEMO_STUDENTS = [
  { id: "1", name: "Luke Valdez", risk_level: "green", overall: 78, drive: 82, passion: 70, motivation: 75, weekly_minutes: 45, days_since_practice: 1, flags: [], level: "Intermediate", instruments: ["Piano"] },
  { id: "2", name: "Renee Taylor", risk_level: "orange", overall: 38, drive: 30, passion: 45, motivation: 40, weekly_minutes: 15, days_since_practice: 4, flags: ["below_weekly_target"], level: "Intermediate", instruments: ["Organ"] },
  { id: "3", name: "Demo Student", risk_level: "red", overall: 12, drive: 10, passion: 15, motivation: 10, weekly_minutes: 0, days_since_practice: 14, flags: ["zero_engagement_14days"], level: "Beginner", instruments: ["Piano"] },
]
