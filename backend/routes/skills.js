const express = require('express');
const router = express.Router();
const { Skill } = require('../models/Content');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ visible: true }).sort({ order: 1 });
    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
    res.json({ success: true, data: grouped });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json({ success: true, data: skills });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: skill });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

module.exports = router;
