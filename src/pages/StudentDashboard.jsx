import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const StudentDashboard = ({ user, onLogout }) => {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-500 mt-1 text-sm">Ask doubts, get answers from peers and faculty</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-700 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-1">Community Q&A</h3>
          <p className="text-blue-200 text-sm mb-4">Post your doubts and get answers from faculty and peers</p>
          <Link to="/community" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition inline-block">
            Go to Community →
          </Link>
        </div>
        <div className="bg-green-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-1">Messages</h3>
          <p className="text-green-100 text-sm mb-4">Chat privately with faculty members</p>
          <Link to="/chat" className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition inline-block">
            Open Messages →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
