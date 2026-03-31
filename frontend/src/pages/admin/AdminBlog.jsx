import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Calendar, Upload } from 'lucide-react';

const EMPTY_POST = { title: '', content: '', excerpt: '', tags: [], visible: true, coverImage: null };

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-3xl bg-dark-card border border-dark-border z-10 mb-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

function BlogForm({ post, onSave, onClose }) {
  const [form, setForm] = useState(post || EMPTY_POST);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      set('tags', [...(form.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'blog');
      const { data } = await adminAPI.uploadImage(fd);
      set('coverImage', { url: data.data.url, publicId: data.data.publicId });
      toast.success('Cover uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (post?._id) {
        await adminAPI.updatePost(post._id, form);
        toast.success('Post updated');
      } else {
        await adminAPI.createPost(form);
        toast.success('Post created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-5 border-b border-dark-border">
        <h2 className="font-heading text-lg text-white">{post?._id ? 'Edit Post' : 'New Blog Post'}</h2>
        <button type="button" onClick={onClose} className="text-steel-400 hover:text-white"><X size={18} /></button>
      </div>

      <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">TITLE *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
                 required className="form-input" placeholder="Post title" />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">EXCERPT</label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                    rows={2} className="form-input resize-none"
                    placeholder="Short summary (auto-generated if left empty)" />
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">COVER IMAGE</label>
          {form.coverImage?.url && (
            <div className="relative h-32 mb-2 border border-dark-border overflow-hidden">
              <img src={form.coverImage.url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => set('coverImage', null)}
                      className="absolute top-2 right-2 p-1 bg-black/70 text-rust-400 hover:text-rust-300">
                <X size={14} />
              </button>
            </div>
          )}
          <label className={`flex items-center gap-2 px-4 py-2 border border-dashed border-dark-border
                            cursor-pointer hover:border-rust-500/50 text-sm text-steel-400 hover:text-steel-200
                            transition-colors w-fit ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : 'Upload Cover'}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        </div>

        {/* Content — simple textarea; swap for ReactQuill if installed */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">
            CONTENT * <span className="text-steel-600">(HTML supported)</span>
          </label>
          <textarea value={form.content} onChange={e => set('content', e.target.value)}
                    required rows={12} className="form-input resize-y font-mono text-sm"
                    placeholder="<p>Your article content here...</p>" />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">TAGS (Enter to add)</label>
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                 onKeyDown={addTag} className="form-input mb-2" placeholder="engineering, fabrication..." />
          <div className="flex flex-wrap gap-2">
            {form.tags?.map((t, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-dark-bg border border-dark-border text-xs text-steel-300 font-mono">
                {t}
                <button type="button" onClick={() => set('tags', form.tags.filter((_, j) => j !== i))}
                        className="text-steel-500 hover:text-rust-400 ml-1"><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <label className="flex items-center gap-2 cursor-pointer">
          <div className={`w-9 h-5 rounded-full transition-colors relative ${form.visible ? 'bg-rust-500' : 'bg-dark-border'}`}
               onClick={() => set('visible', !form.visible)}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.visible ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm text-steel-300">Visible to public</span>
        </label>
      </div>

      <div className="flex gap-3 p-5 border-t border-dark-border">
        <button type="button" onClick={onClose} className="btn-outline text-sm flex-1 justify-center">CANCEL</button>
        <button type="submit" disabled={loading} className="btn-primary text-sm flex-1 justify-center disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'SAVING...' : 'SAVE POST'}
        </button>
      </div>
    </form>
  );
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    adminAPI.getAllPosts()
      .then(({ data }) => setPosts(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (p) => { setEditing(p); setModalOpen(true); };
  const handleNew  = () => { setEditing(null); setModalOpen(true); };
  const handleSave = () => { setModalOpen(false); load(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try { await adminAPI.deletePost(id); toast.success('Post deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-rust-500 tracking-widest mb-1">// content</p>
          <h1 className="text-2xl font-heading text-white">Blog Posts</h1>
        </div>
        <button onClick={handleNew} className="btn-primary text-sm"><Plus size={16} /> NEW POST</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 skeleton" />)}</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p, i) => (
            <motion.div key={p._id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 bg-dark-card border p-4 ${!p.visible ? 'opacity-60' : 'border-dark-border'}`}>
              {/* Cover thumb */}
              <div className="w-16 h-12 shrink-0 bg-dark-bg border border-dark-border overflow-hidden">
                {p.coverImage?.url
                  ? <img src={p.coverImage.url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full stripe-accent" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-medium text-white truncate">{p.title}</h3>
                  {!p.visible && <span className="text-xs px-1.5 py-0.5 bg-dark-bg border border-dark-border text-steel-500 shrink-0">hidden</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-steel-500 font-mono">
                  <span className="flex items-center gap-1"><Calendar size={10} />{new Date(p.createdAt).toLocaleDateString()}</span>
                  <span>{p.views} views</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(p)} className="p-2 text-steel-400 hover:text-white transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-2 text-steel-500 hover:text-rust-400 transition-colors"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-steel-500">
          No posts yet. <button onClick={handleNew} className="text-rust-400 hover:underline">Write one.</button>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <BlogForm post={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
