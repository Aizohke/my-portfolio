import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../shared/useInView';
import { publicAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Send, Github, Linkedin, Mail, MapPin, Loader2 } from 'lucide-react';

export default function ContactSection({ settings = {} }) {
  const { ref, inView } = useInView(0.1);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicAPI.sendContact(form);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label mb-3">// get in touch</p>
            <h2 className="section-title mb-6">
              Let's Build<br /><span className="text-rust-500">Something</span>
            </h2>
            <p className="text-steel-300 leading-relaxed mb-8">
              Whether it's a collaboration, engineering consultancy, full-stack project,
              or just a conversation about mechatronics — I'd love to hear from you.
            </p>

            <div className="space-y-4 mb-8">
              <a href={`mailto:${settings.email || 'mathengeisaac04@gmail.com'}`}
                 className="flex items-center gap-3 text-steel-300 hover:text-white group">
                <div className="w-10 h-10 bg-dark-card border border-dark-border flex items-center justify-center
                                group-hover:border-rust-500 transition-colors">
                  <Mail size={16} className="text-rust-500" />
                </div>
                <span className="text-sm">{settings.email || 'mathengeisaac04@gmail.com'}</span>
              </a>
              <div className="flex items-center gap-3 text-steel-300">
                <div className="w-10 h-10 bg-dark-card border border-dark-border flex items-center justify-center">
                  <MapPin size={16} className="text-rust-500" />
                </div>
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { Icon: Github,   href: settings.github_url   || '#', label: 'GitHub' },
                { Icon: Linkedin, href: settings.linkedin_url || '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                   className="flex items-center gap-2 px-4 py-2.5 bg-dark-card border border-dark-border
                              text-sm text-steel-300 hover:text-white hover:border-rust-500/50 transition-colors">
                  <Icon size={16} /> {label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-steel-400 font-mono mb-1.5 tracking-wide">NAME *</label>
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    required placeholder="Your name"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-steel-400 font-mono mb-1.5 tracking-wide">EMAIL *</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    required placeholder="your@email.com"
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-steel-400 font-mono mb-1.5 tracking-wide">SUBJECT</label>
                <input
                  name="subject" value={form.subject} onChange={handleChange}
                  placeholder="What's this about?"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-xs text-steel-400 font-mono mb-1.5 tracking-wide">MESSAGE *</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  required rows={5} placeholder="Tell me about your project or idea..."
                  className="form-input resize-none"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full justify-center text-sm tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> SENDING...</> : <><Send size={16} /> SEND MESSAGE</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
