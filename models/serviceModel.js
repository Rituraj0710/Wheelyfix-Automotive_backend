// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     description: { type: String, default: '' },
//     icon: { type: String, default: '🔧' },
//     price: { type: Number, default: 0 },
//     durationMinutes: { type: Number, default: 60 },
//     isActive: { type: Boolean, default: true },
//     category: { type: String, default: 'General' },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Service', serviceSchema);


const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    howItWorks: { type: String, required: true },
    image: { type: String }, // URL or path
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
