const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Brand = require('../models/brandModel');

// List brands by type
router.get('/', async (req, res) => {
  const { type } = req.query; // car|bike optional
  const q = type ? { type } : {};
  const items = await Brand.find(q).sort({ name: 1 });
  res.json(items);
});

// Create brand
router.post('/', protect, admin, async (req, res) => {
  const { type, name, slug, logo, models } = req.body || {};
  if (!type || !name || !slug) {
    res.status(400);
    throw new Error('type, name, slug are required');
  }
  const created = await Brand.create({ type, name, slug: String(slug).toLowerCase(), logo, models: models || [] });
  res.status(201).json(created);
});

// Update brand
router.put('/:id', protect, admin, async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  if (payload.slug) payload.slug = String(payload.slug).toLowerCase();
  const updated = await Brand.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) { res.status(404); throw new Error('Brand not found'); }
  res.json(updated);
});

// Delete brand
router.delete('/:id', protect, admin, async (req, res) => {
  const { id } = req.params;
  const deleted = await Brand.findByIdAndDelete(id);
  if (!deleted) { res.status(404); throw new Error('Brand not found'); }
  res.json({ success: true });
});

module.exports = router;


