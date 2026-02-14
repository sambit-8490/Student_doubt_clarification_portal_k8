import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import BookAppointment from './pages/BookAppointment';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { users as initialUsers, officeHours as initialOfficeHours, appointments as initialAppointments, getNextId } from './data/mockData';

// Main App component with routing and state management
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [officeHours, setOfficeHours] = useState(initialOfficeHours);
  const [appointments, setAppointments] = useState(initialAppointments);

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={<Login setCurrentUser={setCurrentUser} users={users} />} 
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            currentUser?.role === 'student' ? (
              <StudentDashboard 
                user={currentUser} 
                appointments={appointments}
                officeHours={officeHours}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/student/book-appointment"
          element={
            currentUser?.role === 'student' ? (
              <BookAppointment 
                user={currentUser}
                officeHours={officeHours}
                setOfficeHours={setOfficeHours}
                appointments={appointments}
                setAppointments={setAppointments}
                getNextId={getNextId}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            currentUser?.role === 'faculty' ? (
              <FacultyDashboard 
                user={currentUser}
                officeHours={officeHours}
                setOfficeHours={setOfficeHours}
                appointments={appointments}
                setAppointments={setAppointments}
                getNextId={getNextId}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            currentUser?.role === 'admin' ? (
              <AdminDashboard 
                user={currentUser}
                users={users}
                setUsers={setUsers}
                getNextId={getNextId}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
