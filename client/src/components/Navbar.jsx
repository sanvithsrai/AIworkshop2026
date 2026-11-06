import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  PhoneCall, 
  Bot, 
  UserCheck, 
  ShieldCheck, 
  LogOut, 
  BookOpen, 
  Briefcase, 
  Award, 
  Terminal, 
  GraduationCap, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogIn,
  Globe,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAdminCall, 
  onOpenVoiceAgent, 
  onOpenChatbot 
}) {
  const { user, isFaculty, switchRole, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header 
      className={`w-full sticky top-0 z-50 transition-colors duration-200 shadow-md ${
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-md shadow-[#10b981]/15 border border-[#10b981]/40 group-hover:scale-105 transition-transform duration-200 overflow-hidden shrink-0">
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
              <div className="flex items-center gap-1.5 leading-tight">
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

          {/* 2. CENTER: Strictly & Mathematically Centered Topmost Navigation Panel */}
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

          {/* 3. RIGHT: Prominent, Completely Visible Profile Card & Controls (Never hidden in corner) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 z-20 ml-auto pr-1 sm:pr-2">
            
            {/* User Profile Card & Logout (Prominent, Visible, Clear) */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Clickable Profile Card -> Opens Student/Faculty Hub */}
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
                  title={`Signed in as ${user.name} - Click to open ${isFaculty ? 'Faculty Hub' : 'My Progress'}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={user.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-[#10b981]"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border rounded-full ${
                      isDark ? 'border-[#141414]' : 'border-white'
                    }`} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`font-bold text-xs leading-tight max-w-[95px] sm:max-w-[120px] truncate ${
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

                {/* Explicit Red Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setActiveTab('login-portal');
                  }}
                  className="btn-netflix-primary text-xs px-2.5 sm:px-3 py-1.5 font-bold flex items-center gap-1 shadow-md shrink-0"
                  title="Sign Out from Portal"
                >
                  <LogOut className="w-3.5 h-3.5 text-white" />
                  <span className="text-white hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login-portal')}
                className="btn-netflix-primary text-xs px-3.5 py-1.5 font-bold flex items-center gap-1.5 shadow-md shrink-0"
                title="Sign In with College Email"
              >
                <LogIn className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Login / Sign In</span>
              </button>
            )}

            {/* UI Theme Toggle Button (Light/Dark Mode Icon Pill) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shadow-sm shrink-0 ${
                isDark 
                  ? 'bg-[#181818] border-[#333333] text-amber-300 hover:text-white hover:bg-[#262626]' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:text-black hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle UI Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Menu Hamburger Toggle (only on screens < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#808080] hover:text-[#10b981] rounded-lg border border-transparent hover:border-[#333333]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden mt-2 pt-3 border-t pb-4 flex flex-col gap-2 ${
            isDark ? 'border-[#262626]' : 'border-slate-200'
          }`}>
            {/* Quick Mobile Theme & User Controls */}
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 mb-2 ${
              isDark ? 'bg-[#141414] border-[#262626]' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 text-xs font-bold py-1.5 px-3 rounded-lg border transition-all ${
                  isDark ? 'bg-[#222222] border-[#333333] text-amber-300' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setActiveTab('login-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="btn-netflix-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('login-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="btn-netflix-primary text-xs px-3 py-1.5 font-bold flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Sign In</span>
                </button>
              )}
            </div>

            {/* Nav Items List */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                    isActive 
                      ? 'bg-[#10b981] text-white shadow' 
                      : isDark ? 'text-[#b3b3b3] hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-white text-[#10b981]' : 'bg-[#10b981] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dedicated Login Portal Link in Mobile Drawer */}
            <button
              onClick={() => {
                setActiveTab('login-portal');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'login-portal'
                  ? 'bg-[#10b981] text-white shadow' 
                  : isDark ? 'text-[#b3b3b3] hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-black hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LogIn className="w-4 h-4" />
                <span>Login Dashboard / Account Switcher</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                SSO
              </span>
            </button>

            {/* Assistant Tools in Mobile Menu */}
            
            {/* Official College Link in Mobile Drawer */}
            <a
              href="https://sahyadri.edu.in"
              target="_blank"
              rel="noreferrer"
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors border ${
                isDark ? 'border-[#262626] text-[#b3b3b3] hover:text-white bg-[#141414]' : 'border-slate-200 text-slate-700 hover:text-black bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#10b981]" />
                <span>Official College Site (sahyadri.edu.in)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#10b981]" />
            </a>

<div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#262626]/40">
              <button
                onClick={() => { onOpenAdminCall(); setMobileMenuOpen(false); }}
                className="btn-netflix-primary py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Call Admin</span>
              </button>
              <button
                onClick={() => { onOpenChatbot(); setMobileMenuOpen(false); }}
                className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 border ${
                  isDark ? 'bg-[#1e1e1e] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#10b981]" />
                <span>AI Chatbot</span>
              </button>
            </div>

            {/* Quick Role Switcher in Mobile Menu */}
            <div className={`flex items-center justify-between pt-2 px-2 mt-1 border-t ${
              isDark ? 'border-[#262626]' : 'border-slate-200'
            }`}>
              <span className="text-xs text-[#808080]">Current Role:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => switchRole('student')}
                  className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                    !isFaculty ? 'bg-[#10b981] text-white' : isDark ? 'bg-[#222222] text-[#808080]' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => switchRole('faculty')}
                  className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                    isFaculty ? 'bg-[#10b981] text-white' : isDark ? 'bg-[#222222] text-[#808080]' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Faculty
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
