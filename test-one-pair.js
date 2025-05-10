require('dotenv').config();
const axios = require('axios');

async function testPair() {
  try {
    const fromCurrency = 'GBP';
    const toCurrency = 'EUR';
    const amount = 1000;
    
    console.log(`Testing ${fromCurrency} to ${toCurrency} conversion...`);
    
    // Fetch all providers from the API
    console.log(`Fetching providers for ${fromCurrency} to ${toCurrency}...`);
    const response = await axios.get(`http://localhost:5000/api/ofx/compare`, {
      params: {
        fromCurrency,
        toCurrency,
        amount
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testPair(); 