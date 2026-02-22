// API service - connects to Railway backend
const BASE_URL = import.meta.env.VITE_API_URL || "https://deployable-python-codebase-som-production.up.railway.app"

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const getStudentsWithRisk = () => api("/api/students/risk/all")
export const getStudent = (id) => api(`/api/students/${id}`)
export const getStudentDPM = (id) => api(`/api/students/${id}/dpm`)
export const getPracticeStats = (name) => api(`/api/practice-logs/stats/${encodeURIComponent(name)}`)
export const getRecentLogs = (name, days = 7) => api(`/api/practice-logs/student/${encodeURIComponent(name)}/recent?days=${days}`)
export const getStudentAssignments = (name) => api(`/api/homework/assignments/student/${encodeURIComponent(name)}`)
export const getPendingAssignments = () => api("/api/homework/assignments/pending")
export const getHomeworkLibrary = () => api("/api/homework/library")
export const suggestHomework = (name) => api(`/api/homework/suggest/${encodeURIComponent(name)}`)
export const updateAssignment = (id, data) => api(`/api/homework/assignments/${id}`, { method: "PATCH", body: JSON.stringify(data) })
export const createAssignment = (data) => api("/api/homework/assignments", { method: "POST", body: JSON.stringify(data) })
export const getUserByEmail = (email) => api(`/api/users/by-email/${encodeURIComponent(email)}`)
export const getMessages = (studentId) => api(`/api/messages/student/${studentId}`)
export const sendMessage = (data) => api("/api/messages/", { method: "POST", body: JSON.stringify(data) })

export const tamiChat = (studentId, message, history = []) =>
  api("/api/tami/chat", {
    method: "POST",
    body: JSON.stringify({ student_id: studentId, message, conversation_history: history }),
  })

export const tamiWeeklyReview = (studentId) =>
  api("/api/tami/weekly-review", { method: "POST", body: JSON.stringify({ student_id: studentId }) })
