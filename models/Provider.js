
const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide provider name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  code: {
    type: String,
    required: [true, 'Please provide provider code'],
    unique: true,
    trim: true,
    maxlength: [20, 'Code can not be more than 20 characters']
  },
  logo: {
    type: String,
    required: [true, 'Please provide logo URL']
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  baseUrl: {
    type: String,
    required: [true, 'Please provide API base URL']
  },
  apiKey: {
    type: String,
    required: [true, 'Please provide API key'],
    select: false
  },
  apiSecret: {
    type: String,
    required: false,
    select: false
  },
  transferFeeStructure: {
    type: {
      type: String,
      enum: ['flat', 'percentage'],
      required: [true, 'Please specify fee structure type']
    },
    amount: {
      type: Number,
      required: function() {
        return this.transferFeeStructure.type === 'flat';
      }
    },
    percentage: {
      type: Number,
      required: function() {
        return this.transferFeeStructure.type === 'percentage';
      }
    },
    minimum: {
      type: Number,
      required: function() {
        return this.transferFeeStructure.type === 'percentage';
      }
    },
    maximum: {
      type: Number,
      required: false
    }
  },
  exchangeRateMargin: {
    type: Number,
    required: [true, 'Please provide exchange rate margin']
  },
  transferTimeHours: {
    min: {
      type: Number,
      required: [true, 'Please provide minimum transfer time']
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum transfer time']
    }
  },
  supportedCurrencies: {
    type: [String],
    required: [true, 'Please provide supported currencies']
  },
  methods: {
    type: [String],
    enum: ['bank_transfer', 'debit_card', 'credit_card', 'cash_pickup', 'mobile_wallet'],
    required: [true, 'Please provide supported payment methods']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ProviderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Provider', ProviderSchema);
