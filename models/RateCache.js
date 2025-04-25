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

// Add a toJSON method to convert Map to regular object
RateCacheSchema.set('toJSON', {
  transform: function(doc, ret) {
    if (ret.rates instanceof Map) {
      ret.rates = Object.fromEntries(ret.rates);
    }
    return ret;
  }
});

// Add a toObject method to ensure correct serialization
RateCacheSchema.set('toObject', {
  transform: function(doc, ret) {
    if (ret.rates instanceof Map) {
      ret.rates = Object.fromEntries(ret.rates);
    }
    return ret;
  }
});

module.exports = mongoose.model('RateCache', RateCacheSchema);
