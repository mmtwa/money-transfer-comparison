require('dotenv').config();
const axios = require('axios');
const util = require('util');

// Wise API credentials from environment variables
const clientId = process.env.WISE_CLIENT_ID;
const clientSecret = process.env.WISE_CLIENT_SECRET;
const apiUrl = process.env.WISE_API_URL || 'https://api.wise.com/v1';

// Create an axios instance with authentication
const http = axios.create({
  baseURL: apiUrl,
  auth: {
    username: clientId,
    password: clientSecret
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

// Test currency pairs
const testPairs = [
  { source: 'EUR', target: 'USD', amount: 1000 },
  { source: 'GBP', target: 'EUR', amount: 500 }
];

/**
 * Log the raw API response with deep inspection
 */
function logResponse(title, response) {
  console.log('\n==================================================');
  console.log(`${title}:`);
  console.log('==================================================');
  
  // Use util.inspect to get a detailed view of the object with proper depth
  console.log(util.inspect(response, { depth: 10, colors: true, maxArrayLength: null }));
  console.log('==================================================\n');
}

/**
 * Test rates API and log raw response
 */
async function testRatesApi(pair) {
  try {
    console.log(`\nTesting rates API for ${pair.source} to ${pair.target}...`);
    
    const response = await http.get('/rates', {
      params: {
        source: pair.source,
        target: pair.target
      }
    });
    
    logResponse(`Rates API Response (${pair.source} to ${pair.target})`, response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error in rates API:`, error.message);
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
  }
}

/**
 * Test quotes API with all parameters and log raw response
 */
async function testQuotesApi(pair) {
  try {
    console.log(`\nTesting quotes API for ${pair.source} to ${pair.target}...`);
    
    const response = await http.get('/quotes', {
      params: {
        source: pair.source,
        target: pair.target,
        sourceAmount: pair.amount,
        rateType: 'FIXED',
        preferredPayIn: 'BANK_TRANSFER',
        preferredPayOut: 'BANK_TRANSFER'
      }
    });
    
    logResponse(`Quotes API Response (${pair.source} to ${pair.target})`, response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error in quotes API:`, error.message);
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== WISE API RAW RESPONSE LOGGER ===');
  console.log(`Using Client ID: ${clientId}`);
  console.log(`API URL: ${apiUrl}`);
  
  for (const pair of testPairs) {
    // Test both endpoints for each currency pair
    await testRatesApi(pair);
    await testQuotesApi(pair);
  }
  
  console.log('\n=== ALL TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 