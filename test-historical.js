require('dotenv').config();
const wiseApiService = require('./services/wiseApiService');

// Test parameters
const sourceCurrency = 'USD';
const targetCurrency = 'EUR';
const days = 14;

async function testHistoricalRates() {
  try {
    console.log(`Fetching historical rates for ${sourceCurrency} to ${targetCurrency} for last ${days} days...`);
    
    const historicalRates = await wiseApiService.getHistoricalRates(
      sourceCurrency, 
      targetCurrency, 
      days
    );
    
    console.log(`Retrieved ${historicalRates.length} days of data`);
    console.log('Sample of historical rates:');
    console.log(historicalRates.slice(0, 5));
    
    // Test client ID and secret are available 
    console.log('\nAPI Credentials:');
    console.log('Client ID exists:', Boolean(process.env.WISE_CLIENT_ID));
    console.log('Client Secret exists:', Boolean(process.env.WISE_CLIENT_SECRET));
    
    // Test connection directly
    console.log('\nTesting API credentials...');
    const credentialTest = await wiseApiService.testApiCredentials();
    console.log('API Test Result:', credentialTest);
    
  } catch (error) {
    console.error('Error testing historical rates:', error);
  }
}

testHistoricalRates(); 