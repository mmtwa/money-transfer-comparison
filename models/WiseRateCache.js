const mongoose = require('mongoose');

const WiseRateCacheSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['current', 'historical', 'historical_range']
  },
  timeKey: {
    type: String,
    default: null
  },
  rate: {
    type: Object,
    default: null
  },
  rates: {
    type: [Object],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete documents after 24 hours
  }
});

// Create compound index for faster queries
WiseRateCacheSchema.index({ source: 1, target: 1, type: 1, timeKey: 1 });

const WiseRateCache = mongoose.model('WiseRateCache', WiseRateCacheSchema);

module.exports = WiseRateCache; 