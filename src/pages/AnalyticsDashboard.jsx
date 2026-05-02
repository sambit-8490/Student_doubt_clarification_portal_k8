import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const BarChart = ({ data, colorClass = 'bg-blue-500' }) => {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([label, value]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-24 truncate capitalize">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className={`${colorClass} h-5 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${(value / max) * 100}%` }}>
              <span className="text-white text-xs font-bold">{value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, color, icon }) => (
  <div className={`${color} rounded-xl p-5 border`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-600 mt-0.5 font-medium">{label}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const AnalyticsDashboard = ({ user, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Platform usage overview</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Users"        value={data?.totalUsers}        color="bg-blue-50 border-blue-200"   icon="👥" />
        <StatCard label="Students"           value={data?.totalStudents}     color="bg-green-50 border-green-200" icon="🎓" />
        <StatCard label="Faculty"            value={data?.totalFaculty}      color="bg-purple-50 border-purple-200" icon="👨‍🏫" />
        <StatCard label="Total Appointments" value={data?.totalAppointments} color="bg-yellow-50 border-yellow-200" icon="📅" />
        <StatCard label="Office Hours"       value={data?.totalOfficeHours}  color="bg-orange-50 border-orange-200" icon="🕐" />
        <StatCard label="Reviews"            value={data?.totalReviews}      color="bg-pink-50 border-pink-200"   icon="⭐" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments by Status */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Appointments by Status</h3>
          {data?.byStatus && Object.keys(data.byStatus).length > 0
            ? <BarChart data={data.byStatus} colorClass="bg-blue-500" />
            : <p className="text-gray-400 text-sm text-center py-6">No data yet</p>}
        </div>

        {/* Appointments by Tag */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Doubts by Subject</h3>
          {data?.byTag && Object.keys(data.byTag).length > 0
            ? <BarChart data={data.byTag} colorClass="bg-purple-500" />
            : <p className="text-gray-400 text-sm text-center py-6">No data yet</p>}
        </div>

        {/* Per Faculty */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Appointments per Faculty</h3>
          {data?.perFaculty?.length > 0 ? (
            <BarChart
              data={Object.fromEntries(data.perFaculty.map(f => [f.facultyName, f.total]))}
              colorClass="bg-green-500"
            />
          ) : <p className="text-gray-400 text-sm text-center py-6">No data yet</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
