import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../../utils/api';
import { ArrowLeft, Github, ExternalLink, Wrench, Target, Lightbulb, TrendingUp } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    publicAPI.getProject(id)
      .then(({ data }) => setProject(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-24 bg-dark-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-rust-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-24 bg-dark-bg flex flex-col items-center justify-center gap-4">
      <p className="text-steel-400">Project not found.</p>
      <Link to="/" className="btn-primary text-sm">GO HOME</Link>
    </div>
  );

  const sections = [
    { icon: <Target size={18} className="text-rust-500" />, label: 'The Problem', content: project.problem },
    { icon: <Lightbulb size={18} className="text-amber-400" />, label: 'The Solution', content: project.solution },
    { icon: <TrendingUp size={18} className="text-green-400" />, label: 'Impact', content: project.impact },
  ];

  return (
    <div className="min-h-screen pt-20 bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link to="/#projects"
              className="inline-flex items-center gap-2 text-sm text-steel-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <span className="font-mono text-xs text-rust-500 tracking-widest uppercase">{project.category}</span>
            <h1 className="font-heading text-4xl md:text-5xl text-white mt-2 mb-4">{project.title}</h1>

            <div className="flex flex-wrap gap-2">
              {project.techStack?.map(t => (
                <span key={t} className="px-3 py-1 bg-dark-card border border-dark-border text-xs text-steel-300 font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Image gallery */}
          {project.images?.length > 0 && (
            <div className="mb-8">
              <div className="aspect-video overflow-hidden bg-dark-card border border-dark-border mb-2">
                <img src={project.images[activeImg]?.url} alt={project.title}
                     className="w-full h-full object-cover" />
              </div>
              {project.images.length > 1 && (
                <div className="flex gap-2">
                  {project.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                            className={`w-16 h-16 overflow-hidden border-2 transition-colors ${
                              activeImg === i ? 'border-rust-500' : 'border-dark-border'
                            }`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content sections */}
          <div className="space-y-6 mb-8">
            {sections.filter(s => s.content).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-industrial pl-8 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  {s.icon}
                  <h2 className="font-display tracking-widest text-sm text-white">{s.label.toUpperCase()}</h2>
                </div>
                <p className="text-steel-300 leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Links */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-outline text-sm">
                  <Github size={16} /> VIEW CODE
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                  <ExternalLink size={16} /> LIVE DEMO
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
