import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog',       href: '#blog' },
  { label: 'Contact',    href: '#contact' },
];

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* ── Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-bg/95 backdrop-blur-md border-b border-dark-border shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-rust-500 flex items-center justify-center font-display text-white text-sm">
                IM
              </div>
              <span className="font-display text-xl tracking-widest text-white hidden sm:block">
                ISAAC MATHENGE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className="px-4 py-2 text-sm font-medium text-steel-300 hover:text-white
                             hover:bg-dark-border transition-colors duration-150 tracking-wide"
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-steel-300 hover:text-white transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-card border-b border-dark-border overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <button
                    key={label}
                    onClick={() => handleNavClick(href)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-steel-300
                               hover:text-white hover:bg-dark-border transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page Content ── */}
      <main>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-dark-card border-t border-dark-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-display text-2xl tracking-widest text-white mb-1">ISAAC MATHENGE</div>
              <p className="text-sm text-steel-400">Mechanical Engineering | Full-Stack Development</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/isaacmathenge" target="_blank" rel="noreferrer"
                 className="p-2 text-steel-400 hover:text-white hover:bg-dark-border transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/isaacmathenge" target="_blank" rel="noreferrer"
                 className="p-2 text-steel-400 hover:text-white hover:bg-dark-border transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:isaacmathenge@example.com"
                 className="p-2 text-steel-400 hover:text-white hover:bg-dark-border transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-dark-border text-center text-xs text-steel-600">
            © {new Date().getFullYear()} Isaac Mathenge. Built with React + Node.js.
          </div>
        </div>
      </footer>
    </div>
  );
}
