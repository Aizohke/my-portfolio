import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, Loader2, Eye, EyeOff, Cog } from 'lucide-react';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 hero-grid">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-rust-500/5 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-dark-card border border-dark-border mb-4">
            <Cog size={24} className="text-rust-500 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <h1 className="font-display text-3xl tracking-widest text-white">ADMIN ACCESS</h1>
          <p className="text-sm text-steel-500 mt-1 font-mono">Isaac Mathenge — Portfolio CMS</p>
        </div>

        <div className="bg-dark-card border border-dark-border p-8">
          <div className="w-full h-0.5 bg-rust-500 mb-8" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-steel-400 font-mono tracking-widest mb-1.5">EMAIL</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="admin@domain.com"
                  className="form-input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-steel-400 font-mono tracking-widest mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="form-input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-500 hover:text-white">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center tracking-widest text-sm mt-2 disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> AUTHENTICATING</> : <><Lock size={16} /> ACCESS DASHBOARD</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-border">
            <p className="text-xs text-steel-600 text-center font-mono">
              🔒 Secured with JWT + bcrypt — Rate limited
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
