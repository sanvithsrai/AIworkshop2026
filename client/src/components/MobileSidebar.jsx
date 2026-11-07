import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Award,
  Briefcase,
  Globe,
  GraduationCap,
  Terminal,
  LayoutDashboard,
  LogIn,
  LogOut,
  X,
  Sun,
  Moon,
  ChevronRight,
  PhoneCall,
  Bot,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function MobileSidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenAdminCall,
  onOpenVoiceAgent,
  onOpenChatbot
}) {
  const { user, isFaculty, switchRole, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navPages = [
    {
      id: 'tests',
      label: 'Test Corner',
      subtitle: '20 Proctored MCQs & Diagnostic Exams',
      badge: '20 Tests',
      icon: Award,
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'recruiters',
      label: 'Recruiters & Drives',
      subtitle: 'Belc Japan (₹47.24 LPA), IMV & Top Drives',
      badge: '₹47.24 LPA',
      icon: Briefcase,
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    {
      id: 'newsletters',
      label: 'Tech & Campus News',
      subtitle: 'Weekly Placement Buzz & Global Tech Digests',
      badge: 'Live News',
      icon: Globe,
      badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'jobs',
      label: 'Verified Jobs Portal',
      subtitle: 'Curated On-Campus & Off-Campus Openings',
      badge: 'Verified',
      icon: Briefcase,
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    {
      id: 'materials',
      label: 'Study Materials & Cheat Sheets',
      subtitle: 'Option 1 Text Notes & Option 2 Concept Blogs',
      badge: 'Dual Option',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'hackathons',
      label: 'Hackathons & Competitions',
      subtitle: 'National & Global Developer Competitions',
      badge: 'Events',
      icon: Terminal,
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    },
    {
      id: 'dashboard',
      label: isFaculty ? 'Faculty Administration Hub' : 'Student Progress Dashboard',
      subtitle: isFaculty ? 'Exam authoring, student scores & analytics' : 'My test scores, preparation & stats',
      badge: isFaculty ? 'Faculty' : 'Progress',
      icon: LayoutDashboard,
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'login-portal',
      label: 'Login Portal & Role Switcher',
      subtitle: 'Student, Faculty & Admin Single Sign-On',
      badge: 'SSO',
      icon: LogIn,
      badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  ];

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none delay-300'
      }`}
      aria-hidden={!isOpen}
    >
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Slide-over Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-[88%] max-w-[340px] flex flex-col h-full shadow-2xl transition-transform duration-300 ease-out z-10 border-r ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark 
            ? 'bg-[#0d0d0d] border-[#262626] text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-[#222222] bg-[#121212]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-[#10b981]/40 shrink-0">
              <img
                src="/sahyadri-logo.jpg"
                alt="Sahyadri Logo"
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base tracking-wider text-[#10b981]">SAHYADRI</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                  SPACE
                </span>
              </div>
              <p className={`text-[10px] mt-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                Placement & Career Portal
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isDark 
                ? 'bg-[#1c1c1c] text-[#808080] hover:text-white hover:bg-[#262626]' 
                : 'bg-slate-200/70 text-slate-600 hover:text-black hover:bg-slate-300'
            }`}
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          
          {/* User Profile Hub in Sidebar */}
          <div className={`p-3 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141414] border-[#262626]' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            {user ? (
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#10b981]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#141414] rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                        isFaculty 
                          ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`text-[11px] truncate ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                        {user.usn || user.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Role Switcher Pill */}
                <div className={`p-1.5 rounded-xl border flex items-center justify-between mb-2.5 text-xs ${
                  isDark ? 'bg-[#1c1c1c] border-[#2e2e2e]' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-[11px] font-medium ml-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                    Active Role:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => switchRole('student')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        !isFaculty 
                          ? 'bg-[#10b981] text-white shadow-sm' 
                          : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      onClick={() => switchRole('faculty')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isFaculty 
                          ? 'bg-[#10b981] text-white shadow-sm' 
                          : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      Faculty
                    </button>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-[#10b981] text-white border-[#10b981]'
                        : isDark ? 'bg-[#1c1c1c] border-[#333] text-white hover:border-[#10b981]' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>My Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      handleNavigate('login-portal');
                    }}
                    className="btn-netflix-primary py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-xs">Guest Visitor</p>
                  <p className={`text-[11px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                    Sign in to track progress
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('login-portal')}
                  className="btn-netflix-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* All Accessible Pages Section */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
                isDark ? 'text-[#808080]' : 'text-slate-500'
              }`}>
                Explore Portal Pages
              </span>
              <span className="text-[10px] font-mono text-[#10b981]">
                {navPages.length} Sections
              </span>
            </div>

            <div className="space-y-1.5">
              {navPages.map((page) => {
                const Icon = page.icon;
                const isActive = activeTab === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => handleNavigate(page.id)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2 transition-all duration-150 border ${
                      isActive
                        ? isDark
                          ? 'bg-[#10b981]/15 border-[#10b981] text-white shadow-md shadow-[#10b981]/10'
                          : 'bg-[#10b981]/10 border-[#10b981] text-slate-900 shadow-sm'
                        : isDark
                          ? 'bg-[#121212] border-[#222222] text-[#b3b3b3] hover:text-white hover:border-[#333333] hover:bg-[#181818]'
                          : 'bg-white border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isActive 
                          ? 'bg-[#10b981] text-white border-[#10b981]' 
                          : isDark ? 'bg-[#1a1a1a] text-[#808080] border-[#2c2c2c]' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold leading-tight truncate ${
                            isActive ? 'text-[#10b981]' : isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {page.label}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-tight truncate mt-0.5 ${
                          isActive 
                            ? isDark ? 'text-emerald-300/80' : 'text-emerald-700' 
                            : isDark ? 'text-[#808080]' : 'text-slate-500'
                        }`}>
                          {page.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {page.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border leading-none ${page.badgeColor}`}>
                          {page.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${
                        isActive ? 'text-[#10b981]' : isDark ? 'text-[#666]' : 'text-slate-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Assistant AI Tools */}
          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-1 block mb-2 ${
              isDark ? 'text-[#808080]' : 'text-slate-500'
            }`}>
              Interactive Assistants
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminCall && onOpenAdminCall();
                }}
                className="btn-netflix-primary py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Call Admin</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenChatbot && onOpenChatbot();
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  isDark ? 'bg-[#181818] border-[#2e2e2e] text-white hover:border-[#10b981]' : 'bg-white border-slate-300 text-slate-800 hover:border-[#10b981]'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#10b981]" />
                <span>AI Chatbot</span>
              </button>
            </div>
          </div>

          {/* Official College Link Banner */}
          <a
            href="https://sahyadri.edu.in"
            target="_blank"
            rel="noreferrer"
            className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs font-bold transition-all group ${
              isDark 
                ? 'bg-gradient-to-r from-[#141414] to-[#1a1a1a] border-[#2e2e2e] text-white hover:border-[#10b981]' 
                : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-[#10b981]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5 text-[#10b981]" />
              </div>
              <div>
                <p className="leading-tight text-xs font-bold">Sahyadri College</p>
                <p className={`text-[10px] font-normal leading-tight mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  sahyadri.edu.in
                </p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#10b981] group-hover:translate-x-0.5 transition-transform" />
          </a>

        </div>

        {/* Drawer Footer: Theme Switcher & Portal Info */}
        <div className={`p-3 border-t shrink-0 flex items-center justify-between gap-2 ${
          isDark ? 'border-[#222222] bg-[#121212]' : 'border-slate-200 bg-slate-50'
        }`}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isDark 
                ? 'bg-[#1c1c1c] border-[#333] text-emerald-300 hover:text-white hover:border-[#10b981]' 
                : 'bg-white border-slate-300 text-slate-800 hover:text-black hover:border-[#10b981]'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Quick Close Button */}
          <button
            onClick={onClose}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
              isDark ? 'bg-[#1c1c1c] border-[#333] text-[#808080] hover:text-white' : 'bg-white border-slate-300 text-slate-600 hover:text-black'
            }`}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

