import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sahyadri_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        // Pre-set demo student user for instant exploration
        setUser({
          id: 'usr_student_sanvith',
          name: 'Sanvith Rai',
          email: 'sanvith.rai.ci24@sahyadri.edu.in',
          role: 'student',
          usn: '4SF22CI048',
          branch: 'Computer Science & Engineering',
          semester: 6,
          cgpa: 8.85,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        });
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (err) {
        console.warn('Failed to load session, clearing token:', err);
        localStorage.removeItem('sahyadri_auth_token');
        setToken(null);
        // Fallback demo user
        setUser({
          id: 'usr_student_sanvith',
          name: 'Sanvith Rai',
          email: 'sanvith.rai.ci24@sahyadri.edu.in',
          role: 'student',
          usn: '4SF22CI048',
          branch: 'Computer Science & Engineering',
          semester: 6,
          cgpa: 8.85
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('sahyadri_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('sahyadri_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const googleLogin = async (googleData = {}) => {
    const data = await api.googleLogin(googleData);
    localStorage.setItem('sahyadri_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sahyadri_auth_token');
    setToken(null);
    setUser(null);
  };

  // Quick role switcher for demo & evaluation convenience
  const switchRole = async (targetRole) => {
    if (targetRole === 'faculty') {
      try {
        const res = await api.login('admin@sahyadri.edu.in', 'SAHYADRI');
        localStorage.setItem('sahyadri_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
      } catch (e) {
        setUser({
          id: 'usr_admin_rashmi',
          name: 'Prof. Rashmi Bhandary',
          email: 'admin@sahyadri.edu.in',
          role: 'faculty',
          usn: 'FAC_PL_001',
          branch: 'Career Guidance, Training & Placement Cell',
          semester: 0,
          cgpa: 10.0,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        });
      }
    } else {
      try {
        const res = await api.login('sanvith.rai.ci24@sahyadri.edu.in', 'SAHYADRI');
        localStorage.setItem('sahyadri_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
      } catch (e) {
        setUser({
          id: 'usr_student_sanvith',
          name: 'Sanvith Rai',
          email: 'sanvith.rai.ci24@sahyadri.edu.in',
          role: 'student',
          usn: '4SF22CI048',
          branch: 'Computer Science & Engineering',
          semester: 6,
          cgpa: 8.85,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        switchRole,
        isFaculty: user?.role === 'faculty' || user?.role === 'admin',
        isStudent: user?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

