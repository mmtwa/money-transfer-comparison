const mongoose = require('mongoose');

const WiseCacheSchema = new mongoose.Schema({
  sourceCurrency: {
    type: String,
    required: true,
    trim: true
  },
  targetCurrency: {
    type: String,
    required: true,
    trim: true
  },
  sendAmount: {
    type: Number,
    required: true
  },
  providers: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120 // TTL index: 2 minutes
  }
});

// Compound index for faster lookups
WiseCacheSchema.index({ sourceCurrency: 1, targetCurrency: 1, sendAmount: 1, createdAt: -1 });

module.exports = mongoose.model('WiseCache', WiseCacheSchema); 