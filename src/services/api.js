const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  register: async ({ name, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Registration failed') }
    return res.json()
  },
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Login failed') }
    return res.json()
  },
  getStudents: async () => { const r = await fetch(`${BASE_URL}/students`); return r.json() },
  getPracticeLogs: async (id) => { const r = await fetch(`${BASE_URL}/practice-logs/${id}`); return r.json() },
  getHomework: async (id) => { const r = await fetch(`${BASE_URL}/homework/${id}`); return r.json() },
  chatWithTami: async (message, context) => {
    const r = await fetch(`${BASE_URL}/tami/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, context }) })
    return r.json()
  }
}
