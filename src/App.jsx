import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import ArchitectureDiagram from './diagrams/ArchitectureDiagram';
import ERDiagram from './diagrams/ERDiagram';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const isLoggedIn = !!currentUser;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Student */}
        <Route path="/student/dashboard" element={
          currentUser?.role === 'student'
            ? <StudentDashboard user={currentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />

        {/* Faculty */}
        <Route path="/faculty/dashboard" element={
          currentUser?.role === 'faculty'
            ? <FacultyDashboard user={currentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          currentUser?.role === 'admin'
            ? <AdminDashboard user={currentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/admin/analytics" element={
          currentUser?.role === 'admin'
            ? <AnalyticsDashboard user={currentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />

        {/* Shared */}
        <Route path="/community" element={
          isLoggedIn
            ? <CommunityPage user={currentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/profile" element={
          isLoggedIn
            ? <ProfilePage user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/chat" element={
          isLoggedIn
            ? <ChatPage user={currentUser} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />

        {/* Diagrams */}
        <Route path="/diagram" element={<ArchitectureDiagram />} />
        <Route path="/er-diagram" element={<ERDiagram />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
