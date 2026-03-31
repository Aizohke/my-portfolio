const express = require('express');
const router = express.Router();
const { Experience } = require('../models/Content');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find({ visible: true }).sort({ startDate: -1 });
    res.json({ success: true, data: experiences });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json({ success: true, data: experiences });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: experience });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

module.exports = router;
