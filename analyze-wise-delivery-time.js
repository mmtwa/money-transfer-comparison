require('dotenv').config();
const axios = require('axios');
const util = require('util');

// Get credentials from environment
const apiKey = process.env.WISE_API_KEY;
if (!apiKey) {
  console.error('WISE_API_KEY is required in .env file');
  process.exit(1);
}

// Create HTTP client with API key auth
const http = axios.create({
  baseURL: process.env.WISE_API_URL || 'https://api.wise.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
});

// Currency pairs to test
const currencyPairs = [
  { source: 'EUR', target: 'USD', amount: 1000 },
  { source: 'GBP', target: 'EUR', amount: 1000 },
  { source: 'USD', target: 'GBP', amount: 1000 }
];

// Function to analyze and extract payment options with delivery times
async function analyzeDeliveryTimes(source, target, amount) {
  try {
    console.log(`\n===== Testing ${source} to ${target} =====`);
    
    // Make the API request to get the quote
    const params = {
      source: source,
      target: target,
      sourceAmount: amount,
      preferredPayIn: undefined, // don't specify to get all options
      preferredPayOut: undefined // don't specify to get all options
    };
    
    const response = await http.get('/quotes', { params });
    
    console.log('Delivery estimate:', response.data.deliveryEstimate);
    
    // Check if there are payment options
    if (response.data.paymentOptions) {
      console.log('\nPayment Options:');
      
      response.data.paymentOptions.forEach((option, index) => {
        console.log(`\nOption ${index + 1}:`);
        console.log(`Pay-in method: ${option.payIn}`);
        console.log(`Pay-out method: ${option.payOut}`);
        console.log(`Delivery estimate: ${option.estimatedDelivery}`);
        
        // Look for additional time-related fields
        const timeFields = findTimeFields(option);
        if (timeFields.length > 0) {
          console.log('Additional time fields:', timeFields);
        }
      });
    } else {
      console.log('No payment options found in response');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error analyzing ${source} to ${target}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

// Recursively search for fields with time-related names
function findTimeFields(obj, path = '', results = []) {
  if (!obj || typeof obj !== 'object') return results;
  
  const timeKeywords = ['time', 'date', 'delivery', 'estimate', 'arrival', 'duration'];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Check if the key contains any time-related keywords
    if (timeKeywords.some(keyword => key.toLowerCase().includes(keyword)) && value !== null && value !== undefined) {
      results.push({ path: currentPath, value });
    }
    
    // Recursively search in nested objects and arrays
    if (typeof value === 'object') {
      findTimeFields(value, currentPath, results);
    }
  }
  
  return results;
}

// Main function to test the API
async function runTests() {
  try {
    // First test if credentials are valid
    console.log('Testing API credentials...');
    const testResponse = await http.get('/rates', {
      params: {
        source: 'GBP',
        target: 'EUR'
      }
    });
    
    if (testResponse.status === 200) {
      console.log('API credentials are valid');
      
      // Run tests for each currency pair
      for (const pair of currencyPairs) {
        const result = await analyzeDeliveryTimes(pair.source, pair.target, pair.amount);
        
        if (result) {
          console.log('\nFull response structure:');
          // Print the full response structure, but limit depth to avoid overwhelming output
          console.log(util.inspect(result, { depth: 3, colors: true }));
        }
      }
      
      console.log('\nAll tests completed');
    }
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
runTests(); 