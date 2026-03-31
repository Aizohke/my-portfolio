import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, FolderOpen, FileText, Zap, Briefcase,
  Settings, LogOut, Menu, X, Cog, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin',            label: 'Dashboard',  icon: <LayoutDashboard size={16} />, end: true },
  { to: '/admin/projects',   label: 'Projects',   icon: <FolderOpen size={16} /> },
  { to: '/admin/blog',       label: 'Blog Posts', icon: <FileText size={16} /> },
  { to: '/admin/skills',     label: 'Skills',     icon: <Zap size={16} /> },
  { to: '/admin/experience', label: 'Experience', icon: <Briefcase size={16} /> },
  { to: '/admin/settings',   label: 'Settings',   icon: <Settings size={16} /> },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-dark-card border-r border-dark-border flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:flex
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-dark-border">
          <div className="w-7 h-7 bg-rust-500 flex items-center justify-center">
            <Cog size={14} className="text-white" />
          </div>
          <div>
            <div className="font-display text-sm tracking-widest text-white">ADMIN</div>
            <div className="text-xs text-steel-500 font-mono">CMS Dashboard</div>
          </div>
          <button onClick={() => setSidebarOpen(false)}
                  className="ml-auto lg:hidden text-steel-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {icon}
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className="opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-rust-500 flex items-center justify-center text-white text-xs font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-white font-medium truncate">{admin?.name}</div>
              <div className="text-xs text-steel-500 truncate">{admin?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-steel-400
                       hover:text-rust-400 hover:bg-dark-border transition-colors rounded-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-steel-400 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="text-xs font-mono text-steel-500 ml-auto">
            Portfolio CMS &nbsp;|&nbsp; <span className="text-rust-400">Live</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
