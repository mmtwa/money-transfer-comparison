/**
 * Test Script for Wise API Comparison Integration
 * 
 * This script tests the connection to the Wise API using our credentials
 * and tests the comparison endpoint for currency conversion.
 */

require('dotenv').config();
const axios = require('axios');

// Source and target currencies to test
const sourceCurrency = 'GBP';
const targetCurrency = 'EUR';
const sendAmount = 1000;

// Function to test direct API call to Wise
async function testDirectWiseApi() {
  console.log('Testing Direct Wise API Connection...');
  console.log(`Source Currency: ${sourceCurrency}`);
  console.log(`Target Currency: ${targetCurrency}`);
  console.log(`Send Amount: ${sendAmount}`);
  console.log(`Using API Key: ${process.env.WISE_CLIENT_SECRET ? 'Yes (Masked)' : 'Not configured'}`);
  
  try {
    const url = `https://api.wise.com/v4/comparisons/?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${sendAmount}`;
    
    // Use Bearer token authentication
    const headers = {
      'Authorization': `Bearer ${process.env.WISE_CLIENT_SECRET}`,
      'Accept': 'application/json'
    };

    console.log('Making API request to Wise...');
    const response = await axios.get(url, { headers });
    
    if (response.data && response.data.providers) {
      console.log('\nAPI Call Successful! ✅');
      console.log(`Received ${response.data.providers.length} providers`);

      // Print basic provider information
      response.data.providers.forEach((provider, index) => {
        console.log(`\nProvider ${index + 1}: ${provider.name}`);
        
        if (provider.quotes && provider.quotes.length > 0) {
          const quote = provider.quotes[0];
          console.log(`  Rate: ${quote.rate}`);
          console.log(`  Fee: ${quote.fee}`);
          console.log(`  Received Amount: ${quote.receivedAmount}`);
          
          if (quote.deliveryEstimation && quote.deliveryEstimation.duration) {
            console.log(`  Delivery Min: ${quote.deliveryEstimation.duration.min || 'N/A'}`);
            console.log(`  Delivery Max: ${quote.deliveryEstimation.duration.max || 'N/A'}`);
          }
        }
      });
    } else {
      console.log('Received response but no providers data found.');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('\nError connecting to Wise API! ❌');
    console.error(`Status: ${error.response?.status}`);
    console.error(`Response data: ${JSON.stringify(error.response?.data || {}, null, 2)}`);
    console.error(`Error message: ${error.message}`);
    
    // Provide troubleshooting tips
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify WISE_CLIENT_SECRET is correct in your .env file');
    console.log('2. Check if your IP address is allowed to access the Wise API');
    console.log('3. Ensure your API credentials have access to the comparison endpoint');
  }
}

// Function to test our internal API
async function testInternalWiseApi() {
  console.log('\nTesting Internal Wise API Endpoint...');
  
  try {
    // This assumes you're running the server on localhost port 10000
    const url = `http://localhost:${process.env.PORT || 10000}/api/wise-compare?fromCurrency=${sourceCurrency}&toCurrency=${targetCurrency}&amount=${sendAmount}`;
    
    console.log(`Making request to: ${url}`);
    const response = await axios.get(url);
    
    if (response.data && response.data.success) {
      console.log('\nInternal API Call Successful! ✅');
      console.log(`Received ${response.data.count} providers`);
      
      // Print basic provider information
      response.data.data.forEach((provider, index) => {
        console.log(`\nProvider ${index + 1}: ${provider.providerName}`);
        console.log(`  Rate: ${provider.effectiveRate}`);
        console.log(`  Fee: ${provider.transferFee}`);
        console.log(`  Received Amount: ${provider.amountReceived}`);
        console.log(`  Transfer Time: ${provider.transferTime}`);
      });
    } else {
      console.log('Internal API call unsuccessful.');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('\nError connecting to internal API! ❌');
    console.error(`Status: ${error.response?.status}`);
    console.error(`Response data: ${JSON.stringify(error.response?.data || {}, null, 2)}`);
    console.error(`Error message: ${error.message}`);
    
    // Provide troubleshooting tips
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your server is running');
    console.log('2. Check if the /api/wise-compare endpoint is registered correctly');
    console.log('3. Verify that your Wise API credentials are configured properly in .env');
  }
}

// Run the tests
async function runTests() {
  try {
    await testDirectWiseApi();
    await testInternalWiseApi();
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

runTests(); 