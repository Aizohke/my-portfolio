import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../shared/useInView';
import { publicAPI } from '../../utils/api';

const CATEGORY_LABELS = {
  engineering: { label: 'Engineering & Fabrication', color: 'text-amber-400', border: 'border-amber-400/40' },
  software:    { label: 'Software & Digital',         color: 'text-green-400',  border: 'border-green-400/40' },
  strengths:   { label: 'Core Strengths',             color: 'text-blue-400',   border: 'border-blue-400/40' },
};

function SkillBar({ skill, inView }) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{skill.icon}</span>
          <span className="text-sm text-steel-200 font-medium">{skill.name}</span>
        </div>
        <span className="font-mono text-xs text-rust-500">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-dark-border rounded-none overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rust-500 to-rust-400"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  );
}

function SkillCategory({ category, skills, inView, index }) {
  const meta = CATEGORY_LABELS[category] || { label: category, color: 'text-steel-300', border: 'border-steel-600' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`bg-dark-card border ${meta.border} p-6`}
    >
      <h3 className={`font-display text-lg tracking-widest ${meta.color} mb-6`}>
        {meta.label.toUpperCase()}
      </h3>
      <div className="space-y-4">
        {skills.map(s => <SkillBar key={s._id || s.name} skill={s} inView={inView} />)}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { ref, inView } = useInView(0.1);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getSkills()
      .then(({ data }) => setGrouped(data.data || {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="skills" className="py-24 bg-dark-card relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 stripe-accent opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mb-12"
          >
            <p className="section-label mb-3">// toolkit</p>
            <h2 className="section-title">
              Skills &<br /><span className="text-rust-500">Capabilities</span>
            </h2>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-dark-bg border border-dark-border p-6 space-y-4">
                  <div className="h-5 skeleton w-1/2" />
                  {[1,2,3,4].map(j => <div key={j} className="h-8 skeleton" />)}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(grouped).map(([cat, skills], i) => (
                <SkillCategory key={cat} category={cat} skills={skills} inView={inView} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
