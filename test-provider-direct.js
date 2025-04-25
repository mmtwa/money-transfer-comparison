require('dotenv').config();
const providerService = require('./services/providerService');

async function testProviderDirect() {
  try {
    console.log('Testing provider service directly...');
    
    // First make sure the provider service is initialized
    await providerService.initialize();
    
    console.log('Available providers after initialization:', Object.keys(providerService.providers));
    
    // Test our specific currency pair
    const fromCurrency = 'GBP';
    const toCurrency = 'EUR';
    const amount = 1000;
    
    console.log(`Getting rates for ${fromCurrency} to ${toCurrency}...`);
    
    // Direct call to getExchangeRates
    const results = await providerService.getExchangeRates(fromCurrency, toCurrency, amount);
    
    console.log(`Got ${results.length} results from provider service`);
    console.log('Results:', results);
    
  } catch (error) {
    console.error('Error testing provider service:', error);
  }
}

testProviderDirect(); 