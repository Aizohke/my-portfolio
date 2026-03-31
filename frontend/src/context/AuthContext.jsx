import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await adminAPI.getMe();
      setAdmin(data.admin);
    } catch {
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await adminAPI.login({ email, password });
    localStorage.setItem('adminToken', data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    try { await adminAPI.logout(); } catch {}
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
