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
  { source: 'GBP', target: 'EUR', amount: 500 },
  { source: 'USD', target: 'GBP', amount: 750 }
];

/**
 * Recursively search for specific fields in an object
 * @param {Object} obj - The object to search
 * @param {Array<string>} searchTerms - Array of field names to search for
 * @returns {Object} - Object with found fields as keys and their values
 */
function findFields(obj, searchTerms) {
  const results = {};
  
  function search(currentObj, path = '') {
    if (currentObj && typeof currentObj === 'object') {
      // Check if any of the current object's keys match our search terms
      Object.keys(currentObj).forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        
        // If this key matches any of our search terms, add it to results
        if (searchTerms.some(term => key.toLowerCase().includes(term.toLowerCase()))) {
          results[currentPath] = currentObj[key];
        }
        
        // Continue searching recursively
        search(currentObj[key], currentPath);
      });
    } else if (Array.isArray(currentObj)) {
      // If we have an array, search each item
      currentObj.forEach((item, index) => {
        const currentPath = path ? `${path}[${index}]` : `[${index}]`;
        search(item, currentPath);
      });
    }
  }
  
  search(obj);
  return results;
}

/**
 * Test quotes API with parameters and search for delivery time fields
 */
async function testQuotesApiDeliveryTime(pair) {
  try {
    console.log(`\nTesting quotes API for ${pair.source} to ${pair.target}...`);
    
    // Try different combinations of parameters to see if they affect the delivery time response
    const paramSets = [
      // Basic params
      {
        source: pair.source,
        target: pair.target,
        sourceAmount: pair.amount,
        rateType: 'FIXED'
      },
      // With preferred payment methods
      {
        source: pair.source,
        target: pair.target,
        sourceAmount: pair.amount,
        rateType: 'FIXED',
        preferredPayIn: 'BANK_TRANSFER',
        preferredPayOut: 'BANK_TRANSFER' 
      }
    ];
    
    for (const [index, params] of paramSets.entries()) {
      console.log(`\nTrying parameter set ${index + 1}:`, params);
      
      const response = await http.get('/quotes', { params });
      
      // Search for delivery time related fields in the response
      const deliveryFields = findFields(response.data, [
        'delivery', 'estimated', 'arrival', 'time', 'duration'
      ]);
      
      console.log('\n==================================================');
      console.log(`DELIVERY TIME FIELDS (${pair.source} to ${pair.target}):`);
      console.log('==================================================');
      
      if (Object.keys(deliveryFields).length === 0) {
        console.log('No delivery time related fields found in this response');
      } else {
        console.log(util.inspect(deliveryFields, { depth: 5, colors: true }));
      }
      
      // Also log payment options which might contain delivery information
      if (response.data.paymentOptions && response.data.paymentOptions.length > 0) {
        console.log('\n==================================================');
        console.log(`PAYMENT OPTIONS (${pair.source} to ${pair.target}):`);
        console.log('==================================================');
        console.log(util.inspect(response.data.paymentOptions, { depth: 5, colors: true }));
      }
      
      // Log the full response structure (just the keys, not values) to see what's available
      console.log('\n==================================================');
      console.log(`RESPONSE STRUCTURE (${pair.source} to ${pair.target}):`);
      console.log('==================================================');
      
      function getStructure(obj, depth = 0) {
        if (depth > 5) return '...'; // Limit depth
        
        if (Array.isArray(obj)) {
          if (obj.length === 0) return '[]';
          return `[${typeof obj[0] === 'object' ? getStructure(obj[0], depth + 1) : typeof obj[0]}]`;
        }
        
        if (obj && typeof obj === 'object') {
          const keys = Object.keys(obj);
          if (keys.length === 0) return '{}';
          
          const structure = {};
          keys.forEach(key => {
            structure[key] = getStructure(obj[key], depth + 1);
          });
          return structure;
        }
        
        return typeof obj;
      }
      
      console.log(util.inspect(getStructure(response.data), { depth: null, colors: true }));
    }
    
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
  console.log('=== WISE API DELIVERY TIME ANALYSIS ===');
  console.log(`Using Client ID: ${clientId}`);
  console.log(`API URL: ${apiUrl}`);
  
  // Test API credentials
  try {
    console.log('\n=== Testing API Credentials ===');
    const response = await http.get('/rates', {
      params: {
        source: 'GBP',
        target: 'EUR'
      }
    });
    console.log('API credentials are valid!');
  } catch (error) {
    console.error('API credential validation failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    console.log('Exiting tests due to credential failure.');
    return;
  }
  
  for (const pair of testPairs) {
    await testQuotesApiDeliveryTime(pair);
  }
  
  console.log('\n=== ALL TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 