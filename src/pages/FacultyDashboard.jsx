import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const FacultyDashboard = ({ user, onLogout }) => {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
        <p className="text-gray-500 mt-1 text-sm">Answer student doubts and chat privately</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-1">Community Q&A</h3>
          <p className="text-purple-100 text-sm mb-4">View and answer student doubts in the community</p>
          <Link to="/community" className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-purple-50 transition inline-block">
            Go to Community →
          </Link>
        </div>
        <div className="bg-green-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-1">Messages</h3>
          <p className="text-green-100 text-sm mb-4">Chat privately with students</p>
          <Link to="/chat" className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition inline-block">
            Open Messages →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;

/* ── Doubt Preview Modal ── */
const DoubtPreviewModal = ({ appointment, onApprove, onCancel, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Appointment Request</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Student info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold">
          {appointment.studentName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{appointment.studentName}</p>
          <p className="text-xs text-gray-500">{appointment.date} • {appointment.time}</p>
        </div>
        {appointment.tag && (
          <span className="ml-auto px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {appointment.tag}
          </span>
        )}
      </div>

      {/* Doubt */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-2">Student's Doubt</p>
        <p className="text-sm text-gray-800 leading-relaxed">{appointment.doubt}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onApprove}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">
          ✓ Approve
        </button>
        <button onClick={onCancel}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl text-sm border border-red-200 transition">
          ✕ Cancel
        </button>
        <button onClick={onClose}
          className="px-5 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition">
          Later
        </button>
      </div>
    </div>
  </div>
);

const FacultyDashboard = ({ user, officeHours, setOfficeHours, appointments, setAppointments, onLogout }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', recurring: false, repeatWeeks: 1 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notesMap, setNotesMap] = useState({});
  const [previewApt, setPreviewApt] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const myOfficeHours = officeHours.filter(s => s.facultyId === user.id);
  const myAppointments = appointments.filter(a => a.facultyId === user.id);
  const tabAppointments = myAppointments.filter(a => a.status === activeTab);

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
      const result = await api.createOfficeHour(formData);
      const newSlots = Array.isArray(result) ? result : [result];
      setOfficeHours([...officeHours, ...newSlots]);
      setFormData({ date: '', time: '', recurring: false, repeatWeeks: 1 });
      setShowCreateForm(false);
    } catch (err) {
      setErrors({ time: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await api.deleteOfficeHour(id);
      setOfficeHours(officeHours.filter(s => s.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleApprove = async (id) => {
    try {
      const updated = await api.updateAppointment(id, { status: 'approved' });
      setAppointments(appointments.map(a => a.id === id ? updated : a));
      setPreviewApt(null);
    } catch (err) { alert(err.message); }
  };

  const handleCancel = async (id) => {
    try {
      const updated = await api.updateAppointment(id, { status: 'cancelled' });
      setAppointments(appointments.map(a => a.id === id ? updated : a));
      setOfficeHours(officeHours.map(s => s.id === updated.officeHourId ? { ...s, isBooked: false } : s));
      setPreviewApt(null);
    } catch (err) { alert(err.message); }
  };

  const handleComplete = async (id) => {
    try {
      const updated = await api.updateAppointment(id, { status: 'completed', notes: notesMap[id] || '' });
      setAppointments(appointments.map(a => a.id === id ? updated : a));
    } catch (err) { alert(err.message); }
  };

  const stats = [
    { label: 'Total Slots',  value: myOfficeHours.length,                                  bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
    { label: 'Available',    value: myOfficeHours.filter(s => !s.isBooked).length,          bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700'  },
    { label: 'Pending',      value: myAppointments.filter(a => a.status === 'pending').length,   bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    { label: 'Completed',    value: myAppointments.filter(a => a.status === 'completed').length, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  ];

  const tabs = ['pending', 'approved', 'completed', 'cancelled'];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      {previewApt && (
        <DoubtPreviewModal
          appointment={previewApt}
          onApprove={() => handleApprove(previewApt.id)}
          onCancel={() => handleCancel(previewApt.id)}
          onClose={() => setPreviewApt(null)}
        />
      )}

      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your office hours and student appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-5`}>
            <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-gray-600 text-sm mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Office Hours (left, 2 cols) ── */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Office Hours</h2>
            <button onClick={() => setShowCreateForm(!showCreateForm)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                showCreateForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}>
              {showCreateForm ? 'Cancel' : '+ Add Slot'}
            </button>
          </div>

          <div className="p-5">
            {showCreateForm && (
              <form onSubmit={handleCreateSlot} className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">New Slot</p>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <input type="text" name="time" value={formData.time} onChange={handleChange}
                    placeholder="10:00 AM - 11:00 AM"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="recurring" checked={formData.recurring}
                    onChange={e => setFormData({ ...formData, recurring: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded" />
                  <label htmlFor="recurring" className="text-xs font-medium text-gray-700">Repeat weekly for</label>
                  {formData.recurring && (
                    <input type="number" min={2} max={12} value={formData.repeatWeeks}
                      onChange={e => setFormData({ ...formData, repeatWeeks: parseInt(e.target.value) })}
                      className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:border-blue-500" />
                  )}
                  {formData.recurring && <span className="text-xs text-gray-500">weeks</span>}
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition">
                  {submitting ? 'Creating...' : formData.recurring ? `Create ${formData.repeatWeeks} Slots` : 'Create Slot'}
                </button>
              </form>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {myOfficeHours.length === 0 ? (
                <p className="text-gray-400 text-center py-8 text-sm">No slots created yet</p>
              ) : (
                myOfficeHours.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg group">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{slot.date}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{slot.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        slot.isBooked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                      {!slot.isBooked && (
                        <button onClick={() => handleDeleteSlot(slot.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Appointments (right, 3 cols) ── */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Student Appointments</h2>
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                    activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab}
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {myAppointments.filter(a => a.status === tab).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 max-h-[600px] overflow-y-auto">
            {tabAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm capitalize">No {activeTab} appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tabAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt}
                    actions={
                      apt.status === 'pending' ? (
                        <button onClick={() => setPreviewApt(apt)}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg text-sm border border-blue-200 transition flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview & Decide
                        </button>
                      ) : apt.status === 'approved' ? (
                        <div className="flex flex-col gap-2 w-full">
                          <textarea
                            placeholder="Add session notes (optional)..."
                            value={notesMap[apt.id] || ''}
                            onChange={e => setNotesMap(p => ({ ...p, [apt.id]: e.target.value }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs resize-none focus:outline-none focus:border-blue-500"
                          />
                          <button onClick={() => handleComplete(apt.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg text-sm transition">
                            ✓ Mark as Completed
                          </button>
                        </div>
                      ) : null
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
