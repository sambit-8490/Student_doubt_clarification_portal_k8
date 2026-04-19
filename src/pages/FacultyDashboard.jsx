import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import AppointmentCard from '../components/AppointmentCard';
import { api } from '../services/api';

const FacultyDashboard = ({ user, officeHours, setOfficeHours, appointments, setAppointments, onLogout }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const myOfficeHours = officeHours.filter(slot => slot.facultyId === user.id);
  const myAppointments = appointments.filter(apt => apt.facultyId === user.id);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date required';
    if (!formData.time) newErrors.time = 'Time required';
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setSubmitting(true);
    try {
      const newSlot = await api.createOfficeHour(formData);
      setOfficeHours([...officeHours, newSlot]);
      setFormData({ date: '', time: '' });
      setShowCreateForm(false);
    } catch (err) {
      setErrors({ time: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const updated = await api.updateAppointment(id, { status: 'approved' });
      setAppointments(appointments.map(a => a.id === id ? updated : a));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      const updated = await api.updateAppointment(id, { status: 'cancelled' });
      setAppointments(appointments.map(a => a.id === id ? updated : a));
      setOfficeHours(officeHours.map(s => s.id === updated.officeHourId ? { ...s, isBooked: false } : s));
    } catch (err) {
      alert(err.message);
    }
  };

  const stats = [
    { label: 'Total Slots', value: myOfficeHours.length, color: 'border-blue-500' },
    { label: 'Available', value: myOfficeHours.filter(s => !s.isBooked).length, color: 'border-green-500' },
    { label: 'Pending', value: myAppointments.filter(a => a.status === 'pending').length, color: 'border-yellow-500' },
    { label: 'Approved', value: myAppointments.filter(a => a.status === 'approved').length, color: 'border-purple-500' },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Faculty Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage your office hours and student appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-gray-800 border-l-4 ${s.color} rounded-lg p-5`}>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Office Hours */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Office Hours</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${showCreateForm ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {showCreateForm ? 'Cancel' : '+ Create Slot'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateSlot} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Date</label>
                <input
                  type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Time</label>
                <input
                  type="text" name="time" value={formData.time} onChange={handleChange}
                  placeholder="10:00 AM - 11:00 AM"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>
            <button
              type="submit" disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition"
            >
              {submitting ? 'Creating...' : 'Create Slot'}
            </button>
          </form>
        )}

        <div className="space-y-2">
          {myOfficeHours.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">No slots created yet</p>
          ) : (
            myOfficeHours.map(slot => (
              <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                <div>
                  <p className="font-medium text-white text-sm">{slot.date}</p>
                  <p className="text-xs text-gray-400">{slot.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${slot.isBooked ? 'bg-red-900/50 text-red-300 border border-red-700' : 'bg-green-900/50 text-green-300 border border-green-700'}`}>
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
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400 text-sm">No appointments yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAppointments.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                actions={apt.status === 'pending' ? (
                  <>
                    <button onClick={() => handleApprove(apt.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm transition">
                      Approve
                    </button>
                    <button onClick={() => handleCancel(apt.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg text-sm transition">
                      Cancel
                    </button>
                  </>
                ) : null}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
