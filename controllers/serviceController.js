const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// Create
exports.createService = asyncHandler(async (req, res) => {
  const { name, description, icon, price, durationMinutes, isActive, category } = req.body || {};
  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }
  const created = await Service.create({ name, description, icon, price, durationMinutes, isActive, category });
  res.status(201).json(created);
});

// List
exports.listServices = asyncHandler(async (_req, res) => {
  const items = await Service.find({}).sort({ createdAt: -1 });
  res.json(items);
});

// Update
exports.updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  const item = await Service.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!item) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json(item);
});

// Delete
exports.deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Service.findByIdAndDelete(id);
  if (!item) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true });
});


