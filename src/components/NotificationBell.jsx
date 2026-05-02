import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const typeIcon = {
  APPOINTMENT_BOOKED: { bg: 'bg-blue-100',   icon: '📅' },
  APPROVED:           { bg: 'bg-green-100',  icon: '✅' },
  CANCELLED:          { bg: 'bg-red-100',    icon: '❌' },
  COMPLETED:          { bg: 'bg-purple-100', icon: '🎓' },
  NEW_MESSAGE:        { bg: 'bg-teal-100',   icon: '💬' },
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [notifs, countRes] = await Promise.all([api.getNotifications(), api.getUnreadCount()]);
      setNotifications(notifs);
      setUnread(countRes.count);
    } catch (_) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleMarkAllRead = async () => {
    await api.markAllRead();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const handleMarkRead = async (id) => {
    await api.markRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button onClick={handleOpen}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unread > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const { bg, text, icon } = typeIcon[n.type] || typeIcon.APPOINTMENT_BOOKED;
                return (
                  <div key={n.id}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${!n.isRead ? 'bg-blue-50/40' : ''}`}>
                    <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center flex-shrink-0 text-sm`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
