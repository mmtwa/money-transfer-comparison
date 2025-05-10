require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const PORT = process.env.PORT || 5000;

async function testOFXEndpoints() {
  try {
    console.log(`Testing OFX API endpoints on http://localhost:${PORT}/api`);
    
    // Test parameters
    const fromCurrency = 'USD';
    const toCurrency = 'AUD';
    const amount = 1000;
    
    // Test /api/ofx/compare endpoint
    console.log('\n1. Testing /api/ofx/compare endpoint:');
    console.log(`GET /api/ofx/compare?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`);
    
    try {
      const compareResponse = await axios.get(`${API_BASE_URL}/ofx/compare`, {
        params: {
          fromCurrency,
          toCurrency,
          amount
        }
      });
      
      console.log('Response status:', compareResponse.status);
      console.log('Providers returned:', compareResponse.data.length);
      
      // Check if OFX provider is in the results
      const ofxProvider = compareResponse.data.find(provider => 
        provider.providerName.toLowerCase().includes('ofx')
      );
      
      if (ofxProvider) {
        console.log('OFX Provider found in results:');
        console.log('- Provider ID:', ofxProvider.providerId);
        console.log('- Provider Name:', ofxProvider.providerName);
        console.log('- Exchange Rate:', ofxProvider.effectiveRate);
        console.log('- Fee:', ofxProvider.transferFee);
        console.log('- Delivery Time:', ofxProvider.transferTime);
      } else {
        console.error('OFX Provider not found in results!');
      }
    } catch (error) {
      console.error('Error testing /api/ofx/compare endpoint:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
    
    // Test /api/ofx/direct-rate endpoint
    console.log('\n2. Testing /api/ofx/direct-rate endpoint:');
    console.log(`GET /api/ofx/direct-rate?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`);
    
    try {
      const directResponse = await axios.get(`${API_BASE_URL}/ofx/direct-rate`, {
        params: {
          fromCurrency,
          toCurrency,
          amount
        }
      });
      
      console.log('Response status:', directResponse.status);
      console.log('Response data:');
      console.log(JSON.stringify(directResponse.data, null, 2));
    } catch (error) {
      console.error('Error testing /api/ofx/direct-rate endpoint:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('Error in OFX endpoint test:', error.message);
  }
}

console.log('Starting OFX Endpoint Test');
console.log('-------------------------');
console.log(`API Base URL: ${API_BASE_URL}`);
console.log('Please make sure the server is running!');
console.log('If not, start it with: npm run dev');
console.log('-------------------------\n');

testOFXEndpoints(); 