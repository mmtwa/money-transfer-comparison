
const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide currency code'],
    unique: true,
    trim: true,
    maxlength: [3, 'Code must be 3 characters']
  },
  name: {
    type: String,
    required: [true, 'Please provide currency name'],
    trim: true
  },
  symbol: {
    type: String,
    required: [true, 'Please provide currency symbol']
  },
  popular: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Currency', CurrencySchema);
