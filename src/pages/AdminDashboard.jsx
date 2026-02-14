import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

// Admin dashboard for user management
const AdminDashboard = ({ user, users, setUsers, getNextId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    department: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.password.trim()) newErrors.password = 'Password required';
    if (formData.role === 'faculty' && !formData.department.trim()) {
      newErrors.department = 'Department required';
    }

    if (users.some(u => u.email === formData.email)) {
      newErrors.email = 'Email exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newUser = {
      id: getNextId(users),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
      ...(formData.role === 'faculty' && { department: formData.department })
    };

    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', role: 'student', password: '', department: '' });
    setShowAddForm(false);
  };

  const handleDeleteUser = (userId) => {
    if (userId === user.id) {
      alert('Cannot delete yourself');
      return;
    }
    
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const studentUsers = users.filter(u => u.role === 'student');
  const facultyUsers = users.filter(u => u.role === 'faculty');
  const adminUsers = users.filter(u => u.role === 'admin');

  return (
    <DashboardLayout user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 text-sm">Manage system users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border-l-4 border-blue-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800 border-l-4 border-green-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Students</p>
          <p className="text-3xl font-bold text-white">{studentUsers.length}</p>
        </div>
        <div className="bg-gray-800 border-l-4 border-purple-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Faculty</p>
          <p className="text-3xl font-bold text-white">{facultyUsers.length}</p>
        </div>
        <div className="bg-gray-800 border-l-4 border-yellow-500 p-4">
          <p className="text-gray-400 text-xs mb-1">Admins</p>
          <p className="text-3xl font-bold text-white">{adminUsers.length}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-gray-800 border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Users</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm"
          >
            {showAddForm ? 'Cancel' : '+ Add User'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddUser} className="bg-gray-700/50 p-4 mb-4 border border-gray-600">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Full name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="email@college.edu"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Password"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {formData.role === 'faculty' && (
                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Computer Science"
                  />
                  {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium"
            >
              Add User
            </button>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-3 py-2 text-left text-gray-400 font-medium">ID</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">Name</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">Email</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">Role</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">Department</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="px-3 py-3 text-gray-300">{u.id}</td>
                  <td className="px-3 py-3 text-white">{u.name}</td>
                  <td className="px-3 py-3 text-gray-400">{u.email}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      u.role === 'admin' ? 'bg-yellow-600 text-yellow-100' :
                      u.role === 'faculty' ? 'bg-purple-600 text-purple-100' :
                      'bg-blue-600 text-blue-100'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{u.department || '-'}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === user.id}
                      className="text-red-400 hover:text-red-300 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
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
