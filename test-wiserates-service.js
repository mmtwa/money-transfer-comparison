// Test script for the wiseRatesService
require('dotenv').config();
const wiseRatesService = require('./services/wiseRatesService');

console.log('==========================================================');
console.log('            WISE RATES SERVICE TEST SCRIPT                ');
console.log('==========================================================');
console.log('Testing the updated wiseRatesService with Basic Authentication');

// Test functions
const testService = async () => {
  try {
    console.log('\n1. Testing service initialization...');
    await wiseRatesService.initialize();
    console.log('✅ Service initialized successfully\n');
    
    console.log('2. Testing getCurrentRate() method...');
    const currentRate = await wiseRatesService.getCurrentRate('EUR', 'USD');
    console.log('✅ Successfully retrieved current rate:');
    console.log(JSON.stringify(currentRate, null, 2));
    console.log('\n');
    
    console.log('3. Testing getHistoricalRate() method...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString();
    
    const historicalRate = await wiseRatesService.getHistoricalRate('GBP', 'USD', yesterdayIso);
    console.log('✅ Successfully retrieved historical rate:');
    console.log(JSON.stringify(historicalRate, null, 2));
    console.log('\n');
    
    console.log('4. Testing getHistoricalRates() method...');
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoIso = oneMonthAgo.toISOString();
    const nowIso = new Date().toISOString();
    
    const historicalRates = await wiseRatesService.getHistoricalRates('USD', 'EUR', oneMonthAgoIso, nowIso, 'day');
    console.log(`✅ Successfully retrieved ${historicalRates.length} historical rates`);
    if (historicalRates.length > 0) {
      console.log('First data point:');
      console.log(JSON.stringify(historicalRates[0], null, 2));
      console.log('Last data point:');
      console.log(JSON.stringify(historicalRates[historicalRates.length - 1], null, 2));
    }
    
    console.log('\nAll tests completed successfully! ✅');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

// Run the tests
testService().catch(err => {
  console.error('Unhandled error during test:', err);
}); 