require('dotenv').config();
const axios = require('axios');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

// Set up authentication for Wise API
const WISE_API_KEY = process.env.WISE_API_KEY;
const WISE_API_URL = process.env.WISE_API_URL || 'https://api.wise.com/v1';

// Verify API key is set
if (!WISE_API_KEY) {
  console.error('WISE_API_KEY environment variable is not set!');
  process.exit(1);
}

// Set up an authenticated Axios instance for Wise API
const wiseApi = axios.create({
  baseURL: WISE_API_URL,
  headers: {
    'Authorization': `Bearer ${WISE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Test currency pairs
const testCurrencyPairs = [
  { source: 'EUR', target: 'USD', amount: 1000 },
  { source: 'GBP', target: 'EUR', amount: 1000 },
  { source: 'USD', target: 'GBP', amount: 1000 }
];

// Function to test the quotes API for delivery time
async function testQuotesApiDeliveryTime() {
  console.log('Testing Wise Quotes API for delivery time information...');
  
  for (const pair of testCurrencyPairs) {
    console.log(`\nTesting ${pair.source} to ${pair.target} with amount ${pair.amount}:`);
    
    try {
      // Make request to the quotes endpoint
      const response = await wiseApi.get('/quotes', {
        params: {
          source: pair.source,
          target: pair.target,
          sourceAmount: pair.amount,
          rateType: 'FIXED',
          preferredPayIn: 'BANK_TRANSFER',
          preferredPayOut: 'BANK_TRANSFER'
        }
      });
      
      // Log delivery time related fields
      console.log(`\nDelivery time fields found:`);
      if (response.data.deliveryEstimate) {
        console.log(`- deliveryEstimate: ${response.data.deliveryEstimate}`);
      }
      
      if (response.data.formattedEstimatedDelivery) {
        console.log(`- formattedEstimatedDelivery: ${response.data.formattedEstimatedDelivery}`);
      }
      
      if (response.data.estimatedDelivery) {
        console.log(`- estimatedDelivery: ${response.data.estimatedDelivery}`);
      }
      
      // Check payment options for delivery time
      if (response.data.paymentOptions && response.data.paymentOptions.length > 0) {
        console.log(`\nPayment Options Available: ${response.data.paymentOptions.length}`);
        
        for (let i = 0; i < response.data.paymentOptions.length; i++) {
          const option = response.data.paymentOptions[i];
          console.log(`\nOption ${i+1}:`);
          console.log(`- Type: ${option.payIn || 'N/A'} to ${option.payOut || 'N/A'}`);
          
          if (option.estimatedDelivery) {
            console.log(`- estimatedDelivery: ${option.estimatedDelivery}`);
          }
          
          if (option.formattedEstimatedDelivery) {
            console.log(`- formattedEstimatedDelivery: ${option.formattedEstimatedDelivery}`);
          }
        }
      }
      
      // Log all fields that might contain delivery time information
      console.log('\nResponse structure:');
      const fields = [
        'source', 'target', 'sourceAmount', 'targetAmount', 'rate', 
        'createdTime', 'deliveryEstimate', 'formattedEstimatedDelivery', 
        'estimatedDelivery', 'fee', 'feeDetails'
      ];
      
      for (const field of fields) {
        if (response.data[field] !== undefined) {
          console.log(`- ${field}: ${JSON.stringify(response.data[field])}`);
        }
      }
      
      // Add a delay to avoid rate limiting
      await sleep(1000);
      
    } catch (error) {
      console.error(`Error for ${pair.source} to ${pair.target}:`, 
        error.response?.data?.errors || error.response?.data || error.message);
    }
  }
}

// Main function to run tests
async function runTests() {
  try {
    // Validate API credentials
    const profileResponse = await wiseApi.get('/profiles');
    if (profileResponse.data && profileResponse.data.length > 0) {
      console.log('API credentials valid. Found profiles:', profileResponse.data.length);
    }
    
    // Test delivery time information from quotes API
    await testQuotesApiDeliveryTime();
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data
      });
      
      if (error.response.status === 401) {
        console.error('Authentication failed. Check your API credentials.');
      }
    }
    process.exit(1);
  }
}

// Run the tests
runTests(); 