import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const BookAppointment = ({ user, officeHours, setOfficeHours, appointments, setAppointments }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ facultyId: '', officeHourId: '', doubt: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableSlots = officeHours.filter(slot => !slot.isBooked);
  const availableFaculty = [...new Map(availableSlots.map(slot => [slot.facultyId, slot])).values()];
  const facultySlots = formData.facultyId
    ? availableSlots.filter(slot => slot.facultyId === parseInt(formData.facultyId))
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'facultyId') {
      setFormData({ ...formData, facultyId: value, officeHourId: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.facultyId) newErrors.facultyId = 'Select a faculty';
    if (!formData.officeHourId) newErrors.officeHourId = 'Select a time slot';
    if (!formData.doubt.trim()) newErrors.doubt = 'Describe your doubt';
    else if (formData.doubt.trim().length < 10) newErrors.doubt = 'At least 10 characters required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const newApt = await api.bookAppointment({
        officeHourId: parseInt(formData.officeHourId),
        doubt: formData.doubt
      });
      setAppointments([...appointments, newApt]);
      setOfficeHours(officeHours.map(s => s.id === newApt.officeHourId ? { ...s, isBooked: true } : s));
      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (err) {
      setErrors({ officeHourId: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout user={user}>
        <div className="max-w-md mx-auto mt-16 bg-gray-800 border border-green-700 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Appointment Booked!</h2>
          <p className="text-gray-400">Pending faculty approval. Redirecting...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
          <p className="text-gray-400 text-sm mt-1">Schedule a meeting with your faculty</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Faculty <span className="text-red-400">*</span>
              </label>
              <select
                name="facultyId" value={formData.facultyId} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">-- Select Faculty --</option>
                {availableFaculty.map(slot => (
                  <option key={slot.facultyId} value={slot.facultyId}>{slot.facultyName}</option>
                ))}
              </select>
              {errors.facultyId && <p className="text-red-400 text-xs mt-1">{errors.facultyId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Slot <span className="text-red-400">*</span>
              </label>
              <select
                name="officeHourId" value={formData.officeHourId} onChange={handleChange}
                disabled={!formData.facultyId}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
              >
                <option value="">-- Select Time Slot --</option>
                {facultySlots.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.date} • {slot.time}</option>
                ))}
              </select>
              {errors.officeHourId && <p className="text-red-400 text-xs mt-1">{errors.officeHourId}</p>}
              {formData.facultyId && facultySlots.length === 0 && (
                <p className="text-yellow-400 text-xs mt-1">No available slots for this faculty</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe Your Doubt <span className="text-red-400">*</span>
              </label>
              <textarea
                name="doubt" value={formData.doubt} onChange={handleChange} rows="5"
                placeholder="Explain your doubt in detail so the faculty can prepare..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none transition"
              />
              {errors.doubt && <p className="text-red-400 text-xs mt-1">{errors.doubt}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.doubt.length} characters</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Booking...</> : 'Book Appointment'}
              </button>
              <button
                type="button" onClick={() => navigate('/student/dashboard')}
                className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
