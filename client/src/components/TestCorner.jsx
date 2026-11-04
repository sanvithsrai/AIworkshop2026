import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Play, CheckCircle2, Clock, Award, Star, Search, Filter, Sparkles, BookOpen } from 'lucide-react';

export default function TestCorner({ exams = [], loading = false, onSelectExam, searchQuery = '' }) {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = [
    { id: 'All', label: 'All Exams (20)' },
    { id: 'Demo', label: '⭐ 3 Sample Demo Tests' },
    { id: 'Aptitude', label: '🔢 Quantitative & Logic' },
    { id: 'Japanese', label: '⛩️ Japanese JLPT N5' },
    { id: 'Technical', label: '💻 Technical & CS' },
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredExams = exams.filter(exam => {
    // Search query filter
    const matchesSearch = !searchQuery ||
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.subcategory && exam.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    let matchesCategory = true;
    if (selectedCategory === 'Demo') {
      matchesCategory = exam.is_demo === true;
    } else if (selectedCategory !== 'All') {
      matchesCategory = exam.category.toLowerCase() === selectedCategory.toLowerCase();
    }

    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'All' || exam.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standardized Proctored MCQs</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            TEST CORNER
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
            20 Placement exams evaluated in real-time with step-by-step answer keys and performance breakdowns.
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium hidden sm:inline ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
            Difficulty:
          </span>
          <div className={`flex p-1 rounded-lg border ${
            isDark ? 'border-[#2d2d2d] bg-[#161616]' : 'border-slate-200 bg-slate-100'
          }`}>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  selectedDifficulty === d
                    ? 'bg-[#e50914] text-white shadow-sm font-bold'
                    : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                : isDark 
                  ? 'bg-[#1c1c1c] text-[#808080] border border-[#2d2d2d] hover:border-[#e50914] hover:text-white' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-[#e50914] hover:text-slate-900 shadow-sm'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Test Cards Grid */}
      {loading && exams.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-3 border-[#e50914] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Loading placement assessment tests...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          isDark ? 'card-feature-gradient border-[#5a5a5a]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <BookOpen className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
          <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No matching exams found</h3>
          <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Try broadening your search or resetting category filters.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedDifficulty('All'); }}
            className="mt-4 px-4 py-2 bg-[#e50914] text-white text-xs font-bold rounded hover:bg-[#b80710]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const isJapanese = exam.category === 'Japanese';
            const isDemo = exam.is_demo;

            return (
              <div
                key={exam.id}
                className={`flex flex-col justify-between p-5 rounded-2xl group relative overflow-hidden transition-all ${
                  isDark 
                    ? 'card-feature-gradient border border-[#5a5a5a]/30' 
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Glow bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e50914] via-rose-600 to-[#192247]" />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isDemo
                          ? 'bg-[#e50914]/20 text-[#e50914] border border-[#e50914]/40'
                          : isJapanese
                            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                            : isDark ? 'bg-[#2d2d2d] text-[#808080]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isDemo ? '⭐ Sample Demo' : exam.category}
                      </span>
                      {exam.subcategory && (
                        <span className={`text-[10px] font-medium ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                          • {exam.subcategory}
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      exam.difficulty === 'Easy' 
                        ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' 
                        : exam.difficulty === 'Medium' 
                          ? 'text-rose-500 bg-rose-500/10 border border-rose-500/20' 
                          : 'text-[#e50914] bg-[#e50914]/10 border border-[#e50914]/20 font-bold'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>

                  {/* Exam Title */}
                  <h3 className={`text-base font-bold transition-colors leading-snug mb-2 line-clamp-2 ${
                    isDark ? 'text-white group-hover:text-[#e50914]' : 'text-slate-900 group-hover:text-[#e50914]'
                  }`}>
                    {exam.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs line-clamp-2 mb-4 leading-relaxed font-normal ${
                    isDark ? 'text-[#808080]' : 'text-slate-600'
                  }`}>
                    {exam.description}
                  </p>
                </div>

                <div>
                  {/* Metadata Bar */}
                  <div className={`grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg text-center mb-4 text-[11px] border ${
                    isDark 
                      ? 'bg-black/40 border-[#2d2d2d] text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div>
                      <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Duration</span>
                      <span className="font-semibold">{exam.duration_minutes}m</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Questions</span>
                      <span className="font-semibold">{exam.questions_count || 5} MCQs</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Pass Mark</span>
                      <span className="font-semibold text-[#e50914]">{exam.passing_marks}/{exam.total_marks}</span>
                    </div>
                  </div>

                  {/* Previous Attempt Indicator */}
                  {exam.attempted && (
                    <div className="flex items-center justify-between text-xs mb-3 px-1 text-emerald-500">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed ({exam.attempts_count} attempt{exam.attempts_count > 1 ? 's' : ''})</span>
                      </div>
                      <span className="font-bold">Best: {exam.best_score}%</span>
                    </div>
                  )}

                  {/* Start CTA Button (Netflix Red) */}
                  <button
                    onClick={() => onSelectExam(exam)}
                    className="w-full btn-netflix-primary py-2.5 px-4 text-xs font-bold rounded flex items-center justify-center gap-2 group/btn shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white group-hover/btn:scale-110 transition-transform" />
                    <span className="text-white">{exam.attempted ? 'Retake Exam' : 'Start Practice Test'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
