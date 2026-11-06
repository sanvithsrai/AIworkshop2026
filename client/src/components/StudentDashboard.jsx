import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import {
  UserCheck,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export default function StudentDashboard({ onLaunchExam }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await api.getMyHistory();
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load test history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalAttempted = history.length;
  const avgScore = totalAttempted > 0
    ? Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / totalAttempted)
    : 0;

  const passedCount = history.filter(h => h.passed).length;
  const readinessIndex = Math.min(100, Math.round(((user?.cgpa || 8.0) * 6.5) + (avgScore * 0.35)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Student Profile & Readiness Score Card */}
      <div className={`p-6 sm:p-8 rounded-2xl mb-8 border relative overflow-hidden transition-all ${isDark
          ? 'card-feature-gradient border-[#5a5a5a]/40'
          : 'bg-white border-slate-200 shadow-sm'
        }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* User Details */}
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#10b981] shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Batch 2026
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                {user?.branch} • Sem {user?.semester || 6}
              </p>
              <div className={`flex items-center gap-3 text-xs mt-1 font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                <span>USN: <strong className="text-[#10b981]">{user?.usn || '4SF22CI048'}</strong></span>
                <span>•</span>
                <span>CGPA: <strong className="text-[#10b981] font-bold">{user?.cgpa || '8.85'}</strong></span>
              </div>
            </div>
          </div>

          {/* Readiness Gauge Meter */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border self-start md:self-auto ${isDark ? 'bg-black/50 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={isDark ? '#2d2d2d' : '#e2e8f0'}
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeDasharray="175"
                  strokeDashoffset={175 - (175 * readinessIndex) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className={`absolute text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{readinessIndex}%</span>
            </div>
            <div>
              <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Placement Readiness</span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {readinessIndex >= 80 ? 'Tier-1 High Potential' : readinessIndex >= 60 ? 'Competitive' : 'Needs Practice'}
              </span>
              <p className="text-[10px] text-emerald-500 mt-0.5 font-medium">Based on CGPA & Test Accuracy</p>
            </div>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
          }`}>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
            }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Exams Completed</span>
            <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalAttempted}</span>
            <span className={`text-[10px] block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Official MCQs</span>
          </div>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
            }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Average Accuracy</span>
            <span className="text-xl font-black text-[#10b981]">{avgScore}%</span>
            <span className={`text-[10px] block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Across All Modules</span>
          </div>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
            }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Exams Cleared</span>
            <span className="text-xl font-black text-emerald-500">{passedCount} / {totalAttempted || 1}</span>
            <span className={`text-[10px] block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Passing Marks Met</span>
          </div>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
            }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Japan Target</span>
            <span className="text-xl font-black text-[#10b981]">JLPT N5</span>
            <span className={`text-[10px] block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Belc & IMV Priority</span>
          </div>
        </div>
      </div>

      {/* Test Attempt History */}
      <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'card-feature-gradient border-[#5a5a5a]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#10b981]" />
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Examination Record</h3>
          </div>
          <span className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
            {history.length} Attempt{history.length === 1 ? '' : 's'} Logged
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-[#5a5a5a]' : 'text-slate-400'}`} />
            <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No exam attempts recorded yet</p>
            <p className={`text-xs mb-4 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Take your first aptitude or Japanese mock test to begin building your placement portfolio.</p>
            <button
              onClick={onLaunchExam}
              className="btn-netflix-primary text-xs px-4 py-2 rounded font-bold"
            >
              Start First Practice Exam
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
              <thead className={`uppercase text-[10px] border-b ${isDark ? 'bg-black/60 text-[#808080] border-[#2d2d2d]' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                <tr>
                  <th className="py-3 px-4">Exam Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#2d2d2d]' : 'divide-slate-200'}`}>
                {history.map(item => (
                  <tr key={item.id} className={isDark ? 'hover:bg-white/5 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                    <td className={`py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.exam_title || 'Placement Practice Exam'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${isDark ? 'bg-[#2d2d2d] text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                        {item.category || 'Aptitude'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.score} / {item.total_marks}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#10b981]">
                      {item.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase flex items-center gap-1 w-fit ${item.passed
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                        }`}>
                        {item.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.passed ? 'PASS' : 'FAIL'}</span>
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                      {item.created_at?.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
