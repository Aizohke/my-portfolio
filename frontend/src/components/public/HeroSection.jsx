import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Wrench, Code, MapPin } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 👇 REPLACE THIS with the path to your photo.
//    Options:
//    A) Put your photo in frontend/public/ as "isaac.jpg" → use "/isaac.jpg"
//    B) Put it in frontend/src/ → import isaacPhoto from '../assets/isaac.jpg'
//       and replace PHOTO_SRC with isaacPhoto
// ─────────────────────────────────────────────────────────────────────────────
const PHOTO_SRC = '/isaac.jpeg';   // ← change this to your image path

const STATS = [
  { value: '3+', label: 'Engineering Projects' },
  { value: '2',  label: 'Deployed Apps' },
  { value: '80+', label: 'Community Users' },
  { value: 'B.Eng', label: 'Final Year, TUK' },
];

export default function HeroSection({ settings = {} }) {
  const canvasRef = useRef(null);

  // Animated particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192,57,43,0.5)';
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(192,57,43,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact  = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });

  const name      = settings.hero_name      || 'Isaac Mathenge';
  const title     = settings.hero_title     || 'Mechanical Engineering Student | Full-Stack Developer | Mechatronics Enthusiast';
  const statement = settings.hero_statement || 'Bridging the gap between heavy machinery and smart automation through engineering design and full-stack development.';

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-grid">

      {/* ── Canvas background ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* ── Ambient glow accents ── */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-rust-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rust-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* ── Main two-column grid ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ══ LEFT COLUMN — Text content ══════════════════════════════════ */}
          <div>
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 bg-rust-500/10 border border-rust-500/30 px-3 py-1.5">
                <div className="w-2 h-2 bg-rust-500 rounded-full animate-pulse" />
                <span className="font-mono text-xs text-rust-400 tracking-widest">AVAILABLE FOR OPPORTUNITIES</span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-6xl sm:text-7xl xl:text-8xl text-white leading-none tracking-wider mb-1">
                {name.split(' ')[0]}
              </h1>
              <h1
                className="font-display text-6xl sm:text-7xl xl:text-8xl leading-none tracking-wider mb-6"
                style={{ WebkitTextStroke: '1px rgba(192,57,43,0.7)', color: 'transparent' }}
              >
                {name.split(' ').slice(1).join(' ')}
              </h1>
            </motion.div>

            {/* Role chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {title.split(' | ').map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-dark-card border border-dark-border
                                         px-3 py-1 text-sm text-steel-200 font-medium">
                  {i === 0
                    ? <Wrench size={13} className="text-rust-500" />
                    : <Code   size={13} className="text-rust-500" />}
                  {t}
                </span>
              ))}
            </motion.div>

            {/* Statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-steel-300 leading-relaxed mb-10 font-light border-l-2 border-rust-500 pl-4"
            >
              {statement}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <button onClick={scrollToProjects} className="btn-primary text-sm tracking-widest">
                VIEW PROJECTS
              </button>
              <button onClick={scrollToContact} className="btn-outline text-sm tracking-widest">
                CONTACT ME
              </button>
              <a
                href={settings.github_url || 'https://github.com/Aizohke'}
                target="_blank" rel="noreferrer"
                className="btn-outline text-sm tracking-widest"
              >
                <Github size={16} /> GITHUB
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {STATS.map((s, i) => (
                <div key={i} className="bg-dark-card/60 border border-dark-border p-3 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-rust-500/0 group-hover:bg-rust-500/5 transition-colors duration-300" />
                  <div className="font-display text-2xl text-rust-500 tracking-wide">{s.value}</div>
                  <div className="text-xs text-steel-400 mt-0.5 font-mono tracking-wide leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══ RIGHT COLUMN — Photo ═════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-sm xl:max-w-md">

              {/* ── Outer decorative frame ── */}
              {/* Top-right corner bracket */}
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-rust-500 z-10" />
              {/* Bottom-left corner bracket */}
              <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-rust-500 z-10" />

              {/* ── Blueprint grid overlay card ── */}
              <div className="absolute -top-5 -left-5 w-full h-full border border-dark-border hero-grid opacity-60" />

              {/* ── Rust accent bar on left edge ── */}
              <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-transparent via-rust-500 to-transparent z-10" />

              {/* ── Photo container ── */}
              <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}>

                {/* Dark tint overlay — fades from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-transparent to-transparent z-10 pointer-events-none" />

                {/* Side scan-line effect */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
                  }}
                />

                {/* ── The actual photo ── */}
                <img
                  src={PHOTO_SRC}
                  alt={name}
                  className="w-full h-auto object-cover object-top grayscale contrast-110 brightness-90
                             transition-all duration-700 hover:grayscale-0 hover:brightness-100"
                  style={{ filter: 'grayscale(30%) contrast(1.05) brightness(0.92)' }}
                  onError={e => {
                    // Fallback placeholder if photo not found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />

                {/* ── Fallback placeholder (shown if image fails to load) ── */}
                <div
                  className="w-full aspect-[3/4] bg-dark-card items-center justify-center flex-col gap-3
                             border border-dark-border"
                  style={{ display: 'none' }}
                >
                  <div className="w-20 h-20 bg-rust-500/20 border border-rust-500/40 flex items-center justify-center">
                    <span className="font-display text-3xl text-rust-500">IM</span>
                  </div>
                  <p className="font-mono text-xs text-steel-500 text-center px-4">
                    Add your photo to<br />
                    <span className="text-rust-400">frontend/public/isaac.jpg</span>
                  </p>
                </div>
              </div>

              {/* ── Name tag overlay at bottom of photo ── */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <div className="bg-dark-bg/80 backdrop-blur-sm border border-dark-border px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-rust-400 tracking-widest mb-0.5">// ENGINEER</p>
                      <p className="font-display text-lg text-white tracking-wider">{name.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-1 text-steel-500 text-xs font-mono">
                      <MapPin size={10} className="text-rust-500" />
                      NBI, KE
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Floating spec badge (top-right of photo) ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="absolute -top-4 -right-4 z-20 bg-dark-card border border-rust-500/40 px-3 py-2 shadow-lg"
              >
                <p className="font-mono text-xs text-rust-400 tracking-widest">B.ENG</p>
                <p className="font-display text-sm text-white tracking-wide">MECH. ENG</p>
                <p className="font-mono text-xs text-steel-500">TUK · 2024</p>
              </motion.div>

            </div>
          </motion.div>
          {/* ══ End right column ════════════════════════════════════════════ */}

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-steel-500"
      >
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ArrowDown size={16} className="text-rust-500" />
        </motion.div>
      </motion.div>

    </section>
  );
}
