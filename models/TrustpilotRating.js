const mongoose = require('mongoose');

const trustpilotRatingSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  rating: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Add index for faster queries
trustpilotRatingSchema.index({ lastUpdated: 1 });

const TrustpilotRating = mongoose.model('TrustpilotRating', trustpilotRatingSchema);

module.exports = TrustpilotRating; 