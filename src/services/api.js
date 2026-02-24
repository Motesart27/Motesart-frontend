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
  },
  getStudents: async () => {
    const res = await fetch(`${BASE_URL}/students`)
    return res.json()
  },
  getPracticeLogs: async (studentId) => {
    const res = await fetch(`${BASE_URL}/practice-logs/${studentId}`)
    return res.json()
  },
  getHomework: async (studentId) => {
    const res = await fetch(`${BASE_URL}/homework/${studentId}`)
    return res.json()
  },
  chatWithTami: async (message, context) => {
    const res = await fetch(`${BASE_URL}/tami/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    })
    return res.json()
  }
}
