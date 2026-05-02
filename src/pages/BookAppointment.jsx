import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const TAGS = ['DSA', 'DBMS', 'OS', 'Networks', 'Math', 'Other'];

const tagColors = {
  DSA:      'bg-blue-100 text-blue-700 border-blue-300',
  DBMS:     'bg-purple-100 text-purple-700 border-purple-300',
  OS:       'bg-orange-100 text-orange-700 border-orange-300',
  Networks: 'bg-green-100 text-green-700 border-green-300',
  Math:     'bg-pink-100 text-pink-700 border-pink-300',
  Other:    'bg-gray-100 text-gray-700 border-gray-300',
};

const BookAppointment = ({ user, officeHours, setOfficeHours, appointments, setAppointments }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ facultyId: '', officeHourId: '', doubt: '', tag: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState([]);

  const availableSlots = officeHours.filter(s => !s.isBooked);

  // Build faculty list from available slots + search filter
  const uniqueFaculty = [...new Map(availableSlots.map(s => [s.facultyId, s])).values()];
  const filteredFaculty = uniqueFaculty.filter(f =>
    search === '' || f.facultyName?.toLowerCase().includes(search.toLowerCase())
  );

  const facultySlots = formData.facultyId
    ? availableSlots.filter(s => s.facultyId === parseInt(formData.facultyId))
    : [];

  const selectedFaculty = uniqueFaculty.find(f => f.facultyId === parseInt(formData.facultyId));

  const handleSelectFaculty = (facultyId) => {
    setFormData(prev => ({ ...prev, facultyId: String(facultyId), officeHourId: '' }));
    if (errors.facultyId) setErrors(e => ({ ...e, facultyId: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.facultyId) e.facultyId = 'Please select a faculty member';
    if (!formData.officeHourId) e.officeHourId = 'Please select a time slot';
    if (!formData.doubt.trim()) e.doubt = 'Please describe your doubt';
    else if (formData.doubt.trim().length < 10) e.doubt = 'At least 10 characters required';
    if (!formData.tag) e.tag = 'Please select a subject tag';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const newApt = await api.bookAppointment({
        officeHourId: parseInt(formData.officeHourId),
        doubt: formData.doubt,
        tag: formData.tag,
      });
      setAppointments([...appointments, newApt]);
      setOfficeHours(officeHours.map(s => s.id === newApt.officeHourId ? { ...s, isBooked: true } : s));
      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 2500);
    } catch (err) {
      setErrors({ officeHourId: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  if (success) return (
    <DashboardLayout user={user}>
      <div className="max-w-md mx-auto mt-20 bg-white border border-green-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 text-sm">Pending faculty approval. Redirecting to dashboard...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl">
        <div className="mb-6 pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-500 mt-1 text-sm">Schedule a session with your faculty to resolve your doubts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── STEP 1: Select Faculty ── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Select Faculty Member
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search faculty by name..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            {/* Faculty Cards */}
            {filteredFaculty.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No faculty with available slots found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredFaculty.map(f => {
                  const slotCount = availableSlots.filter(s => s.facultyId === f.facultyId).length;
                  const selected = formData.facultyId === String(f.facultyId);
                  return (
                    <button key={f.facultyId} type="button"
                      onClick={() => handleSelectFaculty(f.facultyId)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                        selected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${selected ? 'bg-blue-700' : 'bg-gray-400'}`}>
                        {f.facultyName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm truncate ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {f.facultyName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{slotCount} slot{slotCount !== 1 ? 's' : ''} available</p>
                      </div>
                      {selected && (
                        <svg className="w-5 h-5 text-blue-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.facultyId && <p className="text-red-500 text-xs mt-2">{errors.facultyId}</p>}
          </div>

          {/* ── STEP 2: Select Time Slot ── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Select Time Slot
            </h3>
            {!formData.facultyId ? (
              <p className="text-gray-400 text-sm text-center py-4">Select a faculty member first</p>
            ) : facultySlots.length === 0 ? (
              <p className="text-yellow-600 text-sm text-center py-4">No available slots for this faculty</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facultySlots.map(slot => {
                  const selected = formData.officeHourId === String(slot.id);
                  return (
                    <button key={slot.id} type="button"
                      onClick={() => { setFormData(p => ({ ...p, officeHourId: String(slot.id) })); setErrors(e => ({ ...e, officeHourId: '' })); }}
                      className={`p-3 rounded-xl border-2 text-left transition ${
                        selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}>
                      <p className={`text-xs font-semibold ${selected ? 'text-blue-800' : 'text-gray-800'}`}>{slot.date}</p>
                      <p className={`text-xs mt-0.5 ${selected ? 'text-blue-600' : 'text-gray-500'}`}>{slot.time}</p>
                    </button>
                  );
                })}
              </div>
            )}
            {errors.officeHourId && <p className="text-red-500 text-xs mt-2">{errors.officeHourId}</p>}
          </div>

          {/* ── STEP 3: Subject Tag + Doubt ── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Describe Your Doubt
            </h3>

            {/* Tag selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Tag <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button key={tag} type="button"
                    onClick={() => { setFormData(p => ({ ...p, tag })); setErrors(e => ({ ...e, tag: '' })); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      formData.tag === tag
                        ? tagColors[tag] + ' ring-2 ring-offset-1 ring-blue-400'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
              {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag}</p>}
            </div>

            {/* Doubt textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Doubt Description <span className="text-red-500">*</span>
              </label>
              <textarea name="doubt" value={formData.doubt} onChange={handleChange} rows={5}
                placeholder="Explain your doubt in detail so the faculty can prepare for the session..."
                className={`${inputCls} resize-none`} />
              {errors.doubt && <p className="text-red-500 text-xs mt-1">{errors.doubt}</p>}
              <p className="text-gray-400 text-xs mt-1">{formData.doubt.length} / 500 characters</p>
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2 text-sm">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Booking...</>
                : 'Confirm Booking'}
            </button>
            <button type="button" onClick={() => navigate('/student/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
