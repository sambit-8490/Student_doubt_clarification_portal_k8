import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const ProfilePage = ({ user, setCurrentUser, onLogout }) => {
  const [formData, setFormData] = useState({ name: user?.name || '', department: user?.department || '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (user?.role === 'faculty') {
      api.getFacultyReviews(user.id)
        .then(res => { setReviews(res.reviews); setAvgRating(res.averageRating); })
        .catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Name is required');
    setSaving(true); setError('');
    try {
      const updated = await api.updateProfile(formData);
      const newUser = { ...user, ...updated };
      localStorage.setItem('user', JSON.stringify(newUser));
      if (setCurrentUser) setCurrentUser(newUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const stars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
  ));

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
              {user?.role}
            </span>
            {user?.department && (
              <p className="text-gray-500 text-sm mt-2">{user?.department}</p>
            )}
            {user?.role === 'faculty' && avgRating > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-center gap-0.5 text-lg">{stars(Math.round(avgRating))}</div>
                <p className="text-sm font-semibold text-gray-700 mt-1">{avgRating} / 5</p>
                <p className="text-xs text-gray-400">{reviews.length} reviews</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Edit Information</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" value={user?.email} disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              {(user?.role === 'faculty' || user?.role === 'admin') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <input type="text" value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Profile updated successfully!
                </div>
              )}
              <button type="submit" disabled={saving}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm disabled:opacity-60 transition">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Faculty Reviews */}
          {user?.role === 'faculty' && reviews.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Student Reviews</h3>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{r.studentName}</p>
                      <div className="flex gap-0.5 text-sm">{stars(r.rating)}</div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
