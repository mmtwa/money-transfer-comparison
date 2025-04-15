// models/RateCache.js
const mongoose = require('mongoose');

const RateCacheSchema = new mongoose.Schema({
  fromCurrency: {
    type: String,
    required: true,
    trim: true
  },
  toCurrency: {
    type: String,
    required: true,
    trim: true
  },
  rates: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // TTL index: 1 hour
  }
});

// Compound index for faster lookups
RateCacheSchema.index({ fromCurrency: 1, toCurrency: 1, createdAt: -1 });

module.exports = mongoose.model('RateCache', RateCacheSchema);
