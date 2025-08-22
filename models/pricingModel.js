const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema(
  {
    scope: { type: String, enum: ['service', 'brand', 'model'], required: true, index: true },
    refId: { type: String, required: true, index: true }, // serviceId or brandSlug or `${brandSlug}:${modelName}`
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingRule', pricingRuleSchema);


