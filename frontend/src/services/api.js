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
  deleteAccount: (password) => request('/auth/me', { method: 'DELETE', body: JSON.stringify({ password }) }),
}

export const api = {
  getAlumni: (params = '') => request(`/alumni${params}`),
  getConnections: () => request('/alumni/connections'),
  getAlumniLocations: () => request('/alumni/locations'),
  updateProfile: (payload) => request('/alumni/me', { method: 'PUT', body: JSON.stringify(payload) }),
  connect: (userId) => request(`/alumni/${userId}/connect`, { method: 'POST' }),
  getMentors: () => request('/mentorship/mentors'),
  getMentorshipRequests: () => request('/mentorship/requests'),
  requestMentorship: (payload) => request('/mentorship/request', { method: 'POST', body: JSON.stringify(payload) }),
  respondToMentorshipRequest: (requestId, status) => request(`/mentorship/requests/${requestId}/respond`, { method: 'POST', body: JSON.stringify({ status }) }),
  getJobs: (params = '') => request(`/jobs${params}`),
  createJob: (payload) => request('/jobs', { method: 'POST', body: JSON.stringify(payload) }),
  applyJob: (jobId) => request(`/jobs/${jobId}/apply`, { method: 'POST' }),
  referJob: (jobId) => request(`/jobs/${jobId}/refer`, { method: 'POST' }),
  getEvents: () => request('/events'),
  createEvent: (payload) => request('/events', { method: 'POST', body: JSON.stringify(payload) }),
  registerEvent: (eventId) => request(`/events/${eventId}/register`, { method: 'POST' }),
  getMessages: (userId) => request(`/messages/${userId}`),
  sendMessage: (userId, text) => request(`/messages/${userId}`, { method: 'POST', body: JSON.stringify({ text }) }),
  getNotifications: () => request('/notifications'),
  markNotificationRead: (notificationId) => request(`/notifications/${notificationId}/read`, { method: 'PATCH' }),
  getAdminStats: () => request('/admin/stats'),
  getVerificationQueue: () => request('/admin/verification'),
  updateVerification: (userId, approved) => request(`/admin/verification/${userId}`, { method: 'PATCH', body: JSON.stringify({ approved }) }),
}