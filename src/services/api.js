const BASE = '/api';

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

  // Office Hours
  getOfficeHours: () => fetch(`${BASE}/office-hours`, { headers: headers() }).then(handle),
  createOfficeHour: (body) => fetch(`${BASE}/office-hours`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),

  // Appointments
  getAppointments: () => fetch(`${BASE}/appointments`, { headers: headers() }).then(handle),
  bookAppointment: (body) => fetch(`${BASE}/appointments`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  updateAppointment: (id, body) => fetch(`${BASE}/appointments/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) }).then(handle),
};
