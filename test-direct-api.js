require('dotenv').config();
const axios = require('axios');

async function testPair(fromCurrency, toCurrency, amount) {
  try {
    console.log(`\n===== Testing ${fromCurrency} to ${toCurrency} =====`);
    
    const response = await axios.get(`http://localhost:5000/api/rates/compare`, {
      params: { fromCurrency, toCurrency, amount }
    });
    
    console.log('API Response Status:', response.status);
    
    if (response.data.data && response.data.data.length === 0) {
      console.log('API returned success but with empty data array - no providers available');
    } else if (response.data.data && response.data.data.length > 0) {
      console.log(`API returned ${response.data.data.length} providers:`);
      response.data.data.forEach(provider => {
        console.log(`- ${provider.providerName}: ${provider.effectiveRate} (${provider.amountReceived} ${toCurrency})`);
      });
    }
    
  } catch (error) {
    console.error(`Error testing ${fromCurrency} to ${toCurrency}:`, error.message);
  }
}

async function testApi() {
  try {
    console.log('Testing direct API calls to endpoint with various currency pairs...');
    
    const amount = 1000;
    
    // Try several currency pairs to find if any work
    await testPair('USD', 'EUR', amount);
    await testPair('GBP', 'EUR', amount);
    await testPair('EUR', 'USD', amount);
    await testPair('USD', 'GBP', amount);
    
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
}

testApi(); 