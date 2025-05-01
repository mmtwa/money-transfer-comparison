const mongoose = require('mongoose');

const ProviderRatingSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  placeId: {
    type: String,
    required: true,
    trim: true
  },
  googleRating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  reviewCount: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProviderRating', ProviderRatingSchema); 