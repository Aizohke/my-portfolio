// settings.js
const express = require('express');
const router = express.Router();
const { Settings } = require('../models/Content');
const { protect } = require('../middleware/auth');

// Get all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const obj = settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {});
    res.json({ success: true, data: obj });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// Upsert setting (admin only)
router.put('/:key', protect, async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// Bulk update settings (admin only)
router.post('/bulk', protect, async (req, res) => {
  try {
    const { settings } = req.body; // { key: value, ... }
    const ops = Object.entries(settings).map(([key, value]) => ({
      updateOne: { filter: { key }, update: { value }, upsert: true }
    }));
    await Settings.bulkWrite(ops);
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

module.exports = router;
