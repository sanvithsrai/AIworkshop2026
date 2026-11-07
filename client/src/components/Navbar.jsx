import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MobileSidebar from './MobileSidebar';
import { 
  Menu, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  Award, 
  Briefcase, 
  Globe, 
  GraduationCap, 
  Terminal, 
  LayoutDashboard,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAdminCall, 
  onOpenVoiceAgent, 
  onOpenChatbot 
}) {
  const { user, isFaculty, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navItems = [
    { id: 'tests', label: 'Test Corner', shortLabel: 'Tests', icon: Award },
    { id: 'recruiters', label: 'Recruiters', shortLabel: 'Recruiters', icon: Briefcase },
    { id: 'newsletters', label: 'Tech & Campus News', shortLabel: 'News', icon: Globe },
    { id: 'jobs', label: 'Verified Jobs', shortLabel: 'Jobs', icon: Briefcase },
    { id: 'materials', label: 'Resources', shortLabel: 'Resources', icon: GraduationCap },
    { id: 'hackathons', label: 'Hackathons', shortLabel: 'Events', icon: Terminal },
  ];

  return (
    <>
      <header 
        className={`w-full sticky top-0 z-40 transition-colors duration-200 shadow-md ${
          isDark 
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626]' 
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200'
        }`}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* 1. LEFT: Sahyadri SPACE Brand Logo */}
            <div 
              onClick={() => setActiveTab('tests')}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0 z-20"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-md shadow-[#10b981]/15 border border-[#10b981]/40 group-hover:scale-105 transition-transform duration-200 overflow-hidden shrink-0">
                {!logoError ? (
                  <img
                    src="/sahyadri-logo.jpg"
                    alt="Sahyadri Logo"
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-[#10b981] flex items-center justify-center font-black text-xl text-white">
                    S
                  </div>
                )}
              </div>

              <div className="flex flex-col select-none">
                <div className="flex items-center gap-1 sm:gap-1.5 leading-tight">
                  <span className="font-black text-base sm:text-lg tracking-wider text-[#10b981]">SAHYADRI</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 leading-none">
                    SPACE
                  </span>
                </div>
                <a
                  href="https://sahyadri.edu.in"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold transition-colors mt-0.5 leading-none ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#10b981]'
                  }`}
                  title="Official College Website: sahyadri.edu.in"
                >
                  <span>sahyadri.edu.in</span>
                  <ExternalLink className="w-2 h-2 text-[#10b981]" />
                </a>
              </div>
            </div>

            {/* 2. CENTER: Desktop Navigation Panel (Hidden on Mobile/Tablet) */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-1.5 xl:px-3 py-1 xl:py-1.5 rounded-lg text-[11px] xl:text-xs font-semibold transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap ${
                      isActive 
                        ? 'text-[#10b981] font-bold bg-[#10b981]/10 shadow-inner' 
                        : isDark
                          ? 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-[#10b981] hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3 h-3 xl:w-3.5 xl:h-3.5 ${isActive ? 'text-[#10b981]' : isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="xl:hidden inline">{item.shortLabel}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#10b981] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 3. RIGHT: Desktop Controls & Prominent Mobile Side Bar Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 z-20 ml-auto">
              
              {/* Desktop User Hub Card & Logout (Hidden on mobile to preserve layout) */}
              {user ? (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-xs shadow-sm group select-none ${
                      activeTab === 'dashboard'
                        ? isDark
                          ? 'bg-[#10b981]/15 border-[#10b981] text-white shadow-[#10b981]/20 shadow-md'
                          : 'bg-[#10b981]/10 border-[#10b981] text-slate-900 shadow-sm'
                        : isDark 
                          ? 'bg-[#141414] border-[#2e2e2e] text-white hover:border-[#10b981]/60 hover:bg-[#1f1f1f]' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-[#10b981]/60 hover:bg-slate-100'
                    }`}
                    title={`Signed in as ${user.name} - Open Dashboard`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border-2 border-[#10b981]"
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border rounded-full ${
                        isDark ? 'border-[#141414]' : 'border-white'
                      }`} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className={`font-bold text-xs leading-tight max-w-[110px] truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {user.name}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase leading-tight tracking-wider mt-0.5 ${
                        isFaculty ? 'text-purple-400' : isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setActiveTab('login-portal');
                    }}
                    className="btn-netflix-primary text-xs px-2.5 py-1.5 font-bold flex items-center gap-1 shadow-md shrink-0"
                    title="Sign Out from Portal"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab('login-portal')}
                  className="hidden lg:flex btn-netflix-primary text-xs px-3.5 py-1.5 font-bold items-center gap-1.5 shadow-md shrink-0"
                  title="Sign In with College Email"
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Login / Sign In</span>
                </button>
              )}

              {/* Mobile Compact User Avatar / Login Trigger (Visible < lg) */}
              <div className="flex lg:hidden items-center">
                {user ? (
                  <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="relative p-0.5 rounded-full border border-[#10b981]/50 hover:scale-105 transition-transform"
                    title={`Signed in as ${user.name} - Open Menu`}
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-black rounded-full" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('login-portal')}
                    className="p-1.5 rounded-lg border border-[#10b981]/30 bg-[#10b981]/10 text-emerald-400 text-xs font-bold flex items-center gap-1"
                    title="Sign In"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#10b981]" />
                  </button>
                )}
              </div>

              {/* UI Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shadow-sm shrink-0 ${
                  isDark 
                    ? 'bg-[#181818] border-[#333333] text-emerald-300 hover:text-white hover:bg-[#262626]' 
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:text-black hover:bg-slate-200'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle UI Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* PROMINENT MOBILE SIDEBAR HAMBURGER BUTTON (Visible on screens < lg) */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className={`lg:hidden px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-extrabold shadow-md active:scale-95 shrink-0 ${
                  isDark
                    ? 'bg-[#10b981]/15 border-[#10b981]/50 text-white hover:bg-[#10b981]/25'
                    : 'bg-[#10b981] border-[#10b981] text-white hover:bg-[#059669]'
                }`}
                aria-label="Open Navigation Sidebar"
                title="Open All Portal Pages"
              >
                <Menu className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform" />
                <span className="font-extrabold text-xs">Pages</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Instant 1-Tap Access on Phones)  */}
      {/* ============================================================== */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-1 sm:px-2 py-1.5 flex items-center justify-around shadow-2xl transition-all ${
        isDark ? 'bg-[#0a0a0a]/95 border-[#222222]' : 'bg-white/95 border-slate-200'
      }`}>
        {/* Tab 1: Tests */}
        <button
          onClick={() => { setActiveTab('tests'); setMobileSidebarOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'tests'
              ? 'text-[#10b981] bg-[#10b981]/15 scale-105'
              : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-500 hover:text-black'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tests</span>
        </button>

        {/* Tab 2: Recruiters */}
        <button
          onClick={() => { setActiveTab('recruiters'); setMobileSidebarOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'recruiters'
              ? 'text-[#10b981] bg-[#10b981]/15 scale-105'
              : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-500 hover:text-black'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Drives</span>
        </button>

        {/* Tab 3: News */}
        <button
          onClick={() => { setActiveTab('newsletters'); setMobileSidebarOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'newsletters'
              ? 'text-[#10b981] bg-[#10b981]/15 scale-105'
              : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-500 hover:text-black'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>News</span>
        </button>

        {/* Tab 4: Study Materials */}
        <button
          onClick={() => { setActiveTab('materials'); setMobileSidebarOpen(false); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'materials'
              ? 'text-[#10b981] bg-[#10b981]/15 scale-105'
              : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-500 hover:text-black'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Notes</span>
        </button>

        {/* Tab 5: All Pages Sidebar Drawer Trigger Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-extrabold bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30 active:scale-95 transition-all"
        >
          <Menu className="w-4 h-4 text-white" />
          <span>All Pages</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SLIDE-OVER MOBILE SIDEBAR DRAWER (Full Page Access)            */}
      {/* ============================================================== */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminCall={onOpenAdminCall}
        onOpenVoiceAgent={onOpenVoiceAgent}
        onOpenChatbot={onOpenChatbot}
      />
    </>
  );
}
