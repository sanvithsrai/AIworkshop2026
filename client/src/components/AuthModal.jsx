import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, Mail, Lock, User, GraduationCap, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, googleLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('sanvith.rai.ci24@sahyadri.edu.in');
  const [password, setPassword] = useState('SAHYADRI');
  const [name, setName] = useState('Sanvith Rai');
  const [usn, setUsn] = useState('4SF22CI048');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, role, usn });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await googleLogin({
        email: 'sanvith.rai.ci24@sahyadri.edu.in',
        name: 'Sanvith Rai (Sahyadri Google Workspace)'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Google Gmail authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCreds = (type) => {
    if (type === 'student') {
      setEmail('sanvith.rai.ci24@sahyadri.edu.in');
      setPassword('SAHYADRI');
      setRole('student');
    } else {
      setEmail('admin@sahyadri.edu.in');
      setPassword('SAHYADRI');
      setRole('faculty');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#808080] hover:text-white p-1 rounded-full hover:bg-[#2d2d2d]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand with Official Sahyadri Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-[#e50914]/40 overflow-hidden shadow-md shrink-0">
            <img
              src="/sahyadri-logo.jpg"
              alt="Sahyadri Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white">SAHYADRI</span>
              <span className="text-xs font-black text-[#e50914] px-1.5 py-0.2 rounded bg-[#e50914]/20 border border-[#e50914]/40">SPACE</span>
            </div>
            <p className="text-[10px] text-[#808080]">Placement and Career Portal for Engineers</p>
          </div>
        </div>

        {/* Google Workspace Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-100 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md mb-4 transition-all"
        >
          {/* Google SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign In with Sahyadri Google Gmail</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#2d2d2d]" />
          <span className="text-[10px] text-[#808080] uppercase tracking-wider">or college mail</span>
          <div className="flex-1 h-px bg-[#2d2d2d]" />
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-[#181818] p-2.5 rounded-xl border border-[#2d2d2d] mb-4 text-xs">
          <span className="text-[10px] text-[#808080] font-semibold block mb-1.5">
            Quick Auto-Fill Test Credentials:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickCreds('student')}
              className="flex-1 py-1.5 px-2 rounded bg-[#e50914] hover:bg-[#f40612] text-white text-[11px] font-bold text-center transition-colors"
            >
              🎓 Student (Sanvith)
            </button>
            <button
              type="button"
              onClick={() => fillQuickCreds('faculty')}
              className="flex-1 py-1.5 px-2 rounded bg-[#222222] hover:bg-[#e50914] text-white text-[11px] font-bold border border-[#333333] hover:border-[#e50914] text-center transition-colors"
            >
              🛡️ Placement Dean
            </button>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs mb-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="text-[#808080] block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 pl-8 rounded bg-[#1c1c1c] border border-[#5a5a5a] text-white outline-none focus:border-[#e50914]"
                    placeholder="Sanvith Rai"
                  />
                  <User className="w-3.5 h-3.5 text-[#808080] absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[#808080] block mb-1">USN</label>
                <input
                  type="text"
                  value={usn}
                  onChange={e => setUsn(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1c1c1c] border border-[#5a5a5a] text-white outline-none focus:border-[#e50914]"
                  placeholder="4SF22CI048"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[#808080] block mb-1">College Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 pl-8 rounded bg-[#1c1c1c] border border-[#5a5a5a] text-white outline-none focus:border-[#e50914]"
                placeholder="sanvith.rai.ci24@sahyadri.edu.in"
              />
              <Mail className="w-3.5 h-3.5 text-[#808080] absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[#808080] block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2.5 pl-8 rounded bg-[#1c1c1c] border border-[#5a5a5a] text-white outline-none focus:border-[#e50914]"
                placeholder="••••••••"
              />
              <Lock className="w-3.5 h-3.5 text-[#808080] absolute left-2.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-netflix-primary py-2.5 rounded-xl font-bold text-xs mt-2"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Scholar Account' : 'Sign In to Hub'}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="mt-4 text-center text-xs text-[#808080]">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[#e50914] font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[#e50914] font-bold hover:underline"
              >
                Register
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
