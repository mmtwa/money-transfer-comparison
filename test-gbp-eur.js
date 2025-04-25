require('dotenv').config();
const providerService = require('./services/providerService');
const wiseApiService = require('./services/wiseApiService');

async function testCurrencyPair() {
  try {
    const fromCurrency = 'GBP';
    const toCurrency = 'EUR';
    const amount = 1000;
    
    console.log(`Testing ${fromCurrency} to ${toCurrency} conversion...`);
    
    // First check if this pair is supported by Wise
    const isSupported = wiseApiService.isCurrencyPairSupported(fromCurrency, toCurrency);
    console.log(`Currency pair supported by Wise: ${isSupported}`);
    
    if (!isSupported) {
      // Check if reverse is supported
      const reverseSupported = wiseApiService.isCurrencyPairSupported(toCurrency, fromCurrency);
      console.log(`Reverse pair supported: ${reverseSupported}`);
    }
    
    // Check all supported pairs
    console.log('All supported pairs:');
    wiseApiService.supportedCurrencyPairs.forEach(pair => {
      console.log(`- ${pair.source} to ${pair.target}`);
    });
    
    // Initialize provider service
    await providerService.initialize();
    console.log('Provider service initialized');
    console.log('Available providers:', Object.keys(providerService.providers));
    
    // Try to get exchange rates
    console.log(`\nGetting rates for ${fromCurrency} to ${toCurrency}...`);
    const rates = await providerService.getExchangeRates(fromCurrency, toCurrency, amount);
    
    if (rates.length === 0) {
      console.log('NO PROVIDERS RETURNED RATES FOR THIS PAIR!');
    } else {
      console.log(`Got ${rates.length} providers with rates:`);
      rates.forEach(rate => {
        console.log(`- ${rate.providerName}: ${rate.effectiveRate} (${rate.amountReceived} ${toCurrency})`);
      });
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testCurrencyPair(); 