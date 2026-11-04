import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, Clock, Tag, ExternalLink, X, Plus, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function NewslettersSection({ newsletters, onRefresh }) {
  const { isFaculty } = useAuth();
  const { isDark } = useTheme();
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEdition, setNewEdition] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Placement Strategy, Interview Tips');
  const [publishing, setPublishing] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    try {
      setPublishing(true);
      await api.createNewsletter({
        title: newTitle,
        edition: newEdition || `Vol. 2026 - Issue ${Math.floor(10 + Math.random() * 50)}`,
        summary: newSummary || newTitle,
        content: newContent,
        tags: newTags
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      setNewSummary('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to publish newsletter: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] text-xs font-bold uppercase mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official College Placement Publications</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            CAMPUS BUZZ DIGEST
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
            Weekly placement e-magazines, recruitment intelligence, and preparation strategies directly from Sahyadri SPACE placement cell.
          </p>
        </div>

        {isFaculty && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-netflix-primary px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white">Publish New Edition</span>
          </button>
        )}
      </div>

      {/* Newsletter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsletters.map(nl => (
          <div
            key={nl.id}
            onClick={() => setSelectedNewsletter(nl)}
            className={`rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all ${isDark
                ? 'card-feature-gradient border border-[#5a5a5a]/30 hover:border-[#e50914]'
                : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#e50914]'
              }`}
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={nl.cover_image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600'}
                  alt={nl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#192247]/90' : 'from-black/60'} via-transparent to-transparent`} />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-[#e50914] uppercase border border-white/20">
                  {nl.edition}
                </span>
                <span className="absolute bottom-2 right-3 text-[11px] text-white font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-white" />
                  <span>{nl.read_time || '5 min read'}</span>
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className={`flex items-center gap-2 text-[11px] mb-2 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{nl.publish_date}</span>
                </div>

                <h3 className={`text-base font-bold transition-colors leading-snug mb-2 line-clamp-2 ${isDark ? 'text-white group-hover:text-[#e50914]' : 'text-slate-900 group-hover:text-[#e50914]'
                  }`}>
                  {nl.title}
                </h3>

                <p className={`text-xs line-clamp-3 leading-relaxed mb-4 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
                  }`}>
                  {nl.summary}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className={`px-5 pb-5 pt-2 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
              }`}>
              <span className={`text-[11px] truncate max-w-[180px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                {nl.tags}
              </span>
              <span className="text-[#e50914] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read Full Issue</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {selectedNewsletter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl ${isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
            }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-6 border-b flex items-start justify-between gap-4 ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
              }`}>
              <div>
                <span className="text-xs font-bold text-[#e50914] uppercase block mb-1">
                  {selectedNewsletter.edition} • {selectedNewsletter.publish_date}
                </span>
                <h2 className={`text-xl sm:text-2xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedNewsletter.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNewsletter(null)}
                className={`p-1.5 rounded-full ${isDark ? 'text-[#808080] hover:text-white hover:bg-[#2d2d2d]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className={`p-6 overflow-y-auto space-y-4 text-sm leading-relaxed font-normal ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'
              }`}>
              <div className={`p-4 rounded-xl text-xs italic border ${isDark ? 'bg-black/40 border-[#2d2d2d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                {selectedNewsletter.summary}
              </div>

              <div className={`whitespace-pre-wrap font-sans leading-relaxed ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                {selectedNewsletter.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2d2d2d] text-[#808080]' : 'border-slate-200 text-slate-500'
              }`}>
              <span>Published by Sahyadri Career Guidance & Placement Cell</span>
              <button
                onClick={() => setSelectedNewsletter(null)}
                className="btn-netflix-primary px-4 py-1.5 rounded font-bold"
              >
                Close Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Newsletter Modal (Faculty) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl ${isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Publish Campus Buzz Weekly Edition
              </h3>
              <button onClick={() => setShowCreateModal(false)} className={isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-black'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Article Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., Campus Buzz Edition 49: Off-Campus Referrals & Amazon OA Prep"
                  className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Edition / Volume</label>
                  <input
                    type="text"
                    value={newEdition}
                    onChange={e => setNewEdition(e.target.value)}
                    placeholder="Vol. 2026 - Issue 13"
                    className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Category Tags</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="Placements, Amazon, OA Tips"
                    className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Summary (1-2 lines)</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Key highlights and strategy breakdown..."
                  className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Content (Markdown / Text)</label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write the full newsletter edition content here..."
                  className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded ${isDark ? 'bg-[#2d2d2d] text-white hover:bg-[#414141]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="btn-netflix-primary px-5 py-2 rounded font-bold"
                >
                  {publishing ? 'Publishing...' : 'Publish Newsletter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
