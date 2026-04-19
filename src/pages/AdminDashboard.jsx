import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const AdminDashboard = ({ user, users, setUsers, onLogout }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student', password: '', department: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.password.trim()) newErrors.password = 'Password required';
    if (formData.role === 'faculty' && !formData.department.trim()) newErrors.department = 'Department required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const newUser = await api.addUser(formData);
      setUsers([...users, newUser]);
      setFormData({ name: '', email: '', role: 'student', password: '', department: '' });
      setShowAddForm(false);
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) return alert('Cannot delete yourself');
    if (!window.confirm('Delete this user?')) return;

    try {
      await api.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, color: 'border-blue-500' },
    { label: 'Students', value: users.filter(u => u.role === 'student').length, color: 'border-green-500' },
    { label: 'Faculty', value: users.filter(u => u.role === 'faculty').length, color: 'border-purple-500' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'border-yellow-500' },
  ];

  const roleColors = {
    admin: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    faculty: 'bg-purple-900/50 text-purple-300 border border-purple-700',
    student: 'bg-blue-900/50 text-blue-300 border border-blue-700',
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 text-sm">Manage system users</p>
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

      {/* User Management */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Users</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${showAddForm ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {showAddForm ? 'Cancel' : '+ Add User'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddUser} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Full name" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="email@college.edu" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Role</label>
                <select name="role" value={formData.role} onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Password" />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              {formData.role === 'faculty' && (
                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Computer Science" />
                  {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                </div>
              )}
            </div>
            <button type="submit" disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition">
              {submitting ? 'Adding...' : 'Add User'}
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {['ID', 'Name', 'Email', 'Role', 'Department', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                  <td className="px-3 py-3 text-gray-500 text-xs">#{u.id}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{u.email}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleColors[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{u.department || '—'}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === user.id}
                      className="text-red-400 hover:text-red-300 font-medium text-xs disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
