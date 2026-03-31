import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

const CATEGORIES = ['engineering', 'software', 'strengths'];
const EMPTY_SKILL = { name: '', category: 'engineering', level: 80, icon: '⚙️', visible: true, order: 0 };

function SkillForm({ skill, onSave, onClose }) {
  const [form, setForm] = useState(skill || EMPTY_SKILL);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skill?._id) { await adminAPI.updateSkill(skill._id, form); toast.success('Skill updated'); }
      else { await adminAPI.createSkill(form); toast.success('Skill added'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border p-5 space-y-4 w-full max-w-sm">
      <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
        <h3 className="font-heading text-white">{skill?._id ? 'Edit Skill' : 'New Skill'}</h3>
        <button type="button" onClick={onClose} className="text-steel-400 hover:text-white"><X size={16} /></button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">SKILL NAME *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
                 required className="form-input" placeholder="e.g. SolidWorks CAD" />
        </div>
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">CATEGORY</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className="form-input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">ICON (emoji)</label>
          <input value={form.icon} onChange={e => set('icon', e.target.value)}
                 className="form-input text-center text-lg" placeholder="⚙️" maxLength={4} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">
            PROFICIENCY: <span className="text-rust-400">{form.level}%</span>
          </label>
          <input type="range" min="0" max="100" value={form.level}
                 onChange={e => set('level', parseInt(e.target.value))}
                 className="w-full accent-rust-500" />
        </div>
        <div>
          <label className="block text-xs font-mono text-steel-400 tracking-widest mb-1.5">ORDER</label>
          <input type="number" value={form.order} onChange={e => set('order', parseInt(e.target.value))}
                 className="form-input" />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-9 h-5 rounded-full transition-colors relative ${form.visible ? 'bg-rust-500' : 'bg-dark-border'}`}
                 onClick={() => set('visible', !form.visible)}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.visible ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-steel-300">Visible</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-outline text-xs flex-1 justify-center py-2">CANCEL</button>
        <button type="submit" disabled={loading} className="btn-primary text-xs flex-1 justify-center py-2 disabled:opacity-60">
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          SAVE
        </button>
      </div>
    </form>
  );
}

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeCategory, setActiveCategory] = useState('engineering');

  const load = () => {
    setLoading(true);
    adminAPI.getAllSkills()
      .then(({ data }) => setSkills(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (s) => { setEditing(s); setShowForm(true); };
  const handleNew  = () => { setEditing(null); setShowForm(true); };
  const handleSave = () => { setShowForm(false); load(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete skill?')) return;
    try { await adminAPI.deleteSkill(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = skills.filter(s => s.category === activeCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-rust-500 tracking-widest mb-1">// content</p>
          <h1 className="text-2xl font-heading text-white">Skills</h1>
        </div>
        <button onClick={handleNew} className="btn-primary text-sm"><Plus size={16} /> ADD SKILL</button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 font-mono text-xs tracking-widest border transition-colors ${
                    activeCategory === cat
                      ? 'bg-rust-500 border-rust-500 text-white'
                      : 'border-dark-border text-steel-400 hover:border-rust-500/50'
                  }`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills list */}
        <div className="space-y-2">
          {loading ? [1,2,3,4].map(i => <div key={i} className="h-16 skeleton" />) :
           filtered.length === 0 ? (
             <p className="text-steel-500 text-sm py-8 text-center">No skills in this category yet.</p>
           ) : filtered.map((s, i) => (
            <motion.div key={s._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 bg-dark-card border border-dark-border p-3 ${!s.visible ? 'opacity-60' : ''}`}>
              <span className="text-xl w-8 text-center">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white font-medium">{s.name}</span>
                  <span className="font-mono text-xs text-rust-400">{s.level}%</span>
                </div>
                <div className="h-1 bg-dark-border">
                  <div className="h-full bg-rust-500" style={{ width: `${s.level}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(s)} className="p-1.5 text-steel-400 hover:text-white"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(s._id)} className="p-1.5 text-steel-500 hover:text-rust-400"><Trash2 size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form panel */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <SkillForm skill={editing} onSave={handleSave} onClose={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
