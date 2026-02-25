const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  // ── Auth ──
  login: (email) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // ── Users ──
  getUser: (userId) => request(`/api/users/${userId}`),
  updateUser: (userId, fields) =>
    request(`/api/users/${userId}`, { method: 'PATCH', body: JSON.stringify(fields) }),

  // ── Students ──
  getStudents: () => request('/api/students'),
  getStudent: (studentId) => request(`/api/students/${studentId}`),
  getStudentByUser: (userId) => request(`/api/students/by-user/${userId}`),

  // ── Sessions (Game) ──
  getSessions: (userId) => request(`/api/sessions?user_id=${userId}`),
  createSession: (data) =>
    request('/api/sessions', { method: 'POST', body: JSON.stringify(data) }),

  // ── Practice Logs ──
  getPracticeLogs: (studentId) => request(`/api/practice-logs?student_id=${studentId}`),
  createPracticeLog: (data) =>
    request('/api/practice-logs', { method: 'POST', body: JSON.stringify(data) }),

  // ── Homework ──
  getHomework: (studentId) => request(`/api/homework?student_id=${studentId}`),
  updateHomework: (hwId, fields) =>
    request(`/api/homework/${hwId}`, { method: 'PATCH', body: JSON.stringify(fields) }),

  // ── T.A.M.i ──
  tamiChat: (message, context) =>
    request('/api/tami/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
  tamiDashboard: (studentName) =>
    request(`/api/tami/dashboard?student=${encodeURIComponent(studentName)}`),

  // ── Messages ──
  getMessages: (userId) => request(`/api/messages?user_id=${userId}`),
  sendMessage: (data) =>
    request('/api/messages', { method: 'POST', body: JSON.stringify(data) }),

  // ── Classes (Teacher) ──
  getClasses: (teacherId) => request(`/api/classes?teacher_id=${teacherId}`),
  createClass: (data) =>
    request('/api/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (classId, fields) =>
    request(`/api/classes/${classId}`, { method: 'PATCH', body: JSON.stringify(fields) }),

  // ── Leaderboard ──
  getLeaderboard: () => request('/api/leaderboard'),
}
