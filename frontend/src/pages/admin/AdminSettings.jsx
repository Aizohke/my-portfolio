import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, Loader2, Eye, EyeOff, Lock, Globe, User } from 'lucide-react';

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'experience', 'blog', 'contact'];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    adminAPI.getSettings()
      .then(({ data }) => setSettings(data.data || {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  const toggleSection = (key) => {
    const current = settings.sections_visible || {};
    set('sections_visible', { ...current, [key]: !current[key] });
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.bulkSettings({
        hero_name:        settings.hero_name,
        hero_title:       settings.hero_title,
        hero_statement:   settings.hero_statement,
        about_text:       settings.about_text,
        github_url:       settings.github_url,
        linkedin_url:     settings.linkedin_url,
        email:            settings.email,
        sections_visible: settings.sections_visible,
      });
      toast.success('Settings saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (pwForm.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setPwLoading(true);
    try {
      await adminAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setPwLoading(false); }
  };

  if (loading) return (
    <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 skeleton" />)}</div>
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs text-rust-500 tracking-widest mb-1">// configuration</p>
        <h1 className="text-2xl font-heading text-white">Settings</h1>
      </div>

      {/* ── Content Settings ── */}
      <form onSubmit={handleSaveContent} className="space-y-6">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-card border border-dark-border p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-dark-border">
            <User size={16} className="text-rust-500" />
            <h2 className="font-heading text-white">Hero Section</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">NAME</label>
              <input value={settings.hero_name || ''} onChange={e => set('hero_name', e.target.value)}
                     className="form-input" />
            </div>
            <div>
              <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">TITLE LINE</label>
              <input value={settings.hero_title || ''} onChange={e => set('hero_title', e.target.value)}
                     className="form-input" placeholder="Role | Specialty | Interests" />
            </div>
            <div>
              <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">STATEMENT</label>
              <textarea value={settings.hero_statement || ''} onChange={e => set('hero_statement', e.target.value)}
                        rows={3} className="form-input resize-none" />
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="bg-dark-card border border-dark-border p-6">
          <h2 className="font-heading text-white mb-5 pb-4 border-b border-dark-border">About Section</h2>
          <textarea value={settings.about_text || ''} onChange={e => set('about_text', e.target.value)}
                    rows={6} className="form-input resize-y w-full"
                    placeholder="Your bio text..." />
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-dark-card border border-dark-border p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-dark-border">
            <Globe size={16} className="text-rust-500" />
            <h2 className="font-heading text-white">Social & Contact</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'GitHub URL', key: 'github_url', placeholder: 'https://github.com/...' },
              { label: 'LinkedIn URL', key: 'linkedin_url', placeholder: 'https://linkedin.com/in/...' },
              { label: 'Email', key: 'email', placeholder: 'your@email.com' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">{label.toUpperCase()}</label>
                <input value={settings[key] || ''} onChange={e => set(key, e.target.value)}
                       className="form-input" placeholder={placeholder} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section Visibility */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-dark-card border border-dark-border p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-dark-border">
            <Eye size={16} className="text-rust-500" />
            <h2 className="font-heading text-white">Section Visibility</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SECTIONS.map(key => {
              const visible = settings.sections_visible?.[key] !== false;
              return (
                <div key={key} onClick={() => toggleSection(key)}
                     className={`flex items-center justify-between p-3 border cursor-pointer transition-colors
                                ${visible ? 'border-rust-500/40 bg-rust-500/5' : 'border-dark-border hover:border-dark-border/80'}`}>
                  <span className="text-sm font-medium capitalize text-white">{key}</span>
                  <div className={`flex items-center gap-1.5 text-xs font-mono ${visible ? 'text-green-400' : 'text-steel-500'}`}>
                    {visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {visible ? 'ON' : 'OFF'}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <button type="submit" disabled={saving}
                className="btn-primary text-sm disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'SAVING...' : 'SAVE ALL SETTINGS'}
        </button>
      </form>

      {/* ── Password Change ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-dark-card border border-dark-border p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-dark-border">
          <Lock size={16} className="text-rust-500" />
          <h2 className="font-heading text-white">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          {[
            { label: 'CURRENT PASSWORD', key: 'currentPassword' },
            { label: 'NEW PASSWORD', key: 'newPassword' },
            { label: 'CONFIRM NEW PASSWORD', key: 'confirmPassword' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">{label}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'}
                       value={pwForm[key]}
                       onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                       required className="form-input pr-10" />
                <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-500 hover:text-white">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <button type="submit" disabled={pwLoading}
                  className="btn-primary text-sm disabled:opacity-60">
            {pwLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
            UPDATE PASSWORD
          </button>
        </form>
      </motion.div>
    </div>
  );
}
