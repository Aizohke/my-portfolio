import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../shared/useInView';
import { Cog, Monitor, Award } from 'lucide-react';

const PILLARS = [
  {
    icon: <Cog size={22} className="text-rust-500" />,
    title: 'Engineering Excellence',
    desc: 'From mechanical systems and electronics integration to automation of systems using Arduino based control — built on a foundation of mechanical principles.'
  },
  {
    icon: <Monitor size={22} className="text-rust-500" />,
    title: 'Full-Stack Fluency',
    desc: 'MERN stack development from database schema to deployed production apps.'
  },
  {
    icon: <Award size={22} className="text-rust-500" />,
    title: 'Community Impact',
    desc: 'Engineering work that serves real people — from Nairobi youth groups to rural health clinics.'
  },
];

export default function AboutSection({ settings = {} }) {
  const { ref, inView } = useInView(0.2);
  const text = settings.about_text ||
    "Currently finishing my B.Eng Mechanical Engineering at the Technical University of Kenya, I thrive at the intersection of fabrication and software. Whether I'm creating a design in SolidWorks, fabricating, or building a full-stack web app from scratch, I'm driven by one question: how can engineering create lasting change?\n\nMy journey has taken me from the workshop floor — welding frames, operating lathes, and testing hydraulic systems — to writing production code for community organisations. That dual fluency is my superpower.";

  return (
    <section id="about" className="py-24 bg-dark-card relative overflow-hidden">
      {/* Stripe accent */}
      <div className="absolute right-0 top-0 bottom-0 w-32 stripe-accent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label mb-3">// about me</p>
            <h2 className="section-title mb-6">
              Engineer by training.<br />
              <span className="text-rust-500">Builder by nature.</span>
            </h2>
            <div className="space-y-4 text-steel-300 leading-relaxed">
              {text.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['B.Eng Mechanical Engineering', 'TUK, Nairobi', 'Final Year 2026'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-dark-bg border border-dark-border
                                          text-sm text-steel-300 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Pillars */}
          <div className="space-y-4">
            {PILLARS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card-industrial p-5 pl-8 group hover:border-rust-500/40 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 p-2 bg-dark-bg border border-dark-border group-hover:border-rust-500/40 transition-colors">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-white mb-1">{p.title}</h3>
                    <p className="text-sm text-steel-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Blueprint-style decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="border border-dashed border-dark-border p-4 mt-4"
            >
              <div className="flex items-center gap-3 text-steel-600 font-mono text-xs">
                <span className="text-rust-500/60">REV:</span> 5.2 &nbsp;|&nbsp;
                <span className="text-rust-500/60">DATE:</span> 2026 &nbsp;|&nbsp;
                <span className="text-rust-500/60">DRAWN BY:</span> I. MATHENGE &nbsp;|&nbsp;
                <span className="text-rust-500/60">INSTITUTION:</span> TUK
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
