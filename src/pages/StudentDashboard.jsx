import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AppointmentCard from '../components/AppointmentCard';

const StudentDashboard = ({ user, appointments, officeHours }) => {
  const myAppointments = appointments.filter(apt => apt.studentId === user.id);
  const availableSlots = officeHours.filter(slot => !slot.isBooked);

  const stats = [
    { label: 'Total Appointments', value: myAppointments.length, color: 'border-blue-500', icon: '📅' },
    { label: 'Pending', value: myAppointments.filter(a => a.status === 'pending').length, color: 'border-yellow-500', icon: '⏳' },
    { label: 'Approved', value: myAppointments.filter(a => a.status === 'approved').length, color: 'border-green-500', icon: '✅' },
    { label: 'Available Slots', value: availableSlots.length, color: 'border-purple-500', icon: '🕐' },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-400">Here's an overview of your appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`bg-gray-800 border-l-4 ${s.color} rounded-lg p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Link
          to="/student/book-appointment"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book New Appointment
        </Link>
      </div>

      {/* Appointments */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">My Appointments</h2>
        {myAppointments.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400 mb-4">No appointments yet</p>
            <Link to="/student/book-appointment" className="text-blue-400 hover:text-blue-300 font-medium">
              Book your first appointment →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myAppointments.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
