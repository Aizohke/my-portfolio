import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import { FolderOpen, FileText, Zap, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';

function StatCard({ icon, label, count, to, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={to} className="block bg-dark-card border border-dark-border p-5 group
                                hover:border-rust-500/40 transition-colors duration-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: color }} />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-display tracking-wider text-white mb-1">{count ?? '—'}</div>
            <div className="text-sm text-steel-400">{label}</div>
          </div>
          <div className="p-2.5 bg-dark-bg border border-dark-border group-hover:border-rust-500/40 transition-colors">
            <span style={{ color }}>{icon}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-steel-600 mt-3 group-hover:text-rust-400 transition-colors">
          Manage <ArrowRight size={11} />
        </div>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getAllProjects(),
      adminAPI.getAllPosts(),
      adminAPI.getAllSkills(),
      adminAPI.getAllExperience(),
    ]).then(([p, b, s, e]) => {
      setCounts({
        projects:   p.data.count,
        posts:      b.data.data?.length,
        skills:     s.data.data?.length,
        experience: e.data.data?.length,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: <FolderOpen size={18} />, label: 'Projects',    count: counts.projects,   to: '/admin/projects',   color: '#c0392b' },
    { icon: <FileText size={18} />,   label: 'Blog Posts',  count: counts.posts,      to: '/admin/blog',       color: '#e58e26' },
    { icon: <Zap size={18} />,        label: 'Skills',      count: counts.skills,     to: '/admin/skills',     color: '#27ae60' },
    { icon: <Briefcase size={18} />,  label: 'Experience',  count: counts.experience, to: '/admin/experience', color: '#2980b9' },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs text-rust-500 tracking-widest mb-1">// cms dashboard</p>
        <h1 className="text-2xl font-heading text-white">Welcome back, Admin</h1>
        <p className="text-steel-400 text-sm mt-1">Manage all content for the Isaac Mathenge portfolio.</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Quick tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-card border border-dark-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-rust-500" />
          <h2 className="font-heading text-white">Quick Reference</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-steel-400">
          {[
            ['Projects', 'Add case studies with images, tech stack, and impact metrics'],
            ['Blog', 'Write engineering articles with full rich-text editor'],
            ['Skills', 'Manage skill categories and proficiency levels'],
            ['Settings', 'Edit hero text, about section, and section visibility'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-2">
              <span className="text-rust-500 mt-0.5">›</span>
              <span><strong className="text-white">{title}:</strong> {desc}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
