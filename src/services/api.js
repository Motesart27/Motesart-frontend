const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  login: async (email) => {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  register: async ({ name, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    if (!res.ok) throw new Error('Registration failed')
    return res.json()
  },

  getStudents: async () => {
    const res = await fetch(`${BASE_URL}/api/students`)
    return res.json()
  },

  getPracticeLogs: async (studentId) => {
    const res = await fetch(`${BASE_URL}/api/practice-logs/${studentId}`)
    return res.json()
  },

  getHomework: async (studentId) => {
    const res = await fetch(`${BASE_URL}/api/homework/${studentId}`)
    return res.json()
  },

  chatWithTami: async (message, context) => {
    const res = await fetch(`${BASE_URL}/api/tami/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    })
    return res.json()
  }
}

export async function getStudentsWithRisk() {
  const res = await fetch(`${BASE_URL}/api/students`)
  return res.json()
}

export async function tamiWeeklyReview(studentId) {
  const res = await fetch(`${BASE_URL}/api/tami/weekly-review/${studentId}`)
  return res.json()
}

export default api
