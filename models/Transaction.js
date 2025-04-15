
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  fromCurrency: {
    type: String,
    required: [true, 'Please provide source currency']
  },
  toCurrency: {
    type: String,
    required: [true, 'Please provide target currency']
  },
  sentAmount: {
    type: Number,
    required: [true, 'Please provide sent amount']
  },
  receivedAmount: {
    type: Number,
    required: [true, 'Please provide received amount']
  },
  exchangeRate: {
    type: Number,
    required: [true, 'Please provide exchange rate']
  },
  fee: {
    type: Number,
    required: [true, 'Please provide fee amount']
  },
  status: {
    type: String,
    enum: ['initiated', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'initiated'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'debit_card', 'credit_card', 'cash_pickup', 'mobile_wallet'],
    required: [true, 'Please provide payment method']
  },
  providerTransactionId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
