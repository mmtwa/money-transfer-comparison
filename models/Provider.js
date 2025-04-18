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
  apiEnabled: {
    type: Boolean,
    default: false,
    description: 'Whether live API integration is enabled for this provider'
  },
  apiHandler: {
    type: String,
    enum: ['wise', 'transferwise', 'xe', 'westernunion', 'ofx', 'remitly', 'generic'],
    default: 'generic',
    description: 'Identifies which API handler to use for this provider'
  },
  apiVersion: {
    type: String,
    default: 'v1'
  },
  apiLastTested: {
    type: Date,
    default: null
  },
  apiCredentialsExpiry: {
    type: Date,
    default: null
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
  apiQuota: {
    daily: {
      type: Number,
      default: 1000
    },
    monthly: {
      type: Number,
      default: 30000
    }
  },
  apiUsage: {
    today: {
      type: Number,
      default: 0
    },
    thisMonth: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
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

// Method to track API usage
ProviderSchema.methods.trackApiCall = async function() {
  // Reset daily counter if it's a new day
  const today = new Date();
  const lastReset = new Date(this.apiUsage.lastReset);
  
  if (today.getDate() !== lastReset.getDate() || 
      today.getMonth() !== lastReset.getMonth() ||
      today.getFullYear() !== lastReset.getFullYear()) {
    this.apiUsage.today = 0;
    this.apiUsage.lastReset = today;
  }
  
  // Reset monthly counter if it's a new month
  if (today.getMonth() !== lastReset.getMonth() ||
      today.getFullYear() !== lastReset.getFullYear()) {
    this.apiUsage.thisMonth = 0;
  }
  
  // Increment counters
  this.apiUsage.today += 1;
  this.apiUsage.thisMonth += 1;
  
  await this.save();
  
  // Return true if still within quota, false if exceeded
  return this.apiUsage.today <= this.apiQuota.daily && 
         this.apiUsage.thisMonth <= this.apiQuota.monthly;
};

// Static method to find providers with active API integration
ProviderSchema.statics.findWithActiveApi = function() {
  return this.find({ apiEnabled: true, active: true });
};

module.exports = mongoose.model('Provider', ProviderSchema);