import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
  Loader2, Image as ImageIcon, Upload
} from 'lucide-react';

const EMPTY_PROJECT = {
  title: '', problem: '', solution: '', techStack: [], impact: '',
  category: 'mechanical', featured: false, visible: true, githubUrl: '', liveUrl: '', images: [],
};

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl bg-dark-card border border-dark-border z-10 mb-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

function ProjectForm({ project, onSave, onClose }) {
  const [form, setForm] = useState(project || EMPTY_PROJECT);
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      set('techStack', [...(form.techStack || []), techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (i) => set('techStack', form.techStack.filter((_, idx) => idx !== i));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'projects');
      const { data } = await adminAPI.uploadImage(fd);
      set('images', [...(form.images || []), { url: data.data.url, publicId: data.data.publicId, caption: '' }]);
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project?._id) {
        await adminAPI.updateProject(project._id, form);
        toast.success('Project updated');
      } else {
        await adminAPI.createProject(form);
        toast.success('Project created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-5 border-b border-dark-border">
        <h2 className="font-heading text-lg text-white">{project?._id ? 'Edit Project' : 'New Project'}</h2>
        <button type="button" onClick={onClose} className="text-steel-400 hover:text-white"><X size={18} /></button>
      </div>

      <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Title & Category */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">TITLE *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
                   required className="form-input" placeholder="Project title" />
          </div>
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">CATEGORY</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="form-input">
              {['mechanical','software','mechatronics','other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">THE PROBLEM *</label>
          <textarea value={form.problem} onChange={e => set('problem', e.target.value)}
                    required rows={3} className="form-input resize-none" />
        </div>

        {/* Solution */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">THE SOLUTION *</label>
          <textarea value={form.solution} onChange={e => set('solution', e.target.value)}
                    required rows={3} className="form-input resize-none" />
        </div>

        {/* Impact */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">IMPACT</label>
          <textarea value={form.impact} onChange={e => set('impact', e.target.value)}
                    rows={2} className="form-input resize-none" />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">
            TECH STACK (press Enter to add)
          </label>
          <input value={techInput} onChange={e => setTechInput(e.target.value)}
                 onKeyDown={addTech} className="form-input mb-2"
                 placeholder="e.g. SolidWorks" />
          <div className="flex flex-wrap gap-2">
            {form.techStack?.map((t, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-dark-bg border border-dark-border
                                       text-xs text-steel-300 font-mono">
                {t}
                <button type="button" onClick={() => removeTech(i)} className="text-steel-500 hover:text-rust-400 ml-1">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* URLs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">GITHUB URL</label>
            <input value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)}
                   className="form-input" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">LIVE URL</label>
            <input value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)}
                   className="form-input" placeholder="https://..." />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">IMAGES</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images?.map((img, i) => (
              <div key={i} className="relative w-20 h-20 border border-dark-border overflow-hidden group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center
                                   opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} className="text-rust-400" />
                </button>
              </div>
            ))}
            <label className={`w-20 h-20 flex flex-col items-center justify-center border border-dashed
                              border-dark-border cursor-pointer hover:border-rust-500/50 transition-colors
                              text-steel-500 hover:text-steel-300 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <><Upload size={18} /><span className="text-xs mt-1">Upload</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Visible', key: 'visible' },
            { label: 'Featured', key: 'featured' },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${form[key] ? 'bg-rust-500' : 'bg-dark-border'}`}
                   onClick={() => set(key, !form[key])}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform
                                ${form[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-steel-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 p-5 border-t border-dark-border">
        <button type="button" onClick={onClose} className="btn-outline text-sm flex-1 justify-center">CANCEL</button>
        <button type="submit" disabled={loading} className="btn-primary text-sm flex-1 justify-center disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'SAVING...' : 'SAVE PROJECT'}
        </button>
      </div>
    </form>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    adminAPI.getAllProjects()
      .then(({ data }) => setProjects(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (p) => { setEditing(p); setModalOpen(true); };
  const handleNew  = () => { setEditing(null); setModalOpen(true); };
  const handleSave = () => { setModalOpen(false); load(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await adminAPI.deleteProject(id);
      toast.success('Project deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleProject(id);
      load();
    } catch { toast.error('Toggle failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-rust-500 tracking-widest mb-1">// content</p>
          <h1 className="text-2xl font-heading text-white">Projects</h1>
        </div>
        <button onClick={handleNew} className="btn-primary text-sm">
          <Plus size={16} /> NEW PROJECT
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 skeleton" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 bg-dark-card border p-4 transition-colors
                         ${p.visible ? 'border-dark-border' : 'border-dark-border opacity-60'}`}
            >
              {/* Thumb */}
              <div className="w-12 h-12 shrink-0 bg-dark-bg border border-dark-border overflow-hidden">
                {p.images?.[0]?.url
                  ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-steel-600" /></div>
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-white truncate">{p.title}</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-dark-bg border border-dark-border text-steel-500 font-mono shrink-0">
                    {p.category}
                  </span>
                  {p.featured && <span className="text-xs px-1.5 py-0.5 bg-rust-500/20 border border-rust-500/40 text-rust-400 shrink-0">featured</span>}
                </div>
                <p className="text-xs text-steel-500 line-clamp-1">{p.problem}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggle(p._id)}
                        className={`p-2 transition-colors ${p.visible ? 'text-green-400 hover:text-steel-400' : 'text-steel-600 hover:text-green-400'}`}
                        title={p.visible ? 'Hide' : 'Show'}>
                  {p.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => handleEdit(p)} className="p-2 text-steel-400 hover:text-white transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-2 text-steel-500 hover:text-rust-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-16 text-steel-500">
          No projects yet. <button onClick={handleNew} className="text-rust-400 hover:underline">Add one.</button>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <ProjectForm project={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
