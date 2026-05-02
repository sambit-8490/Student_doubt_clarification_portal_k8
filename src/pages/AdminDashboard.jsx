import React, { useState, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const roleColors = {
  admin:   'bg-yellow-100 text-yellow-800',
  faculty: 'bg-purple-100 text-purple-800',
  student: 'bg-blue-100 text-blue-800',
};

const inputCls = "w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

const AdminDashboard = ({ user, users, setUsers, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student', password: '', department: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState('');
  const fileRef = useRef();

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  const filteredUsers = users.filter(u => {
    const matchSearch = search === '' ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchDept = deptFilter === 'all' || u.department === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name required';
    if (!formData.email.trim()) e.email = 'Email required';
    if (!formData.password.trim()) e.password = 'Password required';
    if (formData.role === 'faculty' && !formData.department.trim()) e.department = 'Department required';
    setErrors(e);
    return Object.keys(e).length === 0;
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
    } catch (err) { alert(err.message); }
  };

  // CSV Import
  const handleCsvFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim());
      const rows = lines.slice(1).map(line => {
        const [name, email, password, role, department] = line.split(',').map(s => s.trim());
        return { name, email, password, role: role || 'student', department: department || '' };
      }).filter(r => r.name && r.email && r.password);
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleCsvImport = async () => {
    setCsvImporting(true);
    let success = 0, failed = 0;
    for (const row of csvPreview) {
      try {
        const newUser = await api.addUser(row);
        setUsers(prev => [...prev, newUser]);
        success++;
      } catch { failed++; }
    }
    setCsvResult(`✓ ${success} imported, ${failed} failed`);
    setCsvPreview([]);
    setCsvImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const stats = [
    { label: 'Total Users',  value: users.length,                                    bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
    { label: 'Students',     value: users.filter(u => u.role === 'student').length,  bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700'  },
    { label: 'Faculty',      value: users.filter(u => u.role === 'faculty').length,  bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    { label: 'Departments',  value: departments.length,                              bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage all system users and departments</p>
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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {[['users', 'Users'], ['departments', 'Departments'], ['import', 'Bulk Import']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search name or email..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
            {/* Role filter */}
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            {/* Dept filter */}
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="text-xs text-gray-400 font-medium">{filteredUsers.length} users</span>
            <button onClick={() => setShowAddForm(!showAddForm)}
              className={`ml-auto px-4 py-2 rounded-lg text-sm font-semibold transition ${
                showAddForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}>
              {showAddForm ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {showAddForm && (
            <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
              <p className="text-sm font-bold text-blue-800 mb-4">Add New User</p>
              <form onSubmit={handleAddUser}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="Full name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="email@college.edu" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className={inputCls}>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputCls} placeholder="Password" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  {formData.role === 'faculty' && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                      <input type="text" name="department" value={formData.department} onChange={handleChange} className={inputCls} placeholder="Computer Science" />
                      {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>
                  )}
                </div>
                <button type="submit" disabled={submitting}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition">
                  {submitting ? 'Adding...' : 'Add User'}
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['#', 'Name', 'Email', 'Role', 'Department', 'Joined', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-gray-400 text-xs">{u.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">{u.department || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDeleteUser(u.id)} disabled={u.id === user.id}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DEPARTMENTS TAB ── */}
      {activeTab === 'departments' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Departments Overview</h3>
          {departments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No departments found. Add faculty members with departments.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => {
                const facultyInDept = users.filter(u => u.role === 'faculty' && u.department === dept);
                return (
                  <div key={dept} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{dept}</p>
                        <p className="text-xs text-gray-500">{facultyInDept.length} faculty member{facultyInDept.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {facultyInDept.map(f => (
                        <div key={f.id} className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {f.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-700">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── BULK IMPORT TAB ── */}
      {activeTab === 'import' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Bulk User Import</h3>
          <p className="text-sm text-gray-500 mb-5">Upload a CSV file to add multiple users at once</p>

          {/* CSV Format */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-gray-700 mb-2">Required CSV Format:</p>
            <code className="text-xs text-gray-600 font-mono">name,email,password,role,department</code>
            <p className="text-xs text-gray-400 mt-1">Example: John Doe,john@college.edu,pass123,student,</p>
            <p className="text-xs text-gray-400">Example: Dr. Smith,smith@college.edu,pass123,faculty,Computer Science</p>
          </div>

          {/* Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-5 hover:border-blue-400 transition cursor-pointer"
            onClick={() => fileRef.current?.click()}>
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-gray-700">Click to upload CSV file</p>
            <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCsvFile} className="hidden" />
          </div>

          {/* Preview */}
          {csvPreview.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">{csvPreview.length} users ready to import</p>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Name', 'Email', 'Role', 'Department'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {csvPreview.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                        <td className="px-4 py-2.5 text-gray-500">{row.email}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${roleColors[row.role] || roleColors.student}`}>{row.role}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-500">{row.department || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleCsvImport} disabled={csvImporting}
                className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 transition">
                {csvImporting ? 'Importing...' : `Import ${csvPreview.length} Users`}
              </button>
            </div>
          )}

          {csvResult && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
              {csvResult}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
