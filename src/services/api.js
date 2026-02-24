const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  register: async ({ name, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    if (!res.ok) throw new Error('Registration failed')
    return res.json()
  },
  login: async (email) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  }
}

export async function getStudentsWithRisk() {
  const res = await fetch(`${BASE_URL}/students`)
  return res.json()
}

export async function tamiWeeklyReview(studentId) {
  const res = await fetch(`${BASE_URL}/tami/weekly-review/${studentId}`)
  return res.json()
}

export async function getPracticeStats(studentName) {
  const res = await fetch(`${BASE_URL}/practice-stats/${encodeURIComponent(studentName)}`)
  return res.json()
}

export async function getStudentAssignments(studentName) {
  const res = await fetch(`${BASE_URL}/homework/${encodeURIComponent(studentName)}`)
  return res.json()
}

export async function getRecentLogs(studentName) {
  const res = await fetch(`${BASE_URL}/practice-logs/${encodeURIComponent(studentName)}`)
  return res.json()
}

export async function tamiChat(studentName, message, history) {
  const res = await fetch(`${BASE_URL}/tami/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_name: studentName, message, history })
  })
  return res.json()
}
