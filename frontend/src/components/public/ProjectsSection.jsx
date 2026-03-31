import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '../shared/useInView';
import { publicAPI } from '../../utils/api';
import { Wrench, Code, Cpu, ArrowRight, Image as ImageIcon } from 'lucide-react';

const CATEGORY_ICONS = {
  mechanical:   <Wrench size={14} />,
  software:     <Code size={14} />,
  mechatronics: <Cpu size={14} />,
  other:        <Wrench size={14} />,
};

const CATEGORY_COLORS = {
  mechanical:   'text-amber-400 bg-amber-400/10 border-amber-400/30',
  software:     'text-green-400 bg-green-400/10 border-green-400/30',
  mechatronics: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  other:        'text-steel-300 bg-steel-300/10 border-steel-300/30',
};

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView(0.15);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="card-industrial pl-8 group flex flex-col h-full hover:border-rust-500/40 transition-colors duration-300"
    >
      {/* Image / placeholder */}
      <div className="relative h-48 overflow-hidden bg-dark-bg border-b border-dark-border">
        {project.images?.[0]?.url ? (
          <img
            src={project.images[0].url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center stripe-accent">
            <ImageIcon size={32} className="text-dark-border" />
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs border font-mono ${CATEGORY_COLORS[project.category]}`}>
          {CATEGORY_ICONS[project.category]} {project.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading text-xl text-white mb-3 group-hover:text-rust-400 transition-colors">
          {project.title}
        </h3>

        {/* Problem */}
        <div className="mb-3">
          <span className="font-mono text-xs text-rust-500 tracking-widest">THE PROBLEM</span>
          <p className="text-sm text-steel-400 mt-1 line-clamp-2">{project.problem}</p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-dark-bg border border-dark-border
                                        text-xs text-steel-400 font-mono">
              {tech}
            </span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="px-2 py-0.5 text-xs text-steel-600 font-mono">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Impact */}
        {project.impact && (
          <div className="mt-auto pt-3 border-t border-dark-border">
            <span className="font-mono text-xs text-rust-500 tracking-widest">IMPACT</span>
            <p className="text-xs text-steel-300 mt-1 line-clamp-1">{project.impact}</p>
          </div>
        )}

        {/* View detail */}
        <Link
          to={`/projects/${project._id}`}
          className="mt-4 flex items-center gap-2 text-sm text-rust-400 hover:text-rust-300
                     font-medium group-hover:gap-3 transition-all duration-200"
        >
          View Case Study <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="card-industrial pl-8">
      <div className="h-48 skeleton" />
      <div className="p-6 space-y-3">
        <div className="h-5 skeleton w-3/4" />
        <div className="h-3 skeleton w-full" />
        <div className="h-3 skeleton w-5/6" />
        <div className="flex gap-2 mt-2">
          {[1,2,3].map(i => <div key={i} className="h-5 w-16 skeleton" />)}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { ref, inView } = useInView(0.1);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    publicAPI.getProjects()
      .then(({ data }) => setProjects(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-dark-bg relative">
      {/* Section header */}
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="section-label mb-3">// featured work</p>
            <h2 className="section-title">
              Engineering<br /><span className="text-rust-500">Projects</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 font-mono text-xs tracking-widest border transition-colors ${
                  filter === cat
                    ? 'bg-rust-500 border-rust-500 text-white'
                    : 'border-dark-border text-steel-400 hover:border-rust-500/50 hover:text-white'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [1,2,3].map(i => <SkeletonCard key={i} />)
            : filtered.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-steel-500">No projects found.</div>
        )}
      </div>
    </section>
  );
}
