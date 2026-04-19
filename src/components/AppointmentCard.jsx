import React from 'react';
import StatusBadge from './StatusBadge';

const AppointmentCard = ({ appointment, actions }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white">{appointment.facultyName || appointment.studentName}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {appointment.date} • {appointment.time}
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 mb-3">
        <p className="text-xs text-gray-400 font-medium mb-1">Doubt</p>
        <p className="text-sm text-gray-200 leading-relaxed">{appointment.doubt}</p>
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
