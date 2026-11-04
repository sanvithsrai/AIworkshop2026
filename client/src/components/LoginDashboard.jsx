import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  FileEdit,
  Award,
  AlertCircle
} from 'lucide-react';

export default function LoginDashboard({ onNavigateToDashboard, onNavigateToTests }) {
  const { user, isFaculty, login, googleLogin, logout, switchRole } = useAuth();
  const { isDark } = useTheme();

  const [activeRoleTab, setActiveRoleTab] = useState(isFaculty ? 'faculty' : 'student'); // 'student' | 'faculty'
  const [email, setEmail] = useState(isFaculty ? 'admin@sahyadri.edu.in' : 'sanvith.rai.ci24@sahyadri.edu.in');
  const [password, setPassword] = useState('SAHYADRI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRoleTabChange = (role) => {
    setActiveRoleTab(role);
    setError('');
    setSuccessMsg('');
    if (role === 'student') {
      setEmail('sanvith.rai.ci24@sahyadri.edu.in');
      setPassword('SAHYADRI');
    } else {
      setEmail('admin@sahyadri.edu.in');
      setPassword('SAHYADRI');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      setSuccessMsg(`Welcome, ${res.user.name}! Authenticated as ${res.user.role}.`);
      setTimeout(() => {
        if (onNavigateToDashboard) onNavigateToDashboard();
      }, 700);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your college email credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const googleEmail = activeRoleTab === 'faculty' 
        ? 'admin@sahyadri.edu.in' 
        : 'sanvith.rai.ci24@sahyadri.edu.in';
      const googleName = activeRoleTab === 'faculty'
        ? 'Prof. Rashmi Bhandary (Placement Dean)'
        : 'Sanvith Rai (Sahyadri Google Workspace)';

      const res = await googleLogin({
        email: googleEmail,
        name: googleName
      });
      setSuccessMsg(`Google Workspace sign-in successful as ${res.user.role}.`);
      setTimeout(() => {
        if (onNavigateToDashboard) onNavigateToDashboard();
      }, 700);
    } catch (err) {
      setError(err.message || 'Google Gmail authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none w-full max-w-full overflow-hidden">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 bg-[#e50914]/15 border border-[#e50914]/40 text-[#e50914]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sahyadri College Single Sign-On (SSO)</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          STUDENT & FACULTY <span className="text-[#e50914]">LOGIN DASHBOARD</span>
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
          Authenticate with your official <strong>@sahyadri.edu.in</strong> college email to access customized placement portals. 
          Faculties can curate question banks, edit MCQs, and monitor student readiness.
        </p>
      </div>

      {/* Active Session Card (If User is Already Logged In) */}
      {user && (
        <div className={`max-w-2xl mx-auto mb-10 p-5 sm:p-6 rounded-2xl border transition-all ${
          isDark ? 'card-feature-gradient border-[#5a5a5a]/40' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#e50914]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    isFaculty 
                      ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30' 
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  }`}>
                    {user.role} Active
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>{user.email}</p>
                {user.usn && <p className="text-[11px] font-mono text-[#e50914]">USN: {user.usn}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onNavigateToDashboard}
                className="btn-netflix-primary px-3.5 py-2 text-xs font-bold rounded flex items-center gap-1.5 shadow"
              >
                <span>Go to {isFaculty ? 'Faculty Hub' : 'My Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => switchRole(isFaculty ? 'student' : 'faculty')}
                className={`px-3 py-2 text-xs font-semibold rounded border transition-colors ${
                  isDark ? 'bg-[#222222] border-[#333333] text-[#b3b3b3] hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black'
                }`}
              >
                Switch to {isFaculty ? 'Student' : 'Faculty'}
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-xs font-bold text-white bg-[#e50914] hover:bg-[#b80710] rounded flex items-center gap-1.5 shadow-sm transition-all"
                title="Sign Out / Logout"
              >
                <LogOut className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Sign Out / Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Interface Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Role Selector & Login Form (7 cols) */}
        <div className={`md:col-span-7 p-6 sm:p-8 rounded-2xl border transition-all ${
          isDark ? 'card-feature-gradient border-[#5a5a5a]/40' : 'bg-white border-slate-200 shadow-lg'
        }`}>
          
          {/* Student vs Faculty Tabs */}
          <div className={`flex p-1 rounded-xl border mb-6 ${
            isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => handleRoleTabChange('student')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeRoleTab === 'student'
                  ? 'bg-[#e50914] text-white shadow-md'
                  : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>
            <button
              onClick={() => handleRoleTabChange('faculty')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeRoleTab === 'faculty'
                  ? 'bg-[#e50914] text-white shadow-md'
                  : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Faculty / Admin Login</span>
            </button>
          </div>

          {/* Role Status Tag */}
          <div className="mb-5">
            <span className={`text-xs font-bold uppercase tracking-wider block ${
              activeRoleTab === 'faculty' ? 'text-purple-400' : 'text-[#e50914]'
            }`}>
              {activeRoleTab === 'faculty' ? 'Dean & Placement Faculty Access' : 'Undergraduate Scholar Portal'}
            </span>
            <h2 className={`text-xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sign In with College Email
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
              {activeRoleTab === 'faculty'
                ? 'Faculty accounts have privileges to create, edit, and publish MCQ question banks.'
                : 'Student accounts track mock test performances, Japanese modules, and placement readiness.'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Workspace Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-100 font-bold text-xs flex items-center justify-center gap-2.5 shadow-sm border border-slate-200 mb-5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>One-Click Sign In with Sahyadri Google Gmail</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className={`flex-1 h-px ${isDark ? 'bg-[#2d2d2d]' : 'bg-slate-200'}`} />
            <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-[#808080]' : 'text-slate-400'}`}>
              or login with college email & password
            </span>
            <div className={`flex-1 h-px ${isDark ? 'bg-[#2d2d2d]' : 'bg-slate-200'}`} />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                Sahyadri College Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={activeRoleTab === 'faculty' ? 'admin@sahyadri.edu.in' : 'sanvith.rai.ci24@sahyadri.edu.in'}
                  className={`w-full p-2.5 pl-10 rounded-lg text-xs outline-none focus:border-[#e50914] border ${
                    isDark ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <Mail className={`w-4 h-4 absolute left-3 top-3 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                Portal Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className={`w-full p-2.5 pl-10 rounded-lg text-xs outline-none focus:border-[#e50914] border ${
                    isDark ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <Lock className={`w-4 h-4 absolute left-3 top-3 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-netflix-primary py-2.5 px-4 text-xs font-bold rounded flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{loading ? 'Authenticating...' : `Log In as ${activeRoleTab === 'faculty' ? 'Faculty Admin' : 'Student'}`}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </form>

          {/* Quick Demo Credential Pills */}
          <div className={`mt-6 p-3 rounded-xl border text-xs ${
            isDark ? 'bg-[#121212] border-[#262626]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`block font-semibold text-[11px] mb-2 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
              ⚡ 1-Click Fast Fill Verified Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveRoleTab('student');
                  setEmail('sanvith.rai.ci24@sahyadri.edu.in');
                  setPassword('SAHYADRI');
                }}
                className="px-2.5 py-1 rounded bg-[#e50914]/15 border border-[#e50914]/30 text-[#e50914] text-[10px] font-bold hover:bg-[#e50914]/25"
              >
                🎓 Student: sanvith.rai.ci24@sahyadri.edu.in (Pass: SAHYADRI)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveRoleTab('faculty');
                  setEmail('admin@sahyadri.edu.in');
                  setPassword('SAHYADRI');
                }}
                className="px-2.5 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-500 text-[10px] font-bold hover:bg-purple-500/25"
              >
                🛡️ Faculty: admin@sahyadri.edu.in (Pass: SAHYADRI)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Role Capabilities & Features Breakdown (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          
          {/* Faculty Card: Question Management Privilege */}
          <div className={`p-6 rounded-2xl border transition-all ${
            activeRoleTab === 'faculty' 
              ? 'border-[#e50914] ring-2 ring-[#e50914]/30' 
              : isDark ? 'card-feature-gradient border-[#5a5a5a]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#e50914] flex items-center justify-center text-white">
                <FileEdit className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Faculty Question Studio
                </h3>
                <span className="text-[10px] text-[#e50914] font-semibold uppercase">Exclusive Privileges</span>
              </div>
            </div>

            <ul className={`text-xs space-y-2 leading-relaxed ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Create New Questions:</strong> Add MCQs with 4 options, verified answer keys, and step-by-step explanations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Modify Existing MCQs:</strong> Update question texts, change correct options, and adjust marks across all 20 modules.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Student Readiness Analytics:</strong> Real-time assessment scores and batch performance directory export.</span>
              </li>
            </ul>
          </div>

          {/* Student Card: Preparation Arena */}
          <div className={`p-6 rounded-2xl border transition-all ${
            activeRoleTab === 'student' 
              ? 'border-[#e50914] ring-2 ring-[#e50914]/30' 
              : isDark ? 'card-feature-gradient border-[#5a5a5a]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Student Placement Arena
                </h3>
                <span className="text-[10px] text-emerald-500 font-semibold uppercase">Undergraduate Access</span>
              </div>
            </div>

            <ul className={`text-xs space-y-2 leading-relaxed ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>20 Proctored Mock Tests:</strong> Aptitude, Japanese JLPT N5, and Core CS with live scoring.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Verified Job Openings:</strong> Direct applications for Belc Japan, Microsoft, Adobe, and IMV.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Personal Progress Gauge:</strong> Real-time readiness score calculation based on test accuracy.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

