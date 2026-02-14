import React from 'react';
import StatusBadge from './StatusBadge';

// Reusable appointment card component
const AppointmentCard = ({ appointment, actions }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{appointment.facultyName || appointment.studentName}</h3>
          <p className="text-sm text-gray-400 mt-1">{appointment.date} • {appointment.time}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      
      <div className="mb-4 bg-gray-700/50 rounded p-3 border border-gray-600">
        <p className="text-xs text-gray-400 font-medium mb-1">Doubt:</p>
        <p className="text-sm text-gray-200">{appointment.doubt}</p>
      </div>
      
      {actions && (
        <div className="flex gap-2 pt-3 border-t border-gray-700">
          {actions}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
