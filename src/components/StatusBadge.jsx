import React from 'react';

// Status badge component with color coding
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-600 text-yellow-100';
      case 'approved':
        return 'bg-blue-600 text-blue-100';
      case 'completed':
        return 'bg-green-600 text-green-100';
      case 'cancelled':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
