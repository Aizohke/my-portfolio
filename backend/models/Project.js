const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  problem: { type: String, required: [true, 'Problem description required'] },
  solution: { type: String, required: [true, 'Solution description required'] },
  techStack: [{ type: String }],
  impact: { type: String },
  category: {
    type: String,
    enum: ['mechanical', 'software', 'mechatronics', 'other'],
    default: 'mechanical',
  },
  images: [{
    url: String,
    publicId: String, // Cloudinary public ID
    caption: String,
  }],
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  githubUrl: String,
  liveUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-generate slug from title
ProjectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
