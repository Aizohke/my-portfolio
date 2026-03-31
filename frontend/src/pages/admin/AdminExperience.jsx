import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, Loader2, Calendar } from 'lucide-react';

const TYPES = ['work', 'project', 'education', 'volunteer'];
const EMPTY = {
  title: '', organization: '', type: 'work',
  startDate: '', endDate: '', description: '', highlights: [], visible: true, order: 0,
};

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-xl bg-dark-card border border-dark-border z-10 mb-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

function ExperienceForm({ exp, onSave, onClose }) {
  const [form, setForm] = useState(exp
    ? { ...exp, startDate: exp.startDate?.split('T')[0] || '', endDate: exp.endDate?.split('T')[0] || '' }
    : EMPTY);
  const [loading, setLoading] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addHighlight = (e) => {
    if (e.key === 'Enter' && highlightInput.trim()) {
      e.preventDefault();
      set('highlights', [...(form.highlights || []), highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, endDate: form.endDate || null };
      if (exp?._id) { await adminAPI.updateExperience(exp._id, payload); toast.success('Updated'); }
      else { await adminAPI.createExperience(payload); toast.success('Added'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-5 border-b border-dark-border">
        <h2 className="font-heading text-lg text-white">{exp?._id ? 'Edit Experience' : 'New Experience'}</h2>
        <button type="button" onClick={onClose} className="text-steel-400 hover:text-white"><X size={18} /></button>
      </div>

      <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">TITLE *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
                   required className="form-input" placeholder="Lead Developer" />
          </div>
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">ORGANIZATION *</label>
            <input value={form.organization} onChange={e => set('organization', e.target.value)}
                   required className="form-input" placeholder="Company / University" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">TYPE</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="form-input">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">START DATE *</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
                   required className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">END DATE</label>
            <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
                   className="form-input" placeholder="Leave blank if current" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">DESCRIPTION</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    rows={3} className="form-input resize-none" />
        </div>

        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">
            HIGHLIGHTS (Enter to add)
          </label>
          <input value={highlightInput} onChange={e => setHighlightInput(e.target.value)}
                 onKeyDown={addHighlight} className="form-input mb-2"
                 placeholder="Key achievement or responsibility..." />
          <div className="space-y-2">
            {form.highlights?.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-steel-300 bg-dark-bg border border-dark-border p-2">
                <span className="text-rust-500 mt-0.5 shrink-0">›</span>
                <span className="flex-1">{h}</span>
                <button type="button" onClick={() => set('highlights', form.highlights.filter((_, j) => j !== i))}
                        className="text-steel-500 hover:text-rust-400 shrink-0"><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>

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
          SAVE
        </button>
      </div>
    </form>
  );
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    adminAPI.getAllExperience()
      .then(({ data }) => setExperiences(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (e) => { setEditing(e); setModalOpen(true); };
  const handleNew  = () => { setEditing(null); setModalOpen(true); };
  const handleSave = () => { setModalOpen(false); load(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try { await adminAPI.deleteExperience(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const TYPE_COLORS = { work: 'text-rust-400', education: 'text-amber-400', project: 'text-green-400', volunteer: 'text-blue-400' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-rust-500 tracking-widest mb-1">// content</p>
          <h1 className="text-2xl font-heading text-white">Experience</h1>
        </div>
        <button onClick={handleNew} className="btn-primary text-sm"><Plus size={16} /> ADD ENTRY</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 skeleton" />)}</div>
      ) : (
        <div className="space-y-3">
          {experiences.map((e, i) => (
            <motion.div key={e._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`flex items-start gap-4 bg-dark-card border border-dark-border p-4 ${!e.visible ? 'opacity-60' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-sm font-medium text-white">{e.title}</h3>
                    <p className={`text-xs font-medium ${TYPE_COLORS[e.type]}`}>{e.organization}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-steel-500 font-mono whitespace-nowrap shrink-0">
                    <Calendar size={10} />
                    {new Date(e.startDate).getFullYear()} — {e.endDate ? new Date(e.endDate).getFullYear() : 'Present'}
                  </div>
                </div>
                <span className="inline-block text-xs px-1.5 py-0.5 bg-dark-bg border border-dark-border text-steel-500 font-mono capitalize">
                  {e.type}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <button onClick={() => handleEdit(e)} className="p-1.5 text-steel-400 hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(e._id)} className="p-1.5 text-steel-500 hover:text-rust-400"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && experiences.length === 0 && (
        <div className="text-center py-16 text-steel-500">
          No entries yet. <button onClick={handleNew} className="text-rust-400 hover:underline">Add one.</button>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <ExperienceForm exp={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
