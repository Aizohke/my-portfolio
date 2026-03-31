import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../../utils/api';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getBlogPost(id)
      .then(({ data }) => setPost(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-24 bg-dark-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-rust-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen pt-24 bg-dark-bg flex flex-col items-center justify-center gap-4">
      <p className="text-steel-400">Post not found.</p>
      <Link to="/" className="btn-primary text-sm">GO HOME</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/#blog"
              className="inline-flex items-center gap-2 text-sm text-steel-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {post.coverImage?.url && (
            <div className="aspect-video overflow-hidden mb-8 border border-dark-border">
              <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-steel-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {post.views > 0 && (
              <span className="flex items-center gap-1"><Eye size={12} /> {post.views} views</span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">{post.title}</h1>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-1 bg-dark-card border border-dark-border
                                         text-xs text-steel-400 font-mono">
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-rust max-w-none
                       prose-headings:font-heading prose-headings:text-white
                       prose-p:text-steel-300 prose-p:leading-relaxed
                       prose-a:text-rust-400 prose-strong:text-white
                       prose-h2:border-l-2 prose-h2:border-rust-500 prose-h2:pl-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>
      </div>
    </div>
  );
}
