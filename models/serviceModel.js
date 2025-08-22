const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🔧' },
    price: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 60 },
    isActive: { type: Boolean, default: true },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);


