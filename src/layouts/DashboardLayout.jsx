import React from 'react';
import Sidebar from '../components/Sidebar';

// Main dashboard layout wrapper
const DashboardLayout = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Doubt Resolution System</h1>
          <p className="text-sm text-gray-400">College Portal</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
