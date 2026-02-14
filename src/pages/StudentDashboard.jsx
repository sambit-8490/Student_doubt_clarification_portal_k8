import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AppointmentCard from '../components/AppointmentCard';

// Student dashboard showing appointments and quick actions
const StudentDashboard = ({ user, appointments, officeHours }) => {
  const myAppointments = appointments.filter(apt => apt.studentId === user.id);
  const availableSlots = officeHours.filter(slot => !slot.isBooked);

  return (
    <DashboardLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.name}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Appointments</p>
          <p className="text-4xl font-bold text-white">{myAppointments.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-4xl font-bold text-white">
            {myAppointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Available Slots</p>
          <p className="text-4xl font-bold text-white">{availableSlots.length}</p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Link
          to="/student/book-appointment"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
        >
          Book New Appointment
        </Link>
      </div>

      {/* My Appointments */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">My Appointments</h2>
        {myAppointments.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">No appointments yet</p>
            <Link
              to="/student/book-appointment"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Book your first appointment →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
