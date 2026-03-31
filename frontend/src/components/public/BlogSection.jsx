import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '../shared/useInView';
import { publicAPI } from '../../utils/api';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const { ref, inView } = useInView(0.1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getBlogPosts()
      .then(({ data }) => setPosts(data.data?.slice(0, 3) || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-12">
            <p className="section-label mb-3">// thoughts</p>
            <h2 className="section-title">Engineering<br /><span className="text-rust-500">Blog</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? [1,2,3].map(i => (
              <div key={i} className="card-industrial pl-8 p-6 space-y-3">
                <div className="h-40 skeleton" />
                <div className="h-5 skeleton w-3/4" />
                <div className="h-3 skeleton w-full" />
                <div className="h-3 skeleton w-5/6" />
              </div>
            )) : posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-industrial pl-8 group hover:border-rust-500/40 transition-colors duration-300 flex flex-col"
              >
                {/* Cover image */}
                {post.coverImage?.url ? (
                  <div className="h-40 overflow-hidden">
                    <img src={post.coverImage.url} alt={post.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-40 bg-dark-bg border-b border-dark-border stripe-accent" />
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-steel-500 font-mono mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {post.views > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {post.views}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-lg text-white mb-2 group-hover:text-rust-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-steel-400 line-clamp-3 mb-4 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <Link to={`/blog/${post._id}`}
                        className="flex items-center gap-2 text-sm text-rust-400 hover:text-rust-300
                                   font-medium group-hover:gap-3 transition-all duration-200">
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
