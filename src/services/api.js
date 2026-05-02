const BASE = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  // Auth
  login: (body) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handle),

  // Users
  getUsers: () => fetch(`${BASE}/users`, { headers: headers() }).then(handle),
  addUser: (body) => fetch(`${BASE}/users`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  deleteUser: (id) => fetch(`${BASE}/users/${id}`, { method: 'DELETE', headers: headers() }).then(handle),
  getFaculty: (search = '') => fetch(`${BASE}/users/faculty?search=${search}`, { headers: headers() }).then(handle),

  // Profile
  getProfile: () => fetch(`${BASE}/users/me`, { headers: headers() }).then(handle),
  updateProfile: (body) => fetch(`${BASE}/users/me`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) }).then(handle),

  // Community Q&A
  getQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/questions?${q}`, { headers: headers() }).then(handle);
  },
  getQuestion: (id) => fetch(`${BASE}/questions/${id}`, { headers: headers() }).then(handle),
  postQuestion: (body) => fetch(`${BASE}/questions`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  postAnswer: (questionId, body) => fetch(`${BASE}/questions/${questionId}/answers`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  upvoteAnswer: (questionId, answerId) => fetch(`${BASE}/questions/${questionId}/answers/${answerId}/upvote`, { method: 'PATCH', headers: headers() }).then(handle),
  acceptAnswer: (questionId, answerId) => fetch(`${BASE}/questions/${questionId}/answers/${answerId}/accept`, { method: 'PATCH', headers: headers() }).then(handle),

  // Notifications
  getNotifications: () => fetch(`${BASE}/notifications`, { headers: headers() }).then(handle),
  getUnreadCount: () => fetch(`${BASE}/notifications/unread-count`, { headers: headers() }).then(handle),
  markAllRead: () => fetch(`${BASE}/notifications/mark-all-read`, { method: 'PATCH', headers: headers() }).then(handle),
  markRead: (id) => fetch(`${BASE}/notifications/${id}/read`, { method: 'PATCH', headers: headers() }).then(handle),

  // Messages
  getConversations: () => fetch(`${BASE}/messages`, { headers: headers() }).then(handle),
  getConversation: (userId) => fetch(`${BASE}/messages/${userId}`, { headers: headers() }).then(handle),
  sendMessage: (receiverId, content) => fetch(`${BASE}/messages/${receiverId}`, { method: 'POST', headers: headers(), body: JSON.stringify({ content }) }).then(handle),
  getAvailableUsers: () => fetch(`${BASE}/messages/users/available`, { headers: headers() }).then(handle),
  getMessageUnreadCount: () => fetch(`${BASE}/messages/unread-count`, { headers: headers() }).then(handle),

  // Reviews
  submitReview: (body) => fetch(`${BASE}/reviews`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  getFacultyReviews: (facultyId) => fetch(`${BASE}/reviews/faculty/${facultyId}`, { headers: headers() }).then(handle),
  getAppointmentReview: (appointmentId) => fetch(`${BASE}/reviews/appointment/${appointmentId}`, { headers: headers() }).then(handle),

  // Analytics (admin)
  getAnalytics: () => fetch(`${BASE}/analytics`, { headers: headers() }).then(handle),
};
