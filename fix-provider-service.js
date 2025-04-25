require('dotenv').config();
const providerService = require('./services/providerService');

async function fixProviderService() {
  try {
    console.log('Initializing provider service...');
    await providerService.initialize();
    
    // Force additional fallback providers
    console.log('Adding guaranteed fallback providers...');
    
    // Ensure Wise provider exists
    if (!providerService.providers['wise']) {
      console.log('Adding Wise provider...');
      providerService.providers['wise'] = {
        id: 'wise-fallback-id',
        name: 'Wise',
        logo: '/images/providers/wise.png',
        apiKey: process.env.WISE_CLIENT_ID || 'fallback-key',
        apiSecret: process.env.WISE_CLIENT_SECRET || 'fallback-secret',
        baseUrl: process.env.WISE_API_URL || 'https://api.wise.com',
        transferFeeStructure: { type: 'percentage', percentage: 0.5, minimum: 2, maximum: 15 },
        exchangeRateMargin: 0.005,
        transferTimeHours: { min: 1, max: 24 },
        rating: 4.8,
        methods: ['bank_transfer', 'debit_card'],
        apiEnabled: true,
        apiHandler: 'wise'
      };
    }
    
    // Ensure XE provider exists
    if (!providerService.providers['xe']) {
      console.log('Adding XE provider...');
      providerService.providers['xe'] = {
        id: 'xe-fallback-id',
        name: 'XE',
        logo: '/images/providers/xe.png',
        apiKey: 'fallback-key',
        apiSecret: 'fallback-secret',
        baseUrl: 'https://api.xe.com',
        transferFeeStructure: { type: 'flat', amount: 3.5 },
        exchangeRateMargin: 0.02,
        transferTimeHours: { min: 24, max: 48 },
        rating: 4.2,
        methods: ['bank_transfer'],
        apiEnabled: true,
        apiHandler: 'xe'
      };
    }
    
    // Ensure Western Union provider exists
    if (!providerService.providers['westernunion']) {
      console.log('Adding Western Union provider...');
      providerService.providers['westernunion'] = {
        id: 'wu-fallback-id',
        name: 'Western Union',
        logo: '/images/providers/westernunion.png',
        apiKey: 'fallback-key',
        apiSecret: 'fallback-secret',
        baseUrl: 'https://api.westernunion.com',
        transferFeeStructure: { type: 'percentage', percentage: 1, minimum: 5, maximum: 25 },
        exchangeRateMargin: 0.03,
        transferTimeHours: { min: 0, max: 1 },
        rating: 3.9,
        methods: ['bank_transfer', 'cash_pickup'],
        apiEnabled: true,
        apiHandler: 'westernunion'
      };
    }
    
    console.log('Available providers after fixes:', Object.keys(providerService.providers));
    
    // Test a specific currency pair
    const fromCurrency = 'GBP';
    const toCurrency = 'EUR';
    const amount = 1000;
    
    console.log(`\nTesting ${fromCurrency} to ${toCurrency} conversion...`);
    const results = await providerService.getExchangeRates(fromCurrency, toCurrency, amount);
    
    console.log(`Got ${results.length} results from provider service`);
    if (results.length === 0) {
      console.error('ERROR: Still no results despite fixes!');
    } else {
      console.log('First provider result:', results[0]);
    }
    
  } catch (error) {
    console.error('Error in fix-provider-service:', error);
  }
}

fixProviderService(); 