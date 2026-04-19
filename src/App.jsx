import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import BookAppointment from './pages/BookAppointment';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState([]);
  const [officeHours, setOfficeHours] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUsers([]);
    setOfficeHours([]);
    setAppointments([]);
  };

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const fetches = [api.getOfficeHours(), api.getAppointments()];
    if (currentUser.role === 'admin') fetches.push(api.getUsers());

    Promise.all(fetches)
      .then(([oh, apts, usrs]) => {
        setOfficeHours(oh);
        setAppointments(apts);
        if (usrs) setUsers(usrs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        <Route path="/student/dashboard" element={
          currentUser?.role === 'student'
            ? <StudentDashboard user={currentUser} appointments={appointments} officeHours={officeHours} />
            : <Navigate to="/" replace />
        } />
        <Route path="/student/book-appointment" element={
          currentUser?.role === 'student'
            ? <BookAppointment user={currentUser} officeHours={officeHours} setOfficeHours={setOfficeHours} appointments={appointments} setAppointments={setAppointments} />
            : <Navigate to="/" replace />
        } />

        <Route path="/faculty/dashboard" element={
          currentUser?.role === 'faculty'
            ? <FacultyDashboard user={currentUser} officeHours={officeHours} setOfficeHours={setOfficeHours} appointments={appointments} setAppointments={setAppointments} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />

        <Route path="/admin/dashboard" element={
          currentUser?.role === 'admin'
            ? <AdminDashboard user={currentUser} users={users} setUsers={setUsers} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
