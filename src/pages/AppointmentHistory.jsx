import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';

const TAGS = ['All', 'DSA', 'DBMS', 'OS', 'Networks', 'Math', 'Other'];
const STATUSES = ['All', 'pending', 'approved', 'completed', 'cancelled'];

const AppointmentHistory = ({ user, appointments }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');

  const mine = appointments.filter(a => a.studentId === user.id);

  const filtered = mine.filter(a => {
    const matchSearch = search === '' ||
      a.facultyName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doubt?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchTag = tagFilter === 'All' || a.tag === tagFilter;
    return matchSearch && matchStatus && matchTag;
  });

  return (
    <DashboardLayout user={user}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Appointment History</h1>
        <p className="text-gray-500 mt-1 text-sm">View and filter all your past appointments</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Search faculty or doubt..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>

        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
          {TAGS.map(t => <option key={t}>{t}</option>)}
        </select>

        <span className="text-xs text-gray-400 font-medium">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No appointments found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Faculty', 'Date & Time', 'Subject Tag', 'Doubt', 'Status', 'Notes'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-900">{a.facultyName}</td>
                  <td className="px-5 py-4 text-gray-500">
                    <div>{a.date}</div>
                    <div className="text-xs text-gray-400">{a.time}</div>
                  </td>
                  <td className="px-5 py-4">
                    {a.tag ? (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{a.tag}</span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-600 max-w-xs">
                    <p className="truncate">{a.doubt}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-4 text-gray-500 text-xs max-w-xs">
                    {a.notes ? <p className="truncate">{a.notes}</p> : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentHistory;
