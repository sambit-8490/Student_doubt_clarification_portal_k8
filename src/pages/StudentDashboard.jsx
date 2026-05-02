import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AppointmentCard from '../components/AppointmentCard';

const StudentDashboard = ({ user, appointments, officeHours }) => {
  const myAppointments = appointments.filter(apt => apt.studentId === user.id);
  const availableSlots = officeHours.filter(slot => !slot.isBooked);

  const stats = [
    { label: 'Total Appointments', value: myAppointments.length, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { label: 'Pending', value: myAppointments.filter(a => a.status === 'pending').length, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Approved', value: myAppointments.filter(a => a.status === 'approved').length, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Available Slots', value: availableSlots.length, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
    )},
  ];

  return (
    <DashboardLayout user={user}>
      {/* Page Header */}
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <p className="text-gray-500 mt-1 text-sm">Track your appointments and book new sessions with faculty</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">{s.icon}</div>
            </div>
            <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-gray-600 text-sm mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Banner */}
      <div className="bg-blue-700 rounded-xl p-5 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-base">Need help from a faculty member?</h3>
          <p className="text-blue-200 text-sm mt-0.5">Book an appointment and get your doubts resolved</p>
        </div>
        <Link to="/student/book-appointment"
          className="flex-shrink-0 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Book Appointment
        </Link>
      </div>

      {/* Appointments */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">My Appointments</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{myAppointments.length} total</span>
        </div>
        <div className="p-6">
          {myAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-gray-500 font-medium mb-1">No appointments yet</p>
              <p className="text-gray-400 text-sm mb-4">Book your first appointment with a faculty member</p>
              <Link to="/student/book-appointment" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Book an appointment →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} showReview={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
