import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Tag, 
  ExternalLink, 
  X, 
  Plus, 
  Sparkles, 
  Globe, 
  Building2, 
  Cpu, 
  Search, 
  RefreshCw,
  TrendingUp,
  BookmarkCheck,
  Newspaper
} from 'lucide-react';
import { api } from '../services/api';

export default function NewslettersSection({ newsletters = [], onRefresh }) {
  const { isFaculty } = useAuth();
  const { isDark } = useTheme();

  // Tab State: 'international' (Global Tech & Companies) vs 'campus' (Campus Buzz Magazines)
  const [activeTab, setActiveTab] = useState('international');

  // International News State
  const [intlCategory, setIntlCategory] = useState('all');
  const [intlSearch, setIntlSearch] = useState('');
  const [intlArticles, setIntlArticles] = useState([]);
  const [loadingIntl, setLoadingIntl] = useState(false);
  const [newsSource, setNewsSource] = useState('live');

  // College Newsletter State
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEdition, setNewEdition] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Placement Strategy, Interview Tips');
  const [publishing, setPublishing] = useState(false);

  // Fetch International News
  const fetchInternationalNews = async () => {
    try {
      setLoadingIntl(true);
      const res = await api.getInternationalNews({ 
        category: intlCategory, 
        q: intlSearch 
      });
      if (res && res.articles) {
        setIntlArticles(res.articles);
        setNewsSource(res.source || 'live');
      }
    } catch (err) {
      console.error('Failed to load international news:', err);
    } finally {
      setLoadingIntl(false);
    }
  };

  useEffect(() => {
    fetchInternationalNews();
  }, [intlCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternationalNews();
  };

  const handleCreateNewsletter = async (e) => {
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

  const categoryFilters = [
    { id: 'all', label: 'All Global Tech', icon: Globe },
    { id: 'companies', label: 'Big Tech & FAANG', icon: Building2 },
    { id: 'japan', label: 'Japanese Tech & Drives', icon: TrendingUp },
    { id: 'ai', label: 'AI & Emerging Tech', icon: Cpu },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner with Official College Link */}
      <div className={`p-4 rounded-2xl mb-8 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isDark 
          ? 'bg-gradient-to-r from-[#192247]/60 via-black to-[#210e17]/40 border-[#5a5a5a]/40' 
          : 'bg-gradient-to-r from-red-50 via-white to-slate-50 border-red-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white p-1 border border-[#e50914]/40 flex items-center justify-center shrink-0 shadow-sm">
            <img src="/sahyadri-logo.jpg" alt="Sahyadri Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#e50914]">
                Sahyadri College of Engineering & Management
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Official
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
              Mangaluru, Karnataka • Autonomous Institution Accredited NAAC 'A' & NBA
            </p>
          </div>
        </div>

        <a
          href="https://sahyadri.edu.in"
          target="_blank"
          rel="noreferrer"
          className="btn-netflix-primary text-xs px-4 py-2 font-bold rounded flex items-center justify-center gap-1.5 shadow-md self-start md:self-auto shrink-0 group"
          title="Visit Official Sahyadri Website"
        >
          <span className="text-white">Visit sahyadri.edu.in</span>
          <ExternalLink className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Main Header & Dual Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] text-xs font-bold uppercase mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Placement Intelligence & Global Tech News</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            TECH NEWS & CAMPUS BUZZ
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
            Real-time international tech developments, corporate hiring moves, and official Sahyadri placement publications.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 self-start md:self-auto ${
          isDark ? 'bg-[#141414] border-[#2e2e2e]' : 'bg-slate-200 border-slate-300'
        }`}>
          <button
            onClick={() => setActiveTab('international')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'international'
                ? 'bg-[#e50914] text-white shadow-md'
                : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-700 hover:text-black'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>International Tech News</span>
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'campus'
                ? 'bg-[#e50914] text-white shadow-md'
                : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-700 hover:text-black'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campus Buzz ({newsletters.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: INTERNATIONAL TECH & COMPANY NEWS                     */}
      {/* ============================================================== */}
      {activeTab === 'international' && (
        <div>
          {/* Controls: Category Filter Chips & Live Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryFilters.map((cat) => {
                const Icon = cat.icon;
                const isSelected = intlCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setIntlCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-[#e50914] border-[#e50914] text-white shadow-sm'
                        : isDark
                          ? 'bg-[#141414] border-[#2e2e2e] text-[#808080] hover:text-white hover:border-[#5a5a5a]'
                          : 'bg-white border-slate-300 text-slate-700 hover:text-black hover:border-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Refresh Button */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={intlSearch}
                  onChange={(e) => setIntlSearch(e.target.value)}
                  placeholder="Search company (Google, Sony)..."
                  className={`w-full rounded-lg px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#e50914] border transition-all ${
                    isDark 
                      ? 'bg-[#141414] border-[#2e2e2e] text-white placeholder-[#808080]' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
              </form>

              <button
                onClick={fetchInternationalNews}
                disabled={loadingIntl}
                className={`p-2 rounded-lg border text-xs transition-all flex items-center justify-center shrink-0 ${
                  isDark 
                    ? 'bg-[#141414] border-[#2e2e2e] text-[#808080] hover:text-white' 
                    : 'bg-white border-slate-300 text-slate-700 hover:text-black'
                }`}
                title="Refresh Live News Feeds"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingIntl ? 'animate-spin text-[#e50914]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Feed Metadata Banner */}
          <div className="flex items-center justify-between text-xs mb-4">
            <span className={`font-medium ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
              Showing <strong className={isDark ? 'text-white' : 'text-slate-900'}>{intlArticles.length}</strong> global tech stories
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-[11px] font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                {newsSource === 'newsdata.io_live' ? 'NewsData.io Global Wire Live' : 'Curated International Feed'}
              </span>
            </div>
          </div>

          {/* International News Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intlArticles.map((article) => (
              <div
                key={article.id}
                className={`rounded-2xl overflow-hidden border flex flex-col justify-between group transition-all duration-200 ${
                  isDark
                    ? 'bg-[#121212] border-[#262626] hover:border-[#e50914] hover:shadow-xl hover:shadow-[#e50914]/10'
                    : 'bg-white border-slate-200 hover:border-[#e50914] shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  {/* Article Image Container */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={article.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Category Pill */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-extrabold text-[#e50914] uppercase border border-white/20">
                      {article.category || 'Tech'}
                    </span>

                    {/* Source & Date Badge */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-bold flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#e50914]" />
                        <span>{article.source_id || 'Tech Wire'}</span>
                      </span>
                      <span className="font-mono text-[10px] text-white/70">
                        {article.pubDate ? new Date(article.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Live'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className={`text-base font-bold leading-snug mb-2 transition-colors line-clamp-2 ${
                      isDark ? 'text-white group-hover:text-[#e50914]' : 'text-slate-900 group-hover:text-[#e50914]'
                    }`}>
                      {article.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-3 mb-4 font-normal ${
                      isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
                    }`}>
                      {article.description}
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              isDark ? 'bg-[#1e1e1e] text-[#808080]' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className={`p-4 pt-3 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-[#222222]' : 'border-slate-100'
                }`}>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                    Global Industry Intelligence
                  </span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-netflix-primary text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1 shadow-sm"
                  >
                    <span className="text-white">Read Report</span>
                    <ExternalLink className="w-3 h-3 text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: CAMPUS BUZZ & COLLEGE PLACEMENT MAGAZINES             */}
      {/* ============================================================== */}
      {activeTab === 'campus' && (
        <div>
          {/* Faculty Publish Bar */}
          {isFaculty && (
            <div className={`p-4 rounded-xl mb-6 border flex items-center justify-between ${
              isDark ? 'bg-[#181818] border-[#333333]' : 'bg-slate-100 border-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e50914]" />
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Faculty Privileges: Curate and publish placement preparation digests for all students
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-netflix-primary px-3.5 py-1.5 text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Publish Issue</span>
              </button>
            </div>
          )}

          {/* Newsletter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletters.map((nl) => (
              <div
                key={nl.id}
                onClick={() => setSelectedNewsletter(nl)}
                className={`rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all ${
                  isDark
                    ? 'card-feature-gradient border border-[#5a5a5a]/30 hover:border-[#e50914]'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#e50914]'
                }`}
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={nl.cover_image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600'}
                      alt={nl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-[#e50914] uppercase border border-white/20">
                      {nl.edition}
                    </span>
                    <span className="absolute bottom-2 right-3 text-[11px] text-white font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white" />
                      <span>{nl.read_time || '5 min read'}</span>
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className={`text-base font-bold transition-colors mb-2 line-clamp-2 ${
                      isDark ? 'text-white group-hover:text-[#e50914]' : 'text-slate-900 group-hover:text-[#e50914]'
                    }`}>
                      {nl.title}
                    </h3>
                    <p className={`text-xs line-clamp-3 mb-3 leading-relaxed font-normal ${
                      isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
                    }`}>
                      {nl.summary}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className={`p-4 pt-3 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-[#2d2d2d]' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#808080]">
                    <Calendar className="w-3.5 h-3.5 text-[#e50914]" />
                    <span>{nl.publish_date}</span>
                  </div>
                  <span className="text-[#e50914] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Issue</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Full Reader Modal */}
      {selectedNewsletter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden ${
            isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#e50914] px-2 py-0.5 rounded bg-[#e50914]/10 border border-[#e50914]/30">
                  {selectedNewsletter.edition}
                </span>
                <h3 className={`text-lg font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedNewsletter.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNewsletter(null)}
                className={`p-1.5 rounded-full ${
                  isDark ? 'text-[#808080] hover:text-white hover:bg-[#2d2d2d]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-6 overflow-y-auto space-y-4 text-sm leading-relaxed ${
              isDark ? 'text-[#b3b3b3]' : 'text-slate-700'
            }`}>
              <div className={`p-4 rounded-xl text-xs italic border ${
                isDark ? 'bg-black/40 border-[#2d2d2d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                {selectedNewsletter.summary}
              </div>
              <div className={`whitespace-pre-wrap font-sans leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-800'
              }`}>
                {selectedNewsletter.content}
              </div>
            </div>

            <div className={`p-4 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-[#2d2d2d] text-[#808080]' : 'border-slate-200 text-slate-500'
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
          <div className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl ${
            isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Publish Campus Buzz Weekly Edition
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className={isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-black'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewsletter} className="space-y-3 text-xs">
              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., Campus Buzz Edition 49: Off-Campus Referrals & Amazon OA Prep"
                  className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                    Edition / Volume
                  </label>
                  <input
                    type="text"
                    value={newEdition}
                    onChange={e => setNewEdition(e.target.value)}
                    placeholder="Vol. 2026 - Issue 13"
                    className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                    Category Tags
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="Placements, Amazon, OA Tips"
                    className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                  Summary (1-2 lines)
                </label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Key highlights and strategy breakdown..."
                  className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                  Content (Markdown / Text)
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write the full newsletter edition content here..."
                  className={`w-full p-2.5 rounded border focus:border-[#e50914] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded ${
                    isDark ? 'bg-[#2d2d2d] text-white hover:bg-[#414141]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
