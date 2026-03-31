// ─── blog.js ────────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const { Blog } = require('../models/Content');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find({ visible: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const post = await Blog.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: post });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

module.exports = router;
