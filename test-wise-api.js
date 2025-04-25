/**
 * Test script for verifying Wise API connectivity with production credentials
 * Run with: node test-wise-api.js
 */

require('dotenv').config();

// Set credentials directly for Wise API
process.env.WISE_CLIENT_SECRET = 'c24c06aa-85eb-40bf-85a7-cbf87979bf61';
// Client ID and key are also set but not currently used in the API calls
process.env.WISE_CLIENT_ID = 'mymoneytransfers';
process.env.WISE_CLIENT_KEY = 'mymoneytransfers';
// Production API endpoint
process.env.WISE_API_URL = 'https://api.wise.com/v1';

const wiseApiService = require('./services/wiseApiService');

async function testWiseAPI() {
  console.log('==== WISE API TEST SCRIPT (PRODUCTION) ====');
  console.log('Testing configuration:');
  console.log(`Client ID: ${process.env.WISE_CLIENT_ID}`);
  console.log(`Client Key: ${process.env.WISE_CLIENT_KEY}`);
  console.log(`Client Secret: ${process.env.WISE_CLIENT_SECRET ? '****' + process.env.WISE_CLIENT_SECRET.substring(process.env.WISE_CLIENT_SECRET.length - 4) : 'NOT SET'}`);
  console.log(`API URL: ${process.env.WISE_API_URL}`);
  
  try {
    // Test 1: Verify API credentials
    console.log('\n1. Testing API credentials...');
    const credentialTest = await wiseApiService.testApiCredentials();
    
    if (credentialTest.success) {
      console.log('✅ API connection successful!');
      console.log(`Status: ${credentialTest.status}`);
    } else {
      console.error('❌ API connection failed!');
      console.error(credentialTest.message);
      return;
    }
    
    // Test 2: Get available currencies
    console.log('\n2. Testing available currencies...');
    const currencies = await wiseApiService.getAvailableCurrencies();
    console.log(`✅ Found ${currencies.length} currencies`);
    console.log('Sample currencies:', currencies.slice(0, 3).map(c => c.code).join(', '), '...');
    
    // Test 3: Get sample exchange rate
    console.log('\n3. Testing exchange rate (GBP to EUR)...');
    const rate = await wiseApiService.getExchangeRate('GBP', 'EUR', 1000);
    console.log('✅ Exchange rate data:');
    console.log(JSON.stringify(rate, null, 2));
    console.log('✅ LIVE PRODUCTION DATA CONFIRMED!');
    
    console.log('\nAll tests completed successfully! ✅');
    
  } catch (error) {
    console.error('❌ TEST FAILED:');
    console.error(error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testWiseAPI(); 