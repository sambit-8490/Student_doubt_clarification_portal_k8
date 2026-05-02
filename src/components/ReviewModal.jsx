import React, { useState } from 'react';
import { api } from '../services/api';

const ReviewModal = ({ appointment, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) return setError('Please select a rating');
    setLoading(true);
    try {
      await api.submitReview({ appointmentId: appointment.id, rating, comment });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Rate Your Session</h3>
            <p className="text-sm text-gray-500 mt-0.5">with {appointment.facultyName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stars */}
        <div className="text-center mb-5">
          <p className="text-sm text-gray-600 mb-3">How was your session?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => { setRating(star); setError(''); }}
                className="transition-transform hover:scale-110">
                <svg className={`w-10 h-10 transition-colors ${
                  star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm font-medium text-gray-700 mt-2">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Comment <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
            placeholder="Share your experience..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
        </div>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <div className="flex gap-3">
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60 transition">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-lg text-sm hover:bg-gray-50 transition">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
