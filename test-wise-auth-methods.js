const axios = require('axios');

// Credentials provided by the user
const clientId = 'mymoneytransfers';
const clientKey = 'mymoneytransfers';
const clientSecret = 'c24c06aa-85eb-40bf-85a7-cbf87979bf61';

console.log('==========================================================');
console.log('           WISE API AUTHENTICATION METHOD TEST            ');
console.log('==========================================================');
console.log('Testing different authentication methods with Wise API...');

// Test endpoint - rates API
const testEndpoint = 'https://api.wise.com/v1/rates?source=EUR&target=USD';

// Test methods
const testMethods = async () => {
  // Method 1: Bearer token using clientSecret
  console.log('\n🔑 Testing Method 1: Bearer Token Authentication');
  console.log(`Using token: ${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}`);
  
  try {
    const bearerResponse = await axios({
      method: 'GET',
      url: testEndpoint,
      headers: {
        'Authorization': `Bearer ${clientSecret}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS: Bearer token authentication worked!');
    console.log(`Status: ${bearerResponse.status}`);
    if (bearerResponse.data && Array.isArray(bearerResponse.data) && bearerResponse.data.length > 0) {
      console.log('Sample data:', bearerResponse.data[0]);
    }
  } catch (error) {
    console.error('❌ ERROR: Bearer token authentication failed');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
  
  console.log('\n' + '-'.repeat(60));
  
  // Method 2: Basic Auth using clientId:clientKey
  console.log('\n🔑 Testing Method 2: Basic Authentication');
  console.log(`Using credentials: ${clientId}:${clientKey.substring(0, 2)}...`);
  
  try {
    // Create base64 encoded credentials
    const basicAuth = Buffer.from(`${clientId}:${clientKey}`).toString('base64');
    
    const basicResponse = await axios({
      method: 'GET',
      url: testEndpoint,
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS: Basic authentication worked!');
    console.log(`Status: ${basicResponse.status}`);
    if (basicResponse.data && Array.isArray(basicResponse.data) && basicResponse.data.length > 0) {
      console.log('Sample data:', basicResponse.data[0]);
    }
  } catch (error) {
    console.error('❌ ERROR: Basic authentication failed');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
  
  console.log('\n' + '-'.repeat(60));
  
  // Method 3: Basic Auth using clientId:clientSecret
  console.log('\n🔑 Testing Method 3: Basic Authentication with Secret');
  console.log(`Using credentials: ${clientId}:${clientSecret.substring(0, 2)}...`);
  
  try {
    // Create base64 encoded credentials
    const basicSecretAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const basicSecretResponse = await axios({
      method: 'GET',
      url: testEndpoint,
      headers: {
        'Authorization': `Basic ${basicSecretAuth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS: Basic authentication with secret worked!');
    console.log(`Status: ${basicSecretResponse.status}`);
    if (basicSecretResponse.data && Array.isArray(basicSecretResponse.data) && basicSecretResponse.data.length > 0) {
      console.log('Sample data:', basicSecretResponse.data[0]);
    }
  } catch (error) {
    console.error('❌ ERROR: Basic authentication with secret failed');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
  
  console.log('\n' + '-'.repeat(60));
  
  // Method 4: Try with sandbox API
  console.log('\n🔑 Testing Method 4: Sandbox API with Bearer Token');
  console.log(`Using token with sandbox: ${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}`);
  
  try {
    const sandboxResponse = await axios({
      method: 'GET',
      url: testEndpoint.replace('api.wise.com', 'api.sandbox.transferwise.tech'),
      headers: {
        'Authorization': `Bearer ${clientSecret}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS: Sandbox API authentication worked!');
    console.log(`Status: ${sandboxResponse.status}`);
    if (sandboxResponse.data && Array.isArray(sandboxResponse.data) && sandboxResponse.data.length > 0) {
      console.log('Sample data:', sandboxResponse.data[0]);
    }
  } catch (error) {
    console.error('❌ ERROR: Sandbox API authentication failed');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
  
  // Summary
  console.log('\n==========================================================');
  console.log('                       SUMMARY                            ');
  console.log('==========================================================');
  console.log('If any of the methods succeeded:');
  console.log('1. Update your wiseRatesService.js file to use the working method');
  console.log('2. Make sure to restart your server for changes to take effect');
  console.log('\nIf all methods failed:');
  console.log('1. Check if your Wise account has API access enabled');
  console.log('2. Generate a new token from Wise Developer Portal');
  console.log('3. Check if your Wise account has the necessary permissions');
};

// Run the tests
testMethods().catch(error => {
  console.error('Test script failed:', error);
}); 