import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Play, Sparkles, Globe, Award, TrendingUp, Compass, ArrowRight, ShieldCheck, LogIn, LogOut, PhoneCall, ExternalLink } from 'lucide-react';

export default function HeroBanner({ 
  onStartDemoTest, 
  onExploreJapan, 
  onSearchChange, 
  searchQuery, 
  onNavigateToLogin,
  onOpenAdminCall 
}) {
  const { isDark } = useTheme();
  const { user, isFaculty, logout } = useAuth();

  return (
    <div className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-hidden select-none w-full max-w-full">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-w-full">
        {isDark ? (
          <>
            {/* Dark Mode Cosmic Gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[350px] bg-gradient-to-tr from-neutral-800/40 via-emerald-600/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -top-20 right-0 w-[400px] max-w-full h-[350px] bg-[#210e17]/50 blur-[140px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
          </>
        ) : (
          <>
            {/* Light Mode Crisp & Fresh Gradients (No dark elements) */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] bg-gradient-to-tr from-red-100/50 via-rose-50/40 to-transparent blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -top-10 right-10 w-[350px] max-w-full h-[250px] bg-orange-100/30 blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-slate-50/80 to-slate-50" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Headlines, CTA, Search (7 cols) */}
          <div className="lg:col-span-7">
            {/* Top Pill / Badge */}
            <a
              href="https://sahyadri.edu.in"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs mb-5 backdrop-blur-sm shadow-sm border transition-all hover:border-[#10b981] group ${
                isDark 
                  ? 'bg-[#1f1f1f] border-[#333333] text-white hover:bg-[#262626] hover:border-slate-600' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
              title="Visit Sahyadri College Official Portal (sahyadri.edu.in)"
            >
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sahyadri College (SCEM) Placement Arena</span>
              <span className={isDark ? 'text-[#808080]' : 'text-slate-400'}>•</span>
              <span className="text-[#10b981] font-extrabold flex items-center gap-1">
                sahyadri.edu.in <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>

            {/* Headline */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              YOUR CENTRALIZED <br />
              <span className={`text-transparent bg-clip-text ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-white to-[#b3b3b3]' 
                  : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700'
              }`}>
                CAMPUS PLACEMENT
              </span>{' '}
              <span className="text-[#10b981] drop-shadow-[0_0_35px_rgba(16,185,129,0.35)]">PORTAL (SPACE).</span>
            </h1>

            {/* Subheading */}
            <p className={`text-sm sm:text-base leading-relaxed mb-8 font-normal max-w-xl ${
              isDark ? 'text-[#b3b3b3]' : 'text-slate-600'
            }`}>
              Welcome to <strong className={isDark ? 'text-white' : 'text-slate-900'}>SPACE</strong> — Sahyadri Placement and Career Portal for Engineers. Prepare, evaluate, and conquer on-campus recruitment with <strong className={isDark ? 'text-white' : 'text-slate-900'}>20+ proctored aptitude & Japanese language tests</strong>, 
              exclusive placement digests from <strong className={isDark ? 'text-white' : 'text-slate-900'}>Campus Buzz</strong>, verified job applications, 
              and real-time recruiter pipelines.
            </p>

            {/* Action Buttons (Strictly Red, no orange) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              {/* Primary Hero CTA Button (Netflix Red) */}
              <button
                onClick={onStartDemoTest}
                className="btn-netflix-primary px-5 py-3 text-sm sm:text-base font-bold shadow-xl shadow-[#10b981]/30 flex items-center gap-2 rounded group"
              >
                <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span className="text-white">Take Free Demo Exam</span>
              </button>

              {/* Japan Connect Button */}
              <button
                onClick={onExploreJapan}
                className={`px-4 py-3 rounded font-medium text-sm sm:text-base transition-all flex items-center gap-2 border ${
                  isDark 
                    ? 'bg-black/60 border-[#5a5a5a] text-white hover:border-white hover:bg-[#2d2d2d]/60' 
                    : 'bg-white border-slate-300 text-slate-800 hover:border-[#10b981] hover:bg-slate-50 shadow-sm'
                }`}
              >
                <Globe className="w-4 h-4 text-[#10b981]" />
                <span>Japan Connect (₹47.24 LPA)</span>
              </button>

              {/* Official College Portal Button */}
              <a
                href="https://sahyadri.edu.in"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-3 rounded font-medium text-sm sm:text-base transition-all flex items-center gap-2 border group ${
                  isDark 
                    ? 'bg-black/60 border-[#5a5a5a] text-white hover:border-[#10b981] hover:bg-[#2d2d2d]/60' 
                    : 'bg-white border-slate-300 text-slate-800 hover:border-[#10b981] hover:bg-slate-50 shadow-sm'
                }`}
                title="Visit Sahyadri College of Engineering & Management Official Website"
              >
                <img src="/sahyadri-logo.jpg" alt="SCEM" className="w-4 h-4 rounded-sm object-contain" />
                <span>Visit Official Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#10b981] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Quick Search Input */}
            <div className="relative max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tests (e.g., 'Japanese N5', 'Quantitative', 'Microsoft DSA')..."
                className={`w-full rounded-lg px-4 py-2.5 pl-10 text-xs sm:text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all border ${
                  isDark 
                    ? 'bg-[#161616]/90 border-[#5a5a5a] text-white placeholder-[#808080]' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                }`}
              />
              <Compass className={`w-4 h-4 absolute left-3 top-3 pointer-events-none ${
                isDark ? 'text-[#808080]' : 'text-slate-400'
              }`} />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute right-3 top-2.5 text-xs ${
                    isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Column: SPACE Quick Access & Account Hub Card (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark 
                ? 'card-feature-gradient border-[#5a5a5a]/40 shadow-xl' 
                : 'bg-white border-slate-200 shadow-lg'
            }`}>
              {/* Card Header: Session Status */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2d2d2d]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] block">
                      Portal Session
                    </span>
                    <h3 className={`text-sm font-bold truncate max-w-[170px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user ? user.name : 'Guest Scholar'}
                    </h3>
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      if (onNavigateToLogin) onNavigateToLogin();
                    }}
                    className="px-2.5 py-1 rounded bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] flex items-center gap-1 shadow-sm"
                    title="Sign Out / Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={onNavigateToLogin}
                    className="btn-netflix-primary px-3 py-1 text-xs font-bold rounded flex items-center gap-1 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white" />
                    <span>Login</span>
                  </button>
                )}
              </div>

              {/* Status details */}
              <div className="space-y-3 mb-5 text-xs">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#181818] border-[#2b2b2b]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-[10px] block text-[#808080] font-semibold uppercase">International Peak</span>
                    <strong className="text-sm font-black text-[#10b981]">₹47.24 LPA</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Belc Japan Active
                  </span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#181818] border-[#2b2b2b]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-[10px] block text-[#808080] font-semibold uppercase">Exam Corner Bank</span>
                    <strong className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      20 Proctored MCQs
                    </strong>
                  </div>
                  <button
                    onClick={onStartDemoTest}
                    className="text-[10px] font-bold text-[#10b981] hover:underline"
                  >
                    Launch Demo →
                  </button>
                </div>
              </div>

              {/* Action Buttons in Card */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2d2d2d]/30">
                <button
                  onClick={onNavigateToLogin}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isDark 
                      ? 'bg-[#181818] border-[#333333] text-white hover:bg-[#252525]' 
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>{user ? 'My Profile' : 'Sign In'}</span>
                </button>

                <button
                  onClick={onOpenAdminCall}
                  className="btn-netflix-primary py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-white" />
                  <span>Call Admin</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Highlighted Stat Cards Row */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t ${
          isDark ? 'border-[#2d2d2d]/70' : 'border-slate-200'
        }`}>
          <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
            <div className={`flex items-center justify-between mb-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
              <span className="text-xs uppercase tracking-wider font-semibold">Peak Package</span>
              <TrendingUp className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ₹47.24 <span className={`text-sm font-normal ${isDark ? 'text-[#b3b3b3]' : 'text-slate-500'}`}>LPA</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Belc Co., Ltd. (Tokyo, Japan)</p>
          </div>

          <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
            <div className={`flex items-center justify-between mb-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
              <span className="text-xs uppercase tracking-wider font-semibold">Recruiting Giants</span>
              <Award className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              250+ <span className={`text-sm font-normal ${isDark ? 'text-[#b3b3b3]' : 'text-slate-500'}`}>Firms</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Microsoft, Cohesity, Adobe, IMV</p>
          </div>

          <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
            <div className={`flex items-center justify-between mb-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
              <span className="text-xs uppercase tracking-wider font-semibold">Average Package</span>
              <Sparkles className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ₹6.3 <span className={`text-sm font-normal ${isDark ? 'text-[#b3b3b3]' : 'text-slate-500'}`}>LPA</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Consistent across all branches</p>
          </div>

          <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
            <div className={`flex items-center justify-between mb-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
              <span className="text-xs uppercase tracking-wider font-semibold">Practice Tests</span>
              <Globe className="w-4 h-4 text-emerald-500" />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              20 <span className={`text-sm font-normal ${isDark ? 'text-[#b3b3b3]' : 'text-slate-500'}`}>Modules</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Aptitude, Japanese & Tech MCQs</p>
          </div>
        </div>

      </div>
    </div>
  );
}
