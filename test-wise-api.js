/**
 * Test script for verifying Wise API connectivity with production credentials
 * Run with: node test-wise-api.js
 */

require('dotenv').config();

// Set credentials directly for Wise API if not in .env
if (!process.env.WISE_API_KEY && !process.env.WISE_CLIENT_SECRET) {
  console.log('ℹ️ No API key or client secret set, using default test credentials');
  
  // Default to Basic Auth if no API key is available
  if (!process.env.WISE_CLIENT_ID) {
    process.env.WISE_CLIENT_ID = 'mymoneytransfers';
  }
  if (!process.env.WISE_CLIENT_KEY) {
    process.env.WISE_CLIENT_KEY = 'mymoneytransfers';
  }
  if (!process.env.WISE_CLIENT_SECRET) {
    process.env.WISE_CLIENT_SECRET = 'c24c06aa-85eb-40bf-85a7-cbf87979bf61';
  }
}

if (!process.env.WISE_API_URL) {
  process.env.WISE_API_URL = 'https://api.wise.com';
}

const wiseApiService = require('./services/wiseApiService');
const fs = require('fs');
const path = require('path');

async function testWiseAPI() {
  console.log('==== WISE API TEST SCRIPT (PRODUCTION) ====');
  console.log('Testing configuration:');
  
  // Display which authentication method is being used
  if (process.env.WISE_API_KEY) {
    console.log('Authentication: API Key ✓');
    console.log(`API Key: ****${process.env.WISE_API_KEY.substring(process.env.WISE_API_KEY.length - 4)}`);
  } else if (process.env.WISE_CLIENT_SECRET) {
    console.log('Authentication: Basic Auth ✓');
    console.log(`Client ID: ${process.env.WISE_CLIENT_ID}`);
    console.log(`Client Key: ${process.env.WISE_CLIENT_KEY || 'Not set'}`);
    console.log(`Client Secret: ****${process.env.WISE_CLIENT_SECRET.substring(process.env.WISE_CLIENT_SECRET.length - 4)}`);
  } else {
    console.log('Authentication: None (unauthenticated) ⚠️');
  }
  
  console.log(`API URL: ${process.env.WISE_API_URL}`);
  
  let success = true;
  let publicApiWorking = false;
  let authenticatedApiWorking = false;
  
  try {
    // Test 1: Verify API credentials
    console.log('\n1. Testing Public API endpoint (no auth required) ...');
    const credentialTest = await wiseApiService.testApiCredentials();
    
    if (credentialTest.success) {
      console.log('✅ Public API endpoint is accessible!');
      console.log(`Status: ${credentialTest.status}`);
      publicApiWorking = true;
    } else {
      console.error('❌ Public API endpoint failed!');
      console.error(credentialTest.message);
      return;
    }
    
    // Test 2: Get sample exchange rate (uses public API)
    console.log('\n2. Testing exchange rate API (GBP to EUR)...');
    try {
      const rate = await wiseApiService.getExchangeRate('GBP', 'EUR', 1000);
      console.log('✅ Exchange rate data successfully retrieved!');
      console.log(JSON.stringify(rate, null, 2));
      console.log(`Exchange rate for GBP to EUR: ${rate.rate}`);
      console.log(`Fee from API: ${rate.fee || 'Not available - authentication required'}`);
    } catch (rateError) {
      console.error('❌ Exchange rate API failed:');
      console.error(rateError.message);
      success = false;
    }
    
    // Test 3: Get transfer pricing using Quotes API (requires authentication)
    console.log('\n3. Testing transfer pricing API - REQUIRES AUTHENTICATION (GBP to EUR, 1000)...');
    try {
      const pricing = await wiseApiService.getTransferPricing('GBP', 'EUR', 1000);
      console.log('✅ Pricing data successfully retrieved!');
      console.log(JSON.stringify(pricing, null, 2));
      authenticatedApiWorking = true;
    } catch (pricingError) {
      console.warn('⚠️ Transfer pricing API failed (this requires valid authentication):');
      console.warn(`${pricingError.message}`);
      console.log('Note: Transfer fees are not available through the public API');
      success = false;
    }
    
    // Test additional currency pair
    console.log('\n4. Testing another currency pair (USD to EUR, 2000)...');
    try {
      const usdEurRate = await wiseApiService.getExchangeRate('USD', 'EUR', 2000);
      console.log('✅ USD-EUR Rate data successfully retrieved!');
      console.log(JSON.stringify(usdEurRate, null, 2));
    } catch (usdEurError) {
      console.error('❌ USD-EUR Rate test failed:');
      console.error(usdEurError.message);
      success = false;
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('API FUNCTIONALITY STATUS:');
    console.log(`- Public Rate API (Exchange Rates): ${publicApiWorking ? '✅ Working' : '❌ Failed'}`);
    console.log(`- Authenticated API (Fee Information): ${authenticatedApiWorking ? '✅ Working' : '❌ Authentication Failed'}`);
    
    if (!authenticatedApiWorking) {
      console.log('\nIMPORTANT:');
      console.log('The system is currently using the public Wise API which provides exchange rates but NOT fees.');
      console.log('Your application will show exchange rates with zero fees until authentication is fixed.');
      console.log('\nRECOMMENDATION:');
      console.log('1. Get valid API credentials from your Wise account');
      console.log('2. Update your .env file with the valid API credentials');
      console.log('3. Restart your application for the changes to take effect');
    }
    
  } catch (error) {
    console.error('❌ TEST FAILED:');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function testWiseQuotesAPI() {
  console.log('=== Testing Wise API Quotes Endpoint ===');
  
  try {
    // Test API credentials first
    const testResult = await wiseApiService.testApiCredentials();
    console.log('API Credentials Test:', testResult ? 'PASSED' : 'FAILED');
    
    if (!testResult) {
      console.error('API credentials invalid, please check your API key or credentials');
      return;
    }
    
    // Test common currency pairs with different amounts
    const testCases = [
      { source: 'GBP', target: 'EUR', amount: 1000 },
      { source: 'USD', target: 'GBP', amount: 500 },
      { source: 'EUR', target: 'USD', amount: 2000 },
      { source: 'AUD', target: 'GBP', amount: 3000 },
      { source: 'CAD', target: 'EUR', amount: 1500 }
    ];
    
    console.log('\nTesting transfer pricing for different currency pairs:');
    for (const testCase of testCases) {
      console.log(`\n=== ${testCase.source} to ${testCase.target} (${testCase.amount} ${testCase.source}) ===`);
      try {
        const pricing = await wiseApiService.getTransferPricing(
          testCase.source, 
          testCase.target, 
          testCase.amount
        );
        
        console.log('Fee:', pricing.fee);
        console.log('Fee Breakdown:', JSON.stringify(pricing.feeBreakdown, null, 2));
        console.log('Delivery Time:', pricing.deliveryTime);
        
        // Also test the exchange rate
        const rate = await wiseApiService.getExchangeRate(testCase.source, testCase.target);
        console.log('Exchange Rate:', rate);
        
      } catch (error) {
        console.error(`Error testing ${testCase.source} to ${testCase.target}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Error during API testing:', error);
  }
}

/**
 * Capture and save raw API response data to a JSON file for inspection
 */
async function dumpWiseResponseData() {
  console.log('=== Dumping Raw Wise API Response Data ===');
  
  // Create logs directory if it doesn't exist
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  
  // Testing various currency pairs
  const testCases = [
    { source: 'GBP', target: 'EUR', amount: 1000 },
    { source: 'USD', target: 'GBP', amount: 2000 },
    { source: 'EUR', target: 'USD', amount: 3000 }
  ];
  
  try {
    // Create axios instance with the same configuration as in wiseApiService
    const axios = require('axios');
    
    // Determine which auth to use based on environment variables
    let httpConfig = {
      baseURL: process.env.WISE_API_URL || 'https://api.wise.com',
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (process.env.WISE_API_KEY) {
      httpConfig.headers.Authorization = `Bearer ${process.env.WISE_API_KEY}`;
      console.log('Using API Key authentication');
    } else if (process.env.WISE_CLIENT_ID && process.env.WISE_CLIENT_SECRET) {
      httpConfig.auth = {
        username: process.env.WISE_CLIENT_ID,
        password: process.env.WISE_CLIENT_SECRET
      };
      console.log('Using Basic Auth authentication');
    } else {
      console.log('No authentication configured, using public API (limited functionality)');
    }
    
    const http = axios.create(httpConfig);
    
    // Get timestamp for filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    
    // Test each currency pair
    for (const testCase of testCases) {
      console.log(`Testing ${testCase.source} to ${testCase.target} (${testCase.amount})...`);
      
      try {
        // Define query parameters for the quotes endpoint
        const params = {
          source: testCase.source,
          target: testCase.target,
          sourceAmount: testCase.amount,
          rateType: 'FIXED',
          preferredPayIn: 'BANK_TRANSFER',
          preferredPayOut: 'BANK_TRANSFER'
        };
        
        // Make the API request
        const response = await http.get('/quotes', { params });
        
        // Save the complete raw response to a file
        const filename = `wise_response_${testCase.source}_${testCase.target}_${timestamp}.json`;
        const filePath = path.join(logDir, filename);
        
        fs.writeFileSync(
          filePath,
          JSON.stringify({
            request: {
              params,
              url: '/quotes',
              method: 'GET'
            },
            response: {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              data: response.data
            }
          }, null, 2)
        );
        
        console.log(`Response saved to ${filePath}`);
        
        // Extract and log specific fields we're interested in
        console.log('Key data points from response:');
        console.log(`- Rate: ${response.data.rate}`);
        console.log(`- Fee: ${response.data.fee || 'Not available'}`);
        
        // Log delivery time related fields
        if (response.data.estimatedDelivery) {
          console.log(`- Estimated Delivery: ${JSON.stringify(response.data.estimatedDelivery)}`);
        }
        if (response.data.deliveryEstimate) {
          console.log(`- Delivery Estimate: ${JSON.stringify(response.data.deliveryEstimate)}`);
        }
        if (response.data.delivery) {
          console.log(`- Delivery: ${JSON.stringify(response.data.delivery)}`);
        }
        
        // Check if there are payment options with delivery info
        if (response.data.paymentOptions && response.data.paymentOptions.length > 0) {
          console.log('- Payment Options with Delivery Info:');
          response.data.paymentOptions.forEach((option, index) => {
            console.log(`  Option ${index + 1}:`);
            if (option.estimatedDelivery) {
              console.log(`  - Estimated Delivery: ${JSON.stringify(option.estimatedDelivery)}`);
            }
            if (option.deliveryEstimate) {
              console.log(`  - Delivery Estimate: ${JSON.stringify(option.deliveryEstimate)}`);
            }
            if (option.delivery) {
              console.log(`  - Delivery: ${JSON.stringify(option.delivery)}`);
            }
          });
        }
        
      } catch (error) {
        console.error(`Error with ${testCase.source} to ${testCase.target}:`, error.message);
        
        // Save error information
        const filename = `wise_error_${testCase.source}_${testCase.target}_${timestamp}.json`;
        const filePath = path.join(logDir, filename);
        
        fs.writeFileSync(
          filePath,
          JSON.stringify({
            request: {
              params: {
                source: testCase.source,
                target: testCase.target,
                sourceAmount: testCase.amount,
                rateType: 'FIXED',
                preferredPayIn: 'BANK_TRANSFER',
                preferredPayOut: 'BANK_TRANSFER'
              },
              url: '/quotes',
              method: 'GET'
            },
            error: {
              message: error.message,
              stack: error.stack,
              response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
              } : null
            }
          }, null, 2)
        );
        
        console.log(`Error details saved to ${filePath}`);
      }
    }
    
    console.log('\nAPI response dumping completed. Check the logs directory for the JSON files.');
    
  } catch (error) {
    console.error('Error during API response dumping:', error);
  }
}

// Comment out or remove the function calls you don't want to run
// testWiseAPI();
testWiseQuotesAPI().then(() => {
  console.log('\nTesting completed');
}).catch(err => {
  console.error('Unhandled error during testing:', err);
});
// dumpWiseResponseData().then(() => {
//   console.log('\nTesting completed');
// }).catch(err => {
//   console.error('Unhandled error during testing:', err);
// }); 