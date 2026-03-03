const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Students
  getStudents: () => request('/students'),
  getStudentByEmail: (email) => request(`/student?email=${encodeURIComponent(email)}`),

  // Practice
  getPracticeLogs: (studentId) => request(`/practice-logs?student_id=${encodeURIComponent(studentId)}`),
  logPractice: (data) => request('/practice-logs', { method: 'POST', body: JSON.stringify(data) }),

  // Homework
  getHomework: (studentId) => request(`/homework?student_id=${encodeURIComponent(studentId)}`),

  // Sessions
  getSessions: (studentId) => request(`/sessions?student_id=${encodeURIComponent(studentId)}`),

  // ===== T.A.M.i Chat (FIXED: correct field names) =====
  chatWithTami: (studentName, message, conversationHistory = []) =>
    request('/tami/chat', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentName,
        message: message,
        conversation_history: conversationHistory,
      }),
    }),

  // T.A.M.i Voice
  chatWithTamiVoice: (studentName, message, conversationHistory = []) =>
    request('/tami/chat/voice', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentName,
        message: message,
        conversation_history: conversationHistory,
      }),
    }),

  // T.A.M.i Weekly Review
  tamiWeeklyReview: (studentName) =>
    request('/tami/weekly-review', {
      method: 'POST',
      body: JSON.stringify({ student_name: studentName }),
    }),

  // Health check
  wake: () => fetch(`${API_URL}/`).then(r => r.json()),
}

export default api
