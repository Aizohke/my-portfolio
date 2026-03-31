const mongoose = require('mongoose');

// ─── Blog Post Model ────────────────────────────────────────────────────────
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  coverImage: { url: String, publicId: String },
  tags: [String],
  visible: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 200) + '...';
  }
  this.updatedAt = Date.now();
  next();
});

// ─── Skills Model ───────────────────────────────────────────────────────────
const SkillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['engineering', 'software', 'strengths'],
  },
  name: { type: String, required: true, trim: true },
  level: { type: Number, min: 0, max: 100, default: 80 }, // proficiency %
  icon: String, // icon name or emoji
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

// ─── Experience Model ───────────────────────────────────────────────────────
const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  type: {
    type: String,
    enum: ['work', 'project', 'education', 'volunteer'],
    default: 'project',
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null = present
  description: String,
  highlights: [String],
  logo: { url: String, publicId: String },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// ─── Site Settings Model ────────────────────────────────────────────────────
const SettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now },
});

SettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = {
  Blog: mongoose.model('Blog', BlogSchema),
  Skill: mongoose.model('Skill', SkillSchema),
  Experience: mongoose.model('Experience', ExperienceSchema),
  Settings: mongoose.model('Settings', SettingsSchema),
};
