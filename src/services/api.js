const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  // --- Auth ---
  register: async ({ name, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Registration failed')
    return data
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Login failed')
    return data
  },

  // --- Students ---
  getStudents: async () => {
    const res = await fetch(`${BASE_URL}/students`)
    return res.json()
  },

  // --- Practice Logs ---
  getPracticeLogs: async (studentId) => {
    const res = await fetch(`${BASE_URL}/practice-logs/${studentId}`)
    return res.json()
  },

  // --- Homework ---
  getHomework: async (studentId) => {
    const res = await fetch(`${BASE_URL}/homework/${studentId}`)
    return res.json()
  },

  // --- T.A.M.i Chat ---
  chatWithTami: async (message, context) => {
    const res = await fetch(`${BASE_URL}/tami/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    })
    return res.json()
  }
}

// Named exports for components that import these directly
export async function getStudentsWithRisk() {
  const res = await fetch(`${BASE_URL}/students`)
  return res.json()
}

export async function tamiWeeklyReview(studentId) {
  const res = await fetch(`${BASE_URL}/tami/weekly-review/${studentId}`)
  return res.json()
}
