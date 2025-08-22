const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fuels: [{ type: String, enum: ['petrol', 'diesel', 'cng'] }],
  },
  { _id: false }
);

const brandSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['car', 'bike'], required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, index: true, unique: true },
    logo: { type: String, default: '' },
    models: [modelSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);


