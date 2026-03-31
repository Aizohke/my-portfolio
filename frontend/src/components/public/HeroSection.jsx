import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Wrench, Code } from 'lucide-react';

const STATS = [
  { value: '3+', label: 'Engineering Projects' },
  { value: '2', label: 'Deployed Apps' },
  { value: '80+', label: 'Community Users' },
  { value: 'B.Eng', label: 'Final Year, TUK' },
];

export default function HeroSection({ settings = {} }) {
  const canvasRef = useRef(null);

  // Animated particle network on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
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
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192,57,43,0.5)';
        ctx.fill();
      });
      // Lines between close particles
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

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const name = settings.hero_name || 'Isaac Mathenge';
  const title = settings.hero_title || 'Mechanical Engineering Student | Full-Stack Developer | Mechatronics Enthusiast';
  const statement = settings.hero_statement || 'Bridging the gap between heavy machinery and smart automation through engineering design and full-stack development.';

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-grid">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Rust gradient accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rust-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rust-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Vertical text accent */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
        <div className="h-20 w-px bg-gradient-to-b from-transparent to-rust-500" />
        <span className="font-mono text-xs text-steel-500 tracking-[0.25em] rotate-90 whitespace-nowrap">
          B.ENG — TUK NAIROBI
        </span>
        <div className="h-20 w-px bg-gradient-to-t from-transparent to-rust-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
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
            <h1 className="font-display text-6xl sm:text-8xl lg:text-[120px] text-white leading-none tracking-wider mb-2">
              {name.split(' ')[0]}
            </h1>
            <h1 className="font-display text-6xl sm:text-8xl lg:text-[120px] leading-none tracking-wider mb-6"
                style={{ WebkitTextStroke: '1px rgba(192,57,43,0.6)', color: 'transparent' }}>
              {name.split(' ').slice(1).join(' ')}
            </h1>
          </motion.div>

          {/* Title chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {title.split(' | ').map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-dark-card border border-dark-border
                                       px-3 py-1 text-sm text-steel-200 font-medium">
                {i === 0 ? <Wrench size={13} className="text-rust-500" /> : <Code size={13} className="text-rust-500" />}
                {t}
              </span>
            ))}
          </motion.div>

          {/* Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-steel-300 max-w-2xl leading-relaxed mb-10 font-light border-l-2 border-rust-500 pl-4"
          >
            {statement}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <button onClick={scrollToProjects} className="btn-primary text-sm tracking-widest">
              VIEW PROJECTS
            </button>
            <button onClick={scrollToContact} className="btn-outline text-sm tracking-widest">
              CONTACT ME
            </button>
            <a href={settings.github_url || 'https://github.com/Aizohke'}
               target="_blank" rel="noreferrer"
               className="btn-outline text-sm tracking-widest">
              <Github size={16} /> GITHUB
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {STATS.map((s, i) => (
              <div key={i} className="bg-dark-card/60 border border-dark-border p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-rust-500/0 group-hover:bg-rust-500/5 transition-colors duration-300" />
                <div className="font-display text-3xl text-rust-500 tracking-wide">{s.value}</div>
                <div className="text-xs text-steel-400 mt-1 font-mono tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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
