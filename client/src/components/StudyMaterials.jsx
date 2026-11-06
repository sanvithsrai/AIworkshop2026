import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Download, Copy, Check, FileText, Sparkles, X, ExternalLink } from 'lucide-react';

export default function StudyMaterials({ materials }) {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Aptitude', 'Japanese', 'Technical', 'Interview'];

  const filtered = materials.filter(m =>
    selectedCategory === 'All' || m.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const handleCopyContent = (mat) => {
    navigator.clipboard.writeText(mat.content || mat.description);
    setCopiedId(mat.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-bold uppercase mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Placement Knowledge Bank</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            STUDY MATERIALS & CHEAT SHEETS
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
            Condensed formulas, Blind-75 DSA patterns, JLPT N5 Japanese flashcards, and HR behavioral frameworks.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat
                ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30'
                : isDark
                  ? 'bg-[#1c1c1c] text-[#b3b3b3] border border-[#2d2d2d] hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:text-black shadow-sm'
              }`}
          >
            {cat === 'All' ? 'All Resources' : cat}
          </button>
        ))}
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(mat => (
          <div
            key={mat.id}
            className={`p-6 rounded-2xl flex flex-col justify-between group transition-all ${isDark
                ? 'card-feature-gradient border border-[#5a5a5a]/30 hover:border-[#10b981]'
                : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#10b981]'
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${mat.category === 'Japanese' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' :
                    mat.category === 'Technical' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' :
                      isDark ? 'bg-[#2d2d2d] text-[#b3b3b3]' : 'bg-slate-100 text-slate-600'
                  }`}>
                  {mat.category}
                </span>

                <span className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  {mat.read_time || '15 min read'}
                </span>
              </div>

              <h3 className={`text-base font-bold transition-colors mb-2 ${isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
                }`}>
                {mat.title}
              </h3>

              <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-normal ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
                }`}>
                {mat.description}
              </p>

              <div className={`p-3 rounded-lg text-xs font-mono line-clamp-3 mb-4 border ${isDark ? 'bg-black/50 border-[#2d2d2d] text-[#808080]' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                {mat.content}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
              }`}>
              <span className={`text-[11px] truncate max-w-[200px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                {mat.tags}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(mat)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${isDark ? 'bg-[#2d2d2d] text-[#b3b3b3] hover:text-white' : 'bg-slate-100 text-slate-700 hover:text-black border border-slate-200'
                    }`}
                  title="Copy Cheat Sheet Text"
                >
                  {copiedId === mat.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === mat.id ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setActiveMaterial(mat)}
                  className="btn-netflix-primary px-3 py-1.5 rounded text-xs font-bold"
                >
                  Read Online
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl ${isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
            }`}>
            <div className={`p-5 border-b flex items-start justify-between gap-4 ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
              }`}>
              <div>
                <span className="text-xs font-bold text-[#10b981] uppercase block mb-1">
                  {activeMaterial.category} Reference Guide
                </span>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeMaterial.title}
                </h3>
              </div>
              <button onClick={() => setActiveMaterial(null)} className={isDark ? 'text-[#808080] hover:text-white p-1' : 'text-slate-400 hover:text-black p-1'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-6 overflow-y-auto space-y-4 text-xs leading-relaxed ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'
              }`}>
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-black/40 border-[#2d2d2d] text-white' : 'bg-slate-50 border-slate-200 text-slate-900 font-medium'
                }`}>
                {activeMaterial.description}
              </div>

              <div className={`p-4 rounded-xl font-mono whitespace-pre-wrap leading-relaxed border ${isDark ? 'bg-[#0f0f0f] border-[#222222] text-[#b3b3b3]' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}>
                {activeMaterial.content}
              </div>
            </div>

            <div className={`p-4 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
              }`}>
              <span className={isDark ? 'text-[#808080]' : 'text-slate-500'}>Sahyadri Placement Resources Bank</span>
              <button
                onClick={() => setActiveMaterial(null)}
                className="btn-netflix-primary px-4 py-1.5 rounded font-bold"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
