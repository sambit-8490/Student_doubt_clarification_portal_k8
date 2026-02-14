import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

// Book appointment page with form validation
const BookAppointment = ({ user, officeHours, setOfficeHours, appointments, setAppointments, getNextId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facultyId: '',
    officeHourId: '',
    doubt: ''
  });
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
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'facultyId') {
      setFormData({ ...formData, facultyId: value, officeHourId: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.facultyId) newErrors.facultyId = 'Select faculty';
    if (!formData.officeHourId) newErrors.officeHourId = 'Select time slot';
    if (!formData.doubt.trim()) newErrors.doubt = 'Describe your doubt';
    else if (formData.doubt.trim().length < 10) newErrors.doubt = 'At least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const selectedSlot = officeHours.find(slot => slot.id === parseInt(formData.officeHourId));
      
      if (selectedSlot.isBooked) {
        setErrors({ officeHourId: 'Slot already booked' });
        setLoading(false);
        return;
      }

      const newAppointment = {
        id: getNextId(appointments),
        studentId: user.id,
        studentName: user.name,
        facultyId: selectedSlot.facultyId,
        facultyName: selectedSlot.facultyName,
        officeHourId: selectedSlot.id,
        date: selectedSlot.date,
        time: selectedSlot.time,
        doubt: formData.doubt,
        status: 'pending'
      };

      setAppointments([...appointments, newAppointment]);
      setOfficeHours(officeHours.map(slot => 
        slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
      ));

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    }, 800);
  };

  if (success) {
    return (
      <DashboardLayout user={user}>
        <div className="bg-green-900/50 border border-green-700 p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Appointment Booked!</h2>
          <p className="text-green-300 mb-4">Pending faculty approval</p>
          <p className="text-sm text-green-400">Redirecting...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
        <p className="text-gray-400 text-sm">Schedule meeting with faculty</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Faculty <span className="text-red-400">*</span>
            </label>
            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Select Faculty --</option>
              {availableFaculty.map(slot => (
                <option key={slot.facultyId} value={slot.facultyId}>
                  {slot.facultyName}
                </option>
              ))}
            </select>
            {errors.facultyId && <p className="text-red-400 text-xs mt-1">{errors.facultyId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Slot <span className="text-red-400">*</span>
            </label>
            <select
              name="officeHourId"
              value={formData.officeHourId}
              onChange={handleChange}
              disabled={!formData.facultyId}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">-- Select Time --</option>
              {facultySlots.map(slot => (
                <option key={slot.id} value={slot.id}>
                  {slot.date} • {slot.time}
                </option>
              ))}
            </select>
            {errors.officeHourId && <p className="text-red-400 text-xs mt-1">{errors.officeHourId}</p>}
            {formData.facultyId && facultySlots.length === 0 && (
              <p className="text-yellow-400 text-xs mt-1">No slots available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Doubt <span className="text-red-400">*</span>
            </label>
            <textarea
              name="doubt"
              value={formData.doubt}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your doubt..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
            {errors.doubt && <p className="text-red-400 text-xs mt-1">{errors.doubt}</p>}
            <p className="text-gray-500 text-xs mt-1">{formData.doubt.length} chars</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 disabled:bg-gray-600"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2 border border-gray-600 text-gray-300 font-medium hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
