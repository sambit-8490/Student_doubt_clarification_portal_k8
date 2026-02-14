import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import AppointmentCard from '../components/AppointmentCard';

// Faculty dashboard for managing office hours and appointments
const FacultyDashboard = ({ user, officeHours, setOfficeHours, appointments, setAppointments, getNextId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState({});

  const myOfficeHours = officeHours.filter(slot => slot.facultyId === user.id);
  const myAppointments = appointments.filter(apt => apt.facultyId === user.id);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date required';
    if (!formData.time) newErrors.time = 'Time required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newSlot = {
      id: getNextId(officeHours),
      facultyId: user.id,
      facultyName: user.name,
      date: formData.date,
      time: formData.time,
      isBooked: false
    };

    setOfficeHours([...officeHours, newSlot]);
    setFormData({ date: '', time: '' });
    setShowCreateForm(false);
  };

  const handleApprove = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'approved' } : apt
    ));
  };

  const handleCancel = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    ));

    setOfficeHours(officeHours.map(slot => 
      slot.id === appointment.officeHourId ? { ...slot, isBooked: false } : slot
    ));
  };

  return (
    <DashboardLayout user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Faculty Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage office hours and appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border-l-4 border-blue-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Total Slots</p>
          <p className="text-3xl font-bold text-white">{myOfficeHours.length}</p>
        </div>
        <div className="bg-gray-800 border-l-4 border-green-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Available</p>
          <p className="text-3xl font-bold text-white">
            {myOfficeHours.filter(s => !s.isBooked).length}
          </p>
        </div>
        <div className="bg-gray-800 border-l-4 border-yellow-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Pending</p>
          <p className="text-3xl font-bold text-white">
            {myAppointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gray-800 border-l-4 border-purple-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Approved</p>
          <p className="text-3xl font-bold text-white">
            {myAppointments.filter(a => a.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-gray-800 border border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Office Hours</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium text-sm"
          >
            {showCreateForm ? 'Cancel' : '+ Create Slot'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateSlot} className="bg-gray-700/50 p-4 mb-4 border border-gray-600">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Time</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="10:00 AM - 11:00 AM"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium"
            >
              Create Slot
            </button>
          </form>
        )}

        <div className="space-y-2">
          {myOfficeHours.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">No slots created</p>
          ) : (
            myOfficeHours.map(slot => (
              <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-700/50 border border-gray-600">
                <div>
                  <p className="font-medium text-white text-sm">{slot.date}</p>
                  <p className="text-xs text-gray-400">{slot.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium ${
                  slot.isBooked 
                    ? 'bg-red-600 text-red-100' 
                    : 'bg-green-600 text-green-100'
                }`}>
                  {slot.isBooked ? 'Booked' : 'Available'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointments */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Student Appointments</h2>
        {myAppointments.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 p-8 text-center">
            <p className="text-gray-400 text-sm">No appointments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                actions={
                  appointment.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(appointment.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
