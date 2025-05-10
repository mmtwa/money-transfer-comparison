require('dotenv').config();
const axios = require('axios');

async function testCompareApi() {
  try {
    // Define test parameters
    const fromCurrency = 'USD';
    const toCurrency = 'AUD';
    const amount = 1000;
    
    console.log(`Testing /api/wise/compare endpoint with ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
    
    // Make the API request to the wise/compare endpoint instead of rates/compare
    const response = await axios.get(`http://localhost:${process.env.PORT || 10000}/api/wise/compare`, {
      params: {
        fromCurrency,
        toCurrency,
        amount
      }
    });
    
    // Check if the request was successful
    if (response.status === 200 && response.data.success) {
      console.log('API request successful!');
      console.log(`Retrieved ${response.data.data.providers?.length || 0} provider results`);
      
      // Check if OFX is present in the Wise comparison response
      const ofxProvider = response.data.data.providers?.find(provider => 
        (provider.name && provider.name.toLowerCase().includes('ofx')) || 
        (provider.alias && provider.alias.toLowerCase().includes('ofx'))
      );
      
      if (ofxProvider) {
        console.log('OFX Provider found in Wise comparison results:');
        console.log(JSON.stringify(ofxProvider, null, 2));
      } else {
        console.log('OFX Provider not found in Wise comparison results - this is expected and good');
      }
      
      // Now try the rates/compare endpoint
      console.log('\nTesting /api/ofx/compare endpoint...');
      const ratesResponse = await axios.get(`http://localhost:${process.env.PORT || 10000}/api/ofx/compare`, {
        params: {
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          amount: 1000
        }
      });
      
      if (ratesResponse.status === 200 && ratesResponse.data.success) {
        console.log('Rates API request successful!');
        console.log(`Retrieved ${ratesResponse.data.count} provider results`);
        
        // Print all provider names to see what's included
        const providers = ratesResponse.data.data.map(provider => provider.providerName);
        console.log('Providers included in results:', providers.join(', '));
        
        // Check specifically for OFX
        const ratesOfxProvider = ratesResponse.data.data.find(provider => 
          provider.providerName.toLowerCase().includes('ofx') || 
          provider.providerCode.toLowerCase().includes('ofx')
        );
        
        if (ratesOfxProvider) {
          console.log('OFX Provider found in rates/compare results:');
          console.log(JSON.stringify(ratesOfxProvider, null, 2));
        } else {
          console.error('OFX Provider not found in rates/compare results!');
        }
      } else {
        console.error('Rates API request failed or returned an error');
        console.error('Response:', ratesResponse.data);
      }
      
    } else {
      console.error('API request failed or returned an error');
      console.error('Response:', response.data);
    }
    
  } catch (error) {
    console.error('Error making API request:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  }
}

testCompareApi().then(() => console.log('Test complete')); 