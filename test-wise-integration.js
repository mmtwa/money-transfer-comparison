require('dotenv').config();
const axios = require('axios');

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

// Currency pairs to test
const testPairs = [
  { source: 'EUR', target: 'USD', amount: 1000 },
  { source: 'GBP', target: 'EUR', amount: 500 },
  { source: 'USD', target: 'GBP', amount: 750 }
];

/**
 * Test getting exchange rates
 */
async function testExchangeRates() {
  console.log('\n=== Testing Exchange Rates API ===');
  
  for (const pair of testPairs) {
    try {
      console.log(`\nTesting ${pair.source} to ${pair.target}...`);
      
      const response = await http.get('/rates', {
        params: {
          source: pair.source,
          target: pair.target
        }
      });
      
      if (Array.isArray(response.data)) {
        console.log(`Success! Rate: ${response.data[0].rate}`);
      } else {
        console.log(`Success! Rate: ${response.data.rate}`);
      }
    } catch (error) {
      console.error(`Error for ${pair.source} to ${pair.target}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  }
}

/**
 * Test getting quotes (pricing and delivery time)
 */
async function testQuotes() {
  console.log('\n=== Testing Quotes API ===');
  
  for (const pair of testPairs) {
    try {
      console.log(`\nTesting quote for ${pair.source} to ${pair.target} (${pair.amount} ${pair.source})...`);
      
      const response = await http.get('/quotes', {
        params: {
          source: pair.source,
          target: pair.target,
          sourceAmount: pair.amount,
          rateType: 'FIXED'
        }
      });
      
      const data = response.data;
      console.log('Success!');
      console.log(`Rate: ${data.rate}`);
      console.log(`Fee: ${data.fee || (data.paymentOptions?.[0]?.fee?.total || 'Not available')}`);
      console.log(`Target amount: ${data.targetAmount}`);
      console.log(`Delivery: ${data.formattedEstimatedDelivery || data.estimatedDelivery || 'Not available'}`);
      
    } catch (error) {
      console.error(`Error for ${pair.source} to ${pair.target}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  }
}

/**
 * Test getting quotes with target amount
 */
async function testTargetQuotes() {
  console.log('\n=== Testing Quotes API with Target Amount ===');
  
  for (const pair of testPairs) {
    try {
      // Use the target amount instead of source amount
      console.log(`\nTesting quote for ${pair.source} to ${pair.target} (${pair.amount} ${pair.target} - target amount)...`);
      
      const response = await http.get('/quotes', {
        params: {
          source: pair.source,
          target: pair.target,
          targetAmount: pair.amount,
          rateType: 'FIXED'
        }
      });
      
      const data = response.data;
      console.log('Success!');
      console.log(`Rate: ${data.rate}`);
      console.log(`Source amount: ${data.sourceAmount}`);
      console.log(`Fee: ${data.fee || (data.paymentOptions?.[0]?.fee?.total || 'Not available')}`);
      console.log(`Delivery: ${data.formattedEstimatedDelivery || data.estimatedDelivery || 'Not available'}`);
      
    } catch (error) {
      console.error(`Error for ${pair.source} to ${pair.target}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  }
}

/**
 * Test getting quotes with our delivery time extraction logic
 */
async function testDeliveryTimes() {
  console.log('\n=== Testing Delivery Time Extraction ===');
  
  for (const pair of testPairs) {
    try {
      console.log(`\nTesting delivery time for ${pair.source} to ${pair.target}...`);
      
      // Try to get from quotes API
      try {
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
        
        const data = response.data;
        
        // Try to extract delivery time from various fields
        let foundDeliveryTime = null;
        let deliverySource = '';
        
        if (data.formattedEstimatedDelivery) {
          foundDeliveryTime = data.formattedEstimatedDelivery;
          deliverySource = 'formattedEstimatedDelivery';
        } else if (data.estimatedDelivery) {
          foundDeliveryTime = data.estimatedDelivery;
          deliverySource = 'estimatedDelivery';
        } else if (data.paymentOptions && data.paymentOptions.length > 0) {
          const bankTransferOption = data.paymentOptions.find(option => 
            option.payIn === 'BANK_TRANSFER' || option.payOut === 'BANK_TRANSFER'
          );
          
          if (bankTransferOption) {
            if (bankTransferOption.estimatedDelivery) {
              foundDeliveryTime = bankTransferOption.estimatedDelivery;
              deliverySource = 'paymentOptions[].estimatedDelivery';
            } else if (bankTransferOption.formattedEstimatedDelivery) {
              foundDeliveryTime = bankTransferOption.formattedEstimatedDelivery;
              deliverySource = 'paymentOptions[].formattedEstimatedDelivery';
            }
          }
        } else if (data.delivery) {
          if (data.delivery.estimatedDelivery) {
            foundDeliveryTime = data.delivery.estimatedDelivery;
            deliverySource = 'delivery.estimatedDelivery';
          } else if (data.delivery.formattedEstimatedDelivery) {
            foundDeliveryTime = data.delivery.formattedEstimatedDelivery;
            deliverySource = 'delivery.formattedEstimatedDelivery';
          }
        }
        
        if (foundDeliveryTime) {
          console.log(`Found delivery time: ${foundDeliveryTime} in field: ${deliverySource}`);
        } else {
          console.log('Could not find delivery time in API response, using fallback');
          
          // Use our fallback function
          const { getEstimatedDeliveryTime } = require('./services/wiseApiService');
          const fallbackTime = getEstimatedDeliveryTime(pair.source, pair.target);
          console.log(`Fallback delivery time: ${fallbackTime}`);
        }
        
      } catch (error) {
        console.error(`Error getting delivery time from quotes API: ${error.message}`);
        console.log('Using fallback delivery time calculation...');
        
        // Use our fallback function
        const { getEstimatedDeliveryTime } = require('./services/wiseApiService');
        const fallbackTime = getEstimatedDeliveryTime(pair.source, pair.target);
        console.log(`Fallback delivery time: ${fallbackTime}`);
      }
      
    } catch (error) {
      console.error(`Error testing delivery time for ${pair.source} to ${pair.target}:`, error.message);
    }
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== WISE API INTEGRATION TESTS ===');
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
  
  // Run individual tests
  await testExchangeRates();
  await testQuotes();
  await testTargetQuotes();
  await testDeliveryTimes();
  
  console.log('\n=== ALL TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 