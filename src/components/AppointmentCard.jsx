import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import ReviewModal from './ReviewModal';

const tagColors = {
  DSA:      'bg-blue-100 text-blue-700',
  DBMS:     'bg-purple-100 text-purple-700',
  OS:       'bg-orange-100 text-orange-700',
  Networks: 'bg-green-100 text-green-700',
  Math:     'bg-pink-100 text-pink-700',
  Other:    'bg-gray-100 text-gray-600',
};

const AppointmentCard = ({ appointment, actions, showReview = false, onReviewed }) => {
  const [showModal, setShowModal] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const handleReviewed = () => {
    setReviewed(true);
    if (onReviewed) onReviewed();
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {appointment.facultyName || appointment.studentName}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {appointment.date} &nbsp;•&nbsp; {appointment.time}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {appointment.tag && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors[appointment.tag] || tagColors.Other}`}>
                {appointment.tag}
              </span>
            )}
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        {/* Doubt */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Doubt</p>
          <p className="text-sm text-gray-700 leading-relaxed">{appointment.doubt}</p>
        </div>

        {/* Faculty Notes */}
        {appointment.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Faculty Notes</p>
            <p className="text-sm text-blue-800 leading-relaxed">{appointment.notes}</p>
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {actions}
          </div>
        )}

        {/* Rate Session button for completed appointments */}
        {showReview && appointment.status === 'completed' && !reviewed && (
          <div className="pt-3 border-t border-gray-100">
            <button onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-700 font-medium py-2 rounded-lg text-sm transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Rate This Session
            </button>
          </div>
        )}

        {reviewed && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-center text-xs text-green-600 font-medium">✓ Review submitted</p>
          </div>
        )}
      </div>

      {showModal && (
        <ReviewModal
          appointment={appointment}
          onClose={() => setShowModal(false)}
          onSubmitted={handleReviewed}
        />
      )}
    </>
  );
};

export default AppointmentCard;
