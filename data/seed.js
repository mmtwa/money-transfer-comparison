
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Provider = require('../models/Provider');
const Currency = require('../models/Currency');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Import sample data
const providers = [
  {
    name: 'TransferWise',
    code: 'transferwise',
    logo: '/wiselogo.png',
    description: 'International money transfer service',
    baseUrl: 'https://api.transferwise.com',
    apiKey: 'your-transferwise-api-key',
    transferFeeStructure: {
      type: 'percentage',
      percentage: 0.5,
      minimum: 2.0
    },
    exchangeRateMargin: 0.005,
    transferTimeHours: {
      min: 24,
      max: 48
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'],
    methods: ['bank_transfer', 'debit_card', 'credit_card'],
    rating: 4.8,
    active: true
  },
  {
    name: 'XE Money Transfer',
    code: 'xe',
    logo: 'https://example.com/logos/xe.png',
    description: 'Send money worldwide',
    baseUrl: 'https://api.xe.com',
    apiKey: 'your-xe-api-key',
    apiSecret: 'your-xe-api-secret',
    transferFeeStructure: {
      type: 'flat',
      amount: 0.0
    },
    exchangeRateMargin: 0.01,
    transferTimeHours: {
      min: 48,
      max: 72
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
    methods: ['bank_transfer'],
    rating: 4.5,
    active: true
  },
  {
    name: 'Western Union',
    code: 'westernunion',
    logo: 'https://example.com/logos/westernunion.png',
    description: 'Global money transfers',
    baseUrl: 'https://api.westernunion.com',
    apiKey: 'your-westernunion-api-key',
    transferFeeStructure: {
      type: 'percentage',
      percentage: 2.5,
      minimum: 5.99
    },
    exchangeRateMargin: 0.025,
    transferTimeHours: {
      min: 0,
      max: 24
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'],
    methods: ['bank_transfer', 'cash_pickup', 'mobile_wallet'],
    rating: 4.0,
    active: true
  },
  {
    name: 'OFX',
    code: 'ofx',
    logo: 'https://example.com/logos/ofx.png',
    description: 'International money transfers',
    baseUrl: 'https://api.ofx.com',
    apiKey: 'your-ofx-api-key',
    transferFeeStructure: {
      type: 'flat',
      amount: 0.0
    },
    exchangeRateMargin: 0.008,
    transferTimeHours: {
      min: 72,
      max: 120
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
    methods: ['bank_transfer'],
    rating: 4.4,
    active: true
  },
  {
    name: 'Remitly',
    code: 'remitly',
    logo: 'https://example.com/logos/remitly.png',
    description: 'Fast international transfers',
    baseUrl: 'https://api.remitly.com',
    apiKey: 'your-remitly-api-key',
    transferFeeStructure: {
      type: 'flat',
      amount: 2.99
    },
    exchangeRateMargin: 0.015,
    transferTimeHours: {
      min: 0,
      max: 48
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
    methods: ['bank_transfer', 'mobile_wallet'],
    rating: 4.2,
    active: true
  }
];

const currencies = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    popular: true,
    active: true
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    popular: true,
    active: true
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    popular: true,
    active: true
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    popular: true,
    active: true
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    popular: true,
    active: true
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    popular: true,
    active: true
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    popular: true,
    active: true
  }
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Import into DB
const importData = async () => {
  try {
    await Provider.deleteMany();
    await Currency.deleteMany();
    await User.deleteMany();

    await Provider.create(providers);
    await Currency.create(currencies);
    await User.create(users);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Provider.deleteMany();
    await Currency.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Run command: node seed.js -i (import) or node seed.js -d (delete)
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use the correct command: -i (import) or -d (delete)');
  process.exit();
}
