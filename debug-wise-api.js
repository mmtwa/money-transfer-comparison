require('dotenv').config();
const axios = require('axios');
const wiseApiService = require('./services/wiseApiService');

async function debugWiseApi() {
  try {
    console.log('Debugging Wise API connection');
    console.log('---------------------------');
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('WISE_CLIENT_ID:', process.env.WISE_CLIENT_ID ? 'Set (hidden)' : 'NOT SET');
    console.log('WISE_CLIENT_SECRET:', process.env.WISE_CLIENT_SECRET ? 'Set (hidden)' : 'NOT SET');
    console.log('WISE_API_URL:', process.env.WISE_API_URL || 'NOT SET');
    
    // Get API config from service
    const apiConfig = wiseApiService.getApiConfig();
    console.log('\nAPI Configuration:');
    console.log('Client ID:', apiConfig.clientId ? 'Set (hidden)' : 'NOT SET');
    console.log('Client Secret:', apiConfig.clientSecret ? 'Set (hidden)' : 'NOT SET');
    console.log('API URL:', apiConfig.apiUrl || 'NOT SET');
    
    // Test if currency pair is supported
    const sourceCurrency = 'GBP';
    const targetCurrency = 'EUR';
    console.log(`\nChecking if ${sourceCurrency} to ${targetCurrency} is supported...`);
    
    const isSupported = await wiseApiService.isCurrencyPairSupported(sourceCurrency, targetCurrency);
    console.log('Currency pair supported:', isSupported);
    
    if (isSupported) {
      // Try to get exchange rate
      console.log('\nAttempting to fetch exchange rate...');
      try {
        const rate = await wiseApiService.getExchangeRate(sourceCurrency, targetCurrency, 1000);
        console.log('Exchange rate successfully fetched:');
        console.log(rate);
      } catch (rateError) {
        console.error('Error fetching exchange rate:', rateError.message);
        
        // Try to make a direct API call to diagnose
        console.log('\nAttempting direct API call...');
        try {
          const baseUrl = apiConfig.apiUrl || 'https://api.wise.com';
          const endpoint = '/v1/rates';
          const params = {
            source: sourceCurrency,
            target: targetCurrency
          };
          
          const headers = {
            'Authorization': `Bearer ${apiConfig.clientId}`,
            'Content-Type': 'application/json'
          };
          
          const response = await axios.get(`${baseUrl}${endpoint}`, { 
            params, 
            headers,
            timeout: 10000
          });
          
          console.log('Direct API call response:', response.data);
        } catch (directError) {
          console.error('Direct API call failed:', directError.message);
          
          if (directError.response) {
            console.log('Response status:', directError.response.status);
            console.log('Response data:', directError.response.data);
          }
        }
      }
    }
    
    console.log('\nWise API debugging complete');
  } catch (error) {
    console.error('Error during Wise API debugging:', error.message);
  }
}

debugWiseApi(); 