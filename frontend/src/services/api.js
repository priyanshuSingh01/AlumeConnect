const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://alumconnect-api.onrender.com/api')
).replace(/\/+$/, '')

async function request(path, options = {}) {
  const token = localStorage.getItem('alumconnect_token')
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    })
  } catch {
    throw new Error('API unavailable. Check the backend connection.')
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const authApi = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getCurrentUser: () => request('/auth/me'),
}

export const api = {
  getAlumni: (params = '') => request(`/alumni${params}`),
  updateProfile: (payload) => request('/alumni/me', { method: 'PUT', body: JSON.stringify(payload) }),
  connect: (userId) => request(`/alumni/${userId}/connect`, { method: 'POST' }),
  getMentors: () => request('/mentorship/mentors'),
  requestMentorship: (payload) => request('/mentorship/request', { method: 'POST', body: JSON.stringify(payload) }),
  getJobs: (params = '') => request(`/jobs${params}`),
  referJob: (jobId) => request(`/jobs/${jobId}/refer`, { method: 'POST' }),
  getEvents: () => request('/events'),
  registerEvent: (eventId) => request(`/events/${eventId}/register`, { method: 'POST' }),
  getMessages: (userId) => request(`/messages/${userId}`),
  sendMessage: (userId, text) => request(`/messages/${userId}`, { method: 'POST', body: JSON.stringify({ text }) }),
  getNotifications: () => request('/notifications'),
  getAdminStats: () => request('/admin/stats'),
  getVerificationQueue: () => request('/admin/verification'),
}