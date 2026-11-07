import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Copy, 
  Check, 
  FileText, 
  Globe, 
  ExternalLink, 
  X, 
  Plus, 
  Search, 
  Sparkles,
  Layers,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Tag,
  Newspaper,
  Compass
} from 'lucide-react';
import { api } from '../services/api';

export default function StudyMaterials({ materials = [], onRefresh }) {
  const { isDark } = useTheme();
  const { isFaculty } = useAuth();

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Format filter: 'all' | 'text' | 'blog'
  const [formatFilter, setFormatFilter] = useState('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Reader Modal State: { material, activeTab: 'text' | 'blog' }
  const [activeModalData, setActiveModalData] = useState(null);

  // Per-card active preview option: { [materialId]: 'text' | 'blog' }
  const [cardOptionTab, setCardOptionTab] = useState({});

  // Copy feedback
  const [copiedId, setCopiedId] = useState(null);

  // Faculty Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Technical');
  const [newReadTime, setNewReadTime] = useState('20 min read');
  const [newTags, setNewTags] = useState('Placement Prep, Core Engineering');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSource, setNewBlogSource] = useState('Technical Blog');
  const [newBlogSummary, setNewBlogSummary] = useState('');

  const categories = ['All', 'Aptitude', 'Japanese', 'Technical', 'Interview'];

  // Handle per-card tab switch
  const setCardTab = (id, tab) => {
    setCardOptionTab(prev => ({ ...prev, [id]: tab }));
  };

  // Copy content helper
  const handleCopyContent = (mat, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(mat.content || mat.description);
    setCopiedId(mat.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered materials
  const filtered = materials.filter(m => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === 'All' || m.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // 2. Format Filter (Option 1: Normal text vs Option 2: Blog link)
    let matchesFormat = true;
    if (formatFilter === 'text') {
      matchesFormat = Boolean(m.content && m.content.trim().length > 0);
    } else if (formatFilter === 'blog') {
      matchesFormat = Boolean(m.blog_url && m.blog_url.trim().length > 0 && m.blog_url !== '#');
    }

    // 3. Search Filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      (m.tags && m.tags.toLowerCase().includes(q)) ||
      (m.blog_title && m.blog_title.toLowerCase().includes(q)) ||
      (m.blog_source && m.blog_source.toLowerCase().includes(q));

    return matchesCategory && matchesFormat && matchesSearch;
  });

  // Handle faculty resource creation
  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      alert('Please provide a title and description.');
      return;
    }

    try {
      setCreating(true);
      await api.createMaterial({
        title: newTitle,
        category: newCategory,
        read_time: newReadTime,
        tags: newTags,
        description: newDescription,
        content: newContent || newDescription,
        blog_url: newBlogUrl || '',
        blog_title: newBlogTitle || (newBlogUrl ? newTitle : ''),
        blog_source: newBlogSource || 'Technical Blog',
        blog_summary: newBlogSummary || newDescription,
        content_type: (newContent && newBlogUrl) ? 'both' : newBlogUrl ? 'blog' : 'text'
      });

      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewContent('');
      setNewBlogUrl('');
      setNewBlogTitle('');
      setNewBlogSummary('');
      
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to publish study resource: ' + (err.message || 'Server error'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] text-xs font-bold uppercase mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Placement Intelligence & Study Bank</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            PLACEMENT RESOURCES & CHEAT SHEETS
          </h2>
          <p className={`text-sm mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
            Every concept offers two tailored study options: <strong>concise normal text revision notes</strong> for instant formulas & cheat sheets, or <strong>verified concept blogs</strong> for deep technical mastery.
          </p>
        </div>

        {/* Faculty Action: Add Resource */}
        {isFaculty && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-netflix-primary text-xs px-4 py-2.5 font-bold rounded-xl flex items-center gap-1.5 shadow-md shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Add Resource</span>
          </button>
        )}
      </div>

      {/* 2. Top Controls: Option Filters & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#10b981] border-[#10b981] text-white shadow-sm'
                  : isDark
                    ? 'bg-[#141414] border-[#2e2e2e] text-[#808080] hover:text-white hover:border-[#444444]'
                    : 'bg-white border-slate-300 text-slate-700 hover:text-black hover:border-slate-400'
              }`}
            >
              {cat === 'All' ? 'All Subjects' : cat}
            </button>
          ))}
        </div>

        {/* Right Controls: Format Filter (Both, Text, Blog) & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          
          {/* Format Selector: Normal Text vs Concept Blog */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 shrink-0 ${
            isDark ? 'bg-[#141414] border-[#2e2e2e]' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setFormatFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                formatFilter === 'all'
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
              title="Show resources with both options"
            >
              All Options ({materials.length})
            </button>
            <button
              onClick={() => setFormatFilter('text')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                formatFilter === 'text'
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
              title="Filter resources offering normal text revision notes"
            >
              <FileText className="w-3 h-3" />
              <span>Normal Text</span>
            </button>
            <button
              onClick={() => setFormatFilter('blog')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                formatFilter === 'blog'
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
              title="Filter resources offering concept blog links"
            >
              <Globe className="w-3 h-3" />
              <span>Concept Blogs</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, formulas..."
              className={`w-full rounded-xl px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] border transition-all ${
                isDark 
                  ? 'bg-[#141414] border-[#2e2e2e] text-white placeholder-[#808080]' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-[#808080] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs mb-5">
        <span className={`font-medium ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
          Showing <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filtered.length}</strong> study resources
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-500 font-semibold">
            <FileText className="w-3 h-3" />
            <span>Option 1: Normal Text</span>
          </span>
          <span className="text-[#808080]">•</span>
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <Globe className="w-3 h-3" />
            <span>Option 2: Concept Blog Link</span>
          </span>
        </div>
      </div>

      {/* 3. Resource Cards Grid */}
      {filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          isDark ? 'card-feature-gradient border-[#2e2e2e]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <BookOpen className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
          <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No matching resources found</h3>
          <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
            Try clearing your search query or switching to "All Options".
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setFormatFilter('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-[#10b981] text-white text-xs font-bold rounded-lg hover:bg-[#059669] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(mat => {
            // Check active option for this card: respects user toggle, or follows top formatFilter
            const currentTab = cardOptionTab[mat.id] || (formatFilter === 'blog' ? 'blog' : 'text');
            const hasBlog = Boolean(mat.blog_url && mat.blog_url.trim().length > 0 && mat.blog_url !== '#');
            const hasText = Boolean(mat.content && mat.content.trim().length > 0);

            return (
              <div
                key={mat.id}
                className={`p-5 sm:p-6 rounded-2xl flex flex-col justify-between group transition-all duration-200 border ${
                  isDark
                    ? 'card-feature-gradient border-[#2e2e2e] hover:border-[#10b981] hover:shadow-xl hover:shadow-[#10b981]/5'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-[#10b981]'
                }`}
              >
                <div>
                  {/* Card Top: Category, Read Time, and 2-Option Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                        mat.category === 'Japanese'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : mat.category === 'Technical'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : mat.category === 'Interview'
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {mat.category}
                      </span>

                      <span className={`text-[11px] font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                        {mat.read_time || '15 min read'}
                      </span>
                    </div>

                    {/* Available Modes Pill */}
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      {hasText && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Includes concise normal text notes">
                          Normal Text
                        </span>
                      )}
                      {hasBlog && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" title="Includes verified concept blog link">
                          Concept Blog
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base sm:text-lg font-bold transition-colors leading-snug mb-2 ${
                    isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
                  }`}>
                    {mat.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                    isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
                  }`}>
                    {mat.description}
                  </p>

                  {/* ======================================================= */}
                  {/* 2 OPTIONS TAB SWITCHER RIGHT INSIDE THE CARD            */}
                  {/* ======================================================= */}
                  <div className={`p-1 rounded-xl border flex items-center gap-1 mb-3.5 ${
                    isDark ? 'bg-[#121212] border-[#262626]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      onClick={() => setCardTab(mat.id, 'text')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        currentTab === 'text'
                          ? 'bg-[#10b981] text-white shadow-sm'
                          : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Option 1: Normal Text Notes</span>
                    </button>

                    <button
                      onClick={() => setCardTab(mat.id, 'blog')}
                      disabled={!hasBlog}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        currentTab === 'blog'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : !hasBlog
                            ? 'opacity-40 cursor-not-allowed text-[#808080]'
                            : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Option 2: Concept Blog Link</span>
                    </button>
                  </div>

                  {/* ======================================================= */}
                  {/* VIEW FOR OPTION 1: NORMAL TEXT NOTES                    */}
                  {/* ======================================================= */}
                  {currentTab === 'text' && (
                    <div className={`p-3.5 rounded-xl border font-mono text-xs leading-relaxed line-clamp-3 mb-4 transition-all relative ${
                      isDark 
                        ? 'bg-[#121212] border-[#262626] text-[#b3b3b3]' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => handleCopyContent(mat, e)}
                          className={`p-1.5 rounded-md border text-[10px] flex items-center gap-1 transition-all ${
                            isDark 
                              ? 'bg-[#1f1f1f] border-[#333333] text-[#b3b3b3] hover:text-white hover:border-[#10b981]' 
                              : 'bg-white border-slate-300 text-slate-700 hover:text-black'
                          }`}
                          title="Copy cheat sheet text to clipboard"
                        >
                          {copiedId === mat.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span className="font-sans font-semibold">{copiedId === mat.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="pr-16 whitespace-pre-line">
                        {mat.content}
                      </div>
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* VIEW FOR OPTION 2: CONCEPT BLOG LINK DIRECTORY          */}
                  {/* ======================================================= */}
                  {currentTab === 'blog' && (
                    <div className={`p-3.5 rounded-xl border transition-all mb-4 ${
                      isDark 
                        ? 'bg-gradient-to-br from-[#121820] to-[#121212] border-cyan-900/40 text-[#b3b3b3]' 
                        : 'bg-gradient-to-br from-cyan-50/60 to-slate-50 border-cyan-200 text-slate-700'
                    }`}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          <Globe className="w-3 h-3" />
                          <span>{mat.blog_source || 'Technical Blog'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#808080]">External Resource</span>
                      </div>

                      <h4 className={`text-xs sm:text-sm font-bold mb-1 leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {mat.blog_title || mat.title}
                      </h4>

                      <p className={`text-[11px] leading-relaxed line-clamp-2 mb-3 ${
                        isDark ? 'text-[#999999]' : 'text-slate-600'
                      }`}>
                        {mat.blog_summary || 'Recommended technical deep-dive and practice questions covering this topic.'}
                      </p>

                      <a
                        href={mat.blog_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-netflix-primary text-xs px-3.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 shadow-sm group/link"
                        title={`Open blog at ${mat.blog_source}`}
                      >
                        <span className="text-white">Open Blog Article</span>
                        <ExternalLink className="w-3 h-3 text-white group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Card Footer: Tags & Dual Direct Actions */}
                <div className={`pt-3.5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  isDark ? 'border-[#262626]' : 'border-slate-200'
                }`}>
                  <span className={`text-[11px] truncate max-w-[200px] flex items-center gap-1 ${
                    isDark ? 'text-[#808080]' : 'text-slate-500'
                  }`}>
                    <Tag className="w-3 h-3 text-[#10b981]" />
                    <span>{mat.tags}</span>
                  </span>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalData({ material: mat, activeTab: 'text' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isDark 
                          ? 'bg-[#181818] border-[#333333] text-white hover:border-[#10b981] hover:bg-[#202020]' 
                          : 'bg-white border-slate-300 text-slate-800 hover:border-[#10b981] hover:bg-slate-50'
                      }`}
                      title="Read full in-depth text notes & formulas"
                    >
                      <FileText className="w-3 h-3 text-[#10b981]" />
                      <span>Read Text</span>
                    </button>

                    {hasBlog ? (
                      <a
                        href={mat.blog_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-netflix-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm group/btn"
                        title={`Direct link to ${mat.blog_source} blog`}
                      >
                        <span className="text-white">Visit Blog</span>
                        <ExternalLink className="w-3 h-3 text-white group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setActiveModalData({ material: mat, activeTab: 'text' })}
                        className="btn-netflix-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        View Guide
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. DUAL-OPTION READER MODAL (NORMAL TEXT & CONCEPT BLOG)        */}
      {/* ============================================================== */}
      {activeModalData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl transition-all ${
            isDark ? 'bg-[#141414] border-[#2e2e2e]' : 'bg-white border-slate-200'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-start justify-between gap-4 ${
              isDark ? 'border-[#262626]' : 'border-slate-200'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                    {activeModalData.material.category} Reference
                  </span>
                  <span className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                    {activeModalData.material.read_time || '15 min read'}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeModalData.material.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalData(null)} 
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-[#808080] hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-black hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Segmented Option Tabs */}
            <div className={`px-5 py-2.5 border-b flex items-center justify-between gap-2 ${
              isDark ? 'bg-[#0f0f0f] border-[#262626]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalData(prev => ({ ...prev, activeTab: 'text' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeModalData.activeTab === 'text'
                      ? 'bg-[#10b981] text-white shadow-sm'
                      : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Option 1: Normal Text Notes</span>
                </button>

                <button
                  onClick={() => setActiveModalData(prev => ({ ...prev, activeTab: 'blog' }))}
                  disabled={!activeModalData.material.blog_url || activeModalData.material.blog_url === '#'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeModalData.activeTab === 'blog'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : !activeModalData.material.blog_url || activeModalData.material.blog_url === '#'
                        ? 'opacity-40 cursor-not-allowed text-[#808080]'
                        : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Option 2: Concept Blog Link</span>
                </button>
              </div>

              {activeModalData.activeTab === 'text' && (
                <button
                  onClick={(e) => handleCopyContent(activeModalData.material, e)}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white hover:border-[#10b981]' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  {copiedId === activeModalData.material.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === activeModalData.material.id ? 'Copied Text!' : 'Copy Notes'}</span>
                </button>
              )}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed max-h-[60vh]">
              
              {/* Option 1: Normal Text Notes View */}
              {activeModalData.activeTab === 'text' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-[#181818] border-[#2e2e2e] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800 font-medium'
                  }`}>
                    {activeModalData.material.description}
                  </div>

                  <div className={`p-5 rounded-xl font-mono whitespace-pre-wrap leading-relaxed border ${
                    isDark ? 'bg-[#0f0f0f] border-[#262626] text-[#b3b3b3]' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}>
                    {activeModalData.material.content}
                  </div>
                </div>
              )}

              {/* Option 2: Concept Blog Link View */}
              {activeModalData.activeTab === 'blog' && (
                <div className="space-y-4">
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-[#161c24] border-cyan-900/50' : 'bg-cyan-50/70 border-cyan-200'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{activeModalData.material.blog_source || 'Technical Authority'}</span>
                      </span>
                      <span className="text-xs font-mono text-[#808080]">Verified Concept Blog</span>
                    </div>

                    <h4 className={`text-base sm:text-lg font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {activeModalData.material.blog_title || activeModalData.material.title}
                    </h4>

                    <p className={`text-xs leading-relaxed mb-4 ${
                      isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
                    }`}>
                      {activeModalData.material.blog_summary || activeModalData.material.description}
                    </p>

                    <div className={`p-3 rounded-lg border font-mono text-[11px] truncate mb-4 ${
                      isDark ? 'bg-black/40 border-[#262626] text-cyan-400' : 'bg-white border-slate-300 text-cyan-700'
                    }`}>
                      {activeModalData.material.blog_url}
                    </div>

                    <a
                      href={activeModalData.material.blog_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-netflix-primary text-xs px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg group"
                    >
                      <span className="text-white">Launch Full Blog Article at {activeModalData.material.blog_source}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  <div className={`p-4 rounded-xl border text-[11px] leading-relaxed ${
                    isDark ? 'bg-[#141414] border-[#262626] text-[#808080]' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    💡 <strong>Faculty Placement Tip:</strong> Read through the normal text formulas for quick memorization before taking proctored mock tests, and refer to the concept blog when tackling high-difficulty coding or technical interview rounds.
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-[#262626]' : 'border-slate-200'
            }`}>
              <span className={isDark ? 'text-[#808080]' : 'text-slate-500'}>
                Sahyadri SPACE • Resources Bank
              </span>
              <button
                onClick={() => setActiveModalData(null)}
                className="btn-netflix-primary px-4 py-1.5 rounded-lg font-bold"
              >
                Close Reader
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. FACULTY MODAL: ADD RESOURCE WITH NORMAL TEXT OR BLOG LINK    */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl ${
            isDark ? 'bg-[#141414] border-[#2e2e2e]' : 'bg-white border-slate-200'
          }`}>
            
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-[#262626]' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center text-white">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Add New Study Resource
                  </h3>
                  <span className="text-[10px] text-[#10b981] font-semibold uppercase">Faculty Publisher</span>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className={isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-black'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateResource} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Dynamic Programming Patterns Cheat Sheet"
                  className={`w-full p-2.5 rounded-xl border outline-none focus:border-[#10b981] ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none focus:border-[#10b981] ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Aptitude">Aptitude</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Technical">Technical</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Read Time (Estimate)
                  </label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="e.g., 20 min read"
                    className={`w-full p-2.5 rounded-xl border outline-none focus:border-[#10b981] ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief overview of what this resource covers..."
                  className={`w-full p-2.5 rounded-xl border outline-none focus:border-[#10b981] ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Option 1: Normal Text Box */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#181818] border-[#2e2e2e]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 font-bold mb-1.5 text-emerald-400">
                  <FileText className="w-4 h-4" />
                  <span>Option 1: Normal Text Notes / Cheat Sheet</span>
                </div>
                <p className={`text-[11px] mb-2 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  Formulas, code templates, or summarized points for fast review.
                </p>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste formulas, key rules, and cheat sheet notes here..."
                  className={`w-full p-2.5 rounded-xl border outline-none font-mono text-xs focus:border-[#10b981] ${
                    isDark ? 'bg-[#121212] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Option 2: Concept Blog Link */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#161c24] border-cyan-900/40' : 'bg-cyan-50/60 border-cyan-200'}`}>
                <div className="flex items-center gap-1.5 font-bold mb-1.5 text-cyan-400">
                  <Globe className="w-4 h-4" />
                  <span>Option 2: Concept Blog Link</span>
                </div>
                <p className={`text-[11px] mb-2 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  Direct link pointing to an external authoritative blog or tutorial on this concept.
                </p>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="url"
                      value={newBlogUrl}
                      onChange={(e) => setNewBlogUrl(e.target.value)}
                      placeholder="Blog URL (https://...)"
                      className={`w-full p-2 rounded-lg border outline-none focus:border-cyan-500 ${
                        isDark ? 'bg-[#121212] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={newBlogSource}
                      onChange={(e) => setNewBlogSource(e.target.value)}
                      placeholder="Source / Publisher (e.g. GeeksforGeeks)"
                      className={`w-full p-2 rounded-lg border outline-none focus:border-cyan-500 ${
                        isDark ? 'bg-[#121212] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    placeholder="Blog Article Headline..."
                    className={`w-full p-2 rounded-lg border outline-none focus:border-cyan-500 ${
                      isDark ? 'bg-[#121212] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="text"
                    value={newBlogSummary}
                    onChange={(e) => setNewBlogSummary(e.target.value)}
                    placeholder="Why this blog is recommended for this concept..."
                    className={`w-full p-2 rounded-lg border outline-none focus:border-cyan-500 ${
                      isDark ? 'bg-[#121212] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g., DSA, LeetCode, Placement"
                  className={`w-full p-2.5 rounded-xl border outline-none focus:border-[#10b981] ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    isDark ? 'bg-[#222222] text-[#b3b3b3] hover:text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-netflix-primary px-5 py-2 rounded-lg font-bold flex items-center gap-1.5"
                >
                  <span>{creating ? 'Publishing...' : 'Publish Study Resource'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
