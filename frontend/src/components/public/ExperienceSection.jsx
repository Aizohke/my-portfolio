// ExperienceSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../shared/useInView';
import { publicAPI } from '../../utils/api';
import { Briefcase, GraduationCap, Rocket, Users, Calendar } from 'lucide-react';

const TYPE_ICONS = {
  work:      <Briefcase size={16} className="text-rust-500" />,
  education: <GraduationCap size={16} className="text-amber-400" />,
  project:   <Rocket size={16} className="text-green-400" />,
  volunteer: <Users size={16} className="text-blue-400" />,
};

function formatDate(d) {
  if (!d) return 'Present';
  return new Date(d).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
}

export function ExperienceSection() {
  const { ref, inView } = useInView(0.1);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getExperience()
      .then(({ data }) => setExperiences(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="experience" className="py-24 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-12">
            <p className="section-label mb-3">// journey</p>
            <h2 className="section-title">Experience &<br /><span className="text-rust-500">Education</span></h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-rust-500 via-dark-border to-transparent hidden md:block" />

            <div className="space-y-6">
              {loading ? [1,2,3].map(i => (
                <div key={i} className="md:pl-16 space-y-2">
                  <div className="h-5 skeleton w-1/3" />
                  <div className="h-4 skeleton w-1/4" />
                  <div className="h-20 skeleton w-full" />
                </div>
              )) : experiences.map((exp, i) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative md:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-3.5 top-4 w-5 h-5 bg-dark-bg border-2 border-rust-500
                                  items-center justify-center hidden md:flex">
                    {TYPE_ICONS[exp.type]}
                  </div>

                  <div className="card-industrial pl-8 p-6 hover:border-rust-500/40 transition-colors duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-heading text-lg text-white">{exp.title}</h3>
                        <p className="text-rust-400 font-medium text-sm">{exp.organization}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-steel-500 text-xs font-mono whitespace-nowrap">
                        <Calendar size={12} />
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-steel-400 mb-3 leading-relaxed">{exp.description}</p>
                    )}
                    {exp.highlights?.length > 0 && (
                      <ul className="space-y-1">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-steel-300">
                            <span className="text-rust-500 mt-1 shrink-0">›</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
