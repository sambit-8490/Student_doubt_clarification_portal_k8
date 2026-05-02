import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

/* ── Time formatter ── */
const formatTime = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

const formatFullTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ── New Chat Modal ── */
const NewChatModal = ({ onClose, onSelect }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getAvailableUsers().then(setUsers).catch(() => {});
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">New Conversation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <input type="text" placeholder="Search by name, role or department..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 mb-3" />
          <div className="max-h-72 overflow-y-auto space-y-1">
            {filtered.length === 0
              ? <p className="text-center text-gray-400 text-sm py-6">No users found</p>
              : filtered.map(u => (
                <button key={u.id} onClick={() => onSelect(u)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition text-left">
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{u.role}{u.department ? ` • ${u.department}` : ''}</p>
                  </div>
                </button>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Chat Page ── */
const ChatPage = ({ user, onLogout }) => {
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchConv, setSearchConv] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Load conversations */
  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch (_) {}
  };

  /* Load messages for active conversation */
  const loadMessages = async (userId) => {
    try {
      const data = await api.getConversation(userId);
      setMessages(data);
      // Update unread count in sidebar
      setConversations(prev => prev.map(c =>
        c.userId === userId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (_) {}
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeUser) return;
    loadMessages(activeUser.userId || activeUser.id);
    const interval = setInterval(() => loadMessages(activeUser.userId || activeUser.id), 5000);
    return () => clearInterval(interval);
  }, [activeUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    setActiveUser(conv);
    inputRef.current?.focus();
  };

  const handleNewChat = (u) => {
    setShowNewChat(false);
    const conv = { userId: u.id, name: u.name, role: u.role, department: u.department, unreadCount: 0 };
    setActiveUser(conv);
    // Add to sidebar if not already there
    setConversations(prev => {
      if (prev.find(c => c.userId === u.id)) return prev;
      return [{ ...conv, lastMessage: '', lastMessageTime: new Date().toISOString() }, ...prev];
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !activeUser || sending) return;
    const receiverId = activeUser.userId || activeUser.id;
    setSending(true);
    try {
      const msg = await api.sendMessage(receiverId, input.trim());
      setMessages(prev => [...prev, msg]);
      setInput('');
      // Update sidebar last message
      setConversations(prev => prev.map(c =>
        c.userId === receiverId
          ? { ...c, lastMessage: input.trim(), lastMessageTime: new Date().toISOString(), isMine: true }
          : c
      ));
    } catch (_) {}
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filteredConvs = conversations.filter(c =>
    c.name?.toLowerCase().includes(searchConv.toLowerCase())
  );

  const activeId = activeUser?.userId || activeUser?.id;

  /* Group messages by date */
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="mb-4 pb-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Chat with faculty and students</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex"
        style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col">
          {/* Sidebar header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 text-base">Chats</h2>
              <button onClick={() => setShowNewChat(true)}
                className="w-8 h-8 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition"
                title="New conversation">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search conversations..." value={searchConv}
                onChange={e => setSearchConv(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-blue-300" />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-500 text-sm font-medium">No conversations yet</p>
                <p className="text-gray-400 text-xs mt-1">Click + to start a new chat</p>
              </div>
            ) : (
              filteredConvs.map(conv => (
                <button key={conv.userId} onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 text-left ${
                    activeId === conv.userId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}>
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      conv.role === 'faculty' ? 'bg-purple-600' : conv.role === 'admin' ? 'bg-yellow-600' : 'bg-blue-600'
                    }`}>
                      {conv.name?.charAt(0).toUpperCase()}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                        {conv.name}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                        {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                      {conv.isMine ? 'You: ' : ''}{conv.lastMessage || 'Start a conversation'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT CHAT PANEL ── */}
        {!activeUser ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Select a conversation</h3>
            <p className="text-gray-400 text-sm mb-4">or start a new one</p>
            <button onClick={() => setShowNewChat(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              + New Chat
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3 bg-white">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                activeUser.role === 'faculty' ? 'bg-purple-600' : activeUser.role === 'admin' ? 'bg-yellow-600' : 'bg-blue-600'
              }`}>
                {activeUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{activeUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {activeUser.role}{activeUser.department ? ` • ${activeUser.department}` : ''}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 space-y-1">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-gray-500 text-sm">Say hello to {activeUser.name}!</p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    {/* Date separator */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium px-2">
                        {new Date(date).toDateString() === new Date().toDateString() ? 'Today' : date}
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    {msgs.map((msg, i) => {
                      const isMine = msg.isMine;
                      const prevMsg = msgs[i - 1];
                      const showAvatar = !isMine && (!prevMsg || prevMsg.isMine);
                      return (
                        <div key={msg.id} className={`flex items-end gap-2 mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          {/* Avatar for received */}
                          {!isMine && (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 ${
                              showAvatar ? (activeUser.role === 'faculty' ? 'bg-purple-600' : 'bg-blue-600') : 'opacity-0'
                            }`}>
                              {activeUser.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={`max-w-xs lg:max-w-md ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMine
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
                            }`}>
                              {msg.content}
                            </div>
                            <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-400">{formatFullTime(msg.createdAt)}</span>
                              {isMine && (
                                <svg className={`w-3.5 h-3.5 ${msg.isRead ? 'text-blue-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${activeUser.name}...`}
                rows={1}
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-transparent rounded-2xl text-sm resize-none focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition max-h-32"
                style={{ minHeight: '42px' }}
              />
              <button onClick={handleSend} disabled={!input.trim() || sending}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center flex-shrink-0 transition">
                <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} onSelect={handleNewChat} />}
    </DashboardLayout>
  );
};

export default ChatPage;
