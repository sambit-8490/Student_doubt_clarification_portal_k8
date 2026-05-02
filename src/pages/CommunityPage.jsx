import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

const CS_TAGS = ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Web Dev', 'AI/ML', 'Python', 'Java', 'C++', 'System Design', 'Other'];

const CommunityPage = ({ user, onLogout }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filter, setFilter] = useState('latest');
  const [tagFilter, setTagFilter] = useState('');

  const [form, setForm] = useState({ title: '', body: '', tags: [], anonymous: false });
  const [answerText, setAnswerText] = useState('');
  const [answerAnon, setAnswerAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [filter, tagFilter]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await api.getQuestions({ sort: filter, tag: tagFilter });
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    try {
      const q = await api.postQuestion(form);
      setQuestions([q, ...questions]);
      setForm({ title: '', body: '', tags: [], anonymous: false });
      setShowForm(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const updated = await api.postAnswer(selectedQuestion.id, { body: answerText, anonymous: answerAnon });
      setSelectedQuestion(updated);
      setQuestions(questions.map(q => q.id === updated.id ? updated : q));
      setAnswerText('');
      setAnswerAnon(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (questionId, answerId) => {
    try {
      const updated = await api.upvoteAnswer(questionId, answerId);
      setSelectedQuestion(updated);
      setQuestions(questions.map(q => q.id === updated.id ? updated : q));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccept = async (questionId, answerId) => {
    try {
      const updated = await api.acceptAnswer(questionId, answerId);
      setSelectedQuestion(updated);
      setQuestions(questions.map(q => q.id === updated.id ? updated : q));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  if (selectedQuestion) {
    return (
      <DashboardLayout user={user} onLogout={onLogout}>
        <div className="max-w-4xl mx-auto p-6">
          <button onClick={() => setSelectedQuestion(null)} className="text-blue-600 hover:underline mb-4 flex items-center gap-1">
            ← Back to Community
          </button>

          {/* Question Detail */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex gap-3 flex-wrap mb-3">
              {selectedQuestion.tags?.map(t => (
                <span key={t} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{t}</span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{selectedQuestion.title}</h1>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{selectedQuestion.body}</p>
            <div className="text-sm text-gray-400">
              Asked by <span className="font-medium text-gray-600">
                {selectedQuestion.anonymous ? 'Anonymous' : selectedQuestion.authorName}
              </span> · {new Date(selectedQuestion.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Answers */}
          <h2 className="text-lg font-semibold text-gray-700 mb-3">{selectedQuestion.answers?.length || 0} Answers</h2>
          <div className="space-y-4 mb-8">
            {selectedQuestion.answers?.sort((a, b) => (b.accepted ? 1 : 0) - (a.accepted ? 1 : 0) || b.upvotes - a.upvotes)
              .map(ans => (
              <div key={ans.id} className={`bg-white rounded-xl shadow p-5 border-l-4 ${ans.accepted ? 'border-green-500' : 'border-transparent'}`}>
                <div className="flex items-start gap-4">
                  {/* Upvote */}
                  <div className="flex flex-col items-center gap-1 min-w-[40px]">
                    <button
                      onClick={() => handleUpvote(selectedQuestion.id, ans.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >▲</button>
                    <span className="font-bold text-gray-700">{ans.upvotes || 0}</span>
                    {ans.accepted && <span className="text-green-500 text-lg">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">{ans.body}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {ans.anonymous ? 'Anonymous' : ans.authorName} · {new Date(ans.createdAt).toLocaleDateString()}
                        {ans.authorRole === 'faculty' && !ans.anonymous &&
                          <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">Faculty</span>}
                      </span>
                      {/* Accept button — only question author can accept */}
                      {!ans.accepted && selectedQuestion.authorId === user.id && (
                        <button
                          onClick={() => handleAccept(selectedQuestion.id, ans.id)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >✓ Accept</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!selectedQuestion.answers?.length && (
              <p className="text-gray-400 text-center py-6">No answers yet. Be the first to answer!</p>
            )}
          </div>

          {/* Answer Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Answer</h3>
            <form onSubmit={handleAnswer}>
              <textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                rows={5}
                placeholder="Write your answer here..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={answerAnon} onChange={e => setAnswerAnon(e.target.checked)} className="rounded" />
                  Post anonymously
                </label>
                <button
                  type="submit"
                  disabled={submitting || !answerText.trim()}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Answer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community Q&A</h1>
            <p className="text-gray-500 text-sm">Ask doubts, get answers from peers and faculty</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Ask Question'}
          </button>
        </div>

        {/* Ask Question Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Ask a Question</h2>
            <form onSubmit={handlePostQuestion} className="space-y-4">
              <input
                type="text"
                placeholder="Question title (be specific)"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Describe your doubt in detail..."
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm text-gray-600 mb-2">Tags (select relevant topics):</p>
                <div className="flex flex-wrap gap-2">
                  {CS_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        form.tags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >{tag}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} className="rounded" />
                  Post anonymously (your name won't be shown)
                </label>
                <button
                  type="submit"
                  disabled={submitting || !form.title.trim() || !form.body.trim()}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Question'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex gap-2">
            {['latest', 'unanswered', 'popular'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium capitalize ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                }`}
              >{f}</button>
            ))}
          </div>
          <select
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {CS_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No questions yet. Be the first to ask!</div>
        ) : (
          <div className="space-y-3">
            {questions.map(q => (
              <div
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[50px] text-center">
                    <span className="text-lg font-bold text-gray-700">{q.answers?.length || 0}</span>
                    <span className="text-xs text-gray-400">answers</span>
                    {q.answers?.some(a => a.accepted) && (
                      <span className="text-green-500 text-xs font-medium">✓ solved</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 mb-1">{q.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">{q.body}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {q.tags?.map(t => (
                        <span key={t} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">{t}</span>
                      ))}
                      <span className="text-xs text-gray-400 ml-auto">
                        {q.anonymous ? 'Anonymous' : q.authorName} · {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;
