const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

console.log('==========================================================');
console.log('            WISE API AUTHORIZATION TEST TOOL              ');
console.log('==========================================================');

// First check if .env file exists
const envPath = path.resolve('.env');
console.log(`Checking for .env file at: ${envPath}`);

try {
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file found');
    
    // Check if WISE_CLIENT_SECRET is in the file
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasWiseSecret = envContent.includes('WISE_CLIENT_SECRET=');
    
    if (hasWiseSecret) {
      console.log('✅ WISE_CLIENT_SECRET entry found in .env file');
      
      // Check if it has a value after the equals sign
      const match = envContent.match(/WISE_CLIENT_SECRET=(.*)/);
      if (match && match[1] && match[1].trim().length > 0) {
        console.log('✅ WISE_CLIENT_SECRET has a value in .env file');
      } else {
        console.error('❌ WISE_CLIENT_SECRET is in the .env file but has no value');
      }
    } else {
      console.error('❌ WISE_CLIENT_SECRET entry not found in .env file');
    }
  } else {
    console.error('❌ .env file not found');
  }
} catch (error) {
  console.error('Error checking .env file:', error);
}

// Load environment variables
console.log('\nLoading environment variables with dotenv...');
dotenv.config();

// Check if WISE_CLIENT_SECRET was loaded into process.env
if (!process.env.WISE_CLIENT_SECRET) {
  console.error('❌ ERROR: WISE_CLIENT_SECRET is not set in environment variables after loading .env');
  console.error('This might be because:');
  console.error('1. The .env file isn\'t being properly loaded');
  console.error('2. The WISE_CLIENT_SECRET value isn\'t set in the .env file');
  console.error('3. There\'s an issue with the dotenv package');
  process.exit(1);
}

// Log the first few characters of the token for verification (without revealing the full token)
const token = process.env.WISE_CLIENT_SECRET;
console.log(`✅ Token loaded: ${token.substring(0, 4)}...${token.substring(token.length - 4)} (length: ${token.length})`);

// API endpoints to test
const endpoints = [
  {
    name: 'Current Rate',
    url: 'https://api.wise.com/v1/rates?source=EUR&target=USD',
    method: 'GET'
  },
  {
    name: 'Historical Rate',
    url: 'https://api.wise.com/v1/rates?source=GBP&target=USD&time=2023-01-01T12:00:00Z',
    method: 'GET'
  },
  {
    name: 'Historical Rates Range',
    url: 'https://api.wise.com/v1/rates?source=USD&target=EUR&from=2023-01-01T00:00:00Z&to=2023-01-31T23:59:59Z&group=day',
    method: 'GET'
  }
];

// Test each endpoint
const testEndpoints = async () => {
  console.log('\nStarting Wise API authorization tests...\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name} endpoint: ${endpoint.url}`);
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WISE_CLIENT_SECRET}`
      };

      console.log('Request headers:', JSON.stringify({
        'Accept': headers.Accept,
        'Content-Type': headers['Content-Type'],
        'Authorization': 'Bearer [REDACTED]'
      }, null, 2));
      
      const startTime = Date.now();
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        headers
      });
      const duration = Date.now() - startTime;
      
      console.log(`✅ SUCCESS: ${endpoint.name} - Status: ${response.status} (${duration}ms)`);
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          console.log(`   Received ${response.data.length} items`);
          if (response.data.length > 0) {
            console.log('   Sample data:', JSON.stringify(response.data[0], null, 2));
          }
        } else {
          console.log('   Response data:', JSON.stringify(response.data, null, 2));
        }
      }
    } catch (error) {
      console.error(`❌ ERROR: ${endpoint.name} test failed`);
      
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Response data:`, error.response.data);
        
        // Check for specific auth errors
        if (error.response.status === 401) {
          console.error('\n🔑 AUTHENTICATION ERROR: Your token is invalid or expired');
          console.error('   Please verify your WISE_CLIENT_SECRET is correct and not expired.');
          console.error(`   Token prefix/suffix: ${token.substring(0, 4)}...${token.substring(token.length - 4)}`);
        } else if (error.response.status === 403) {
          console.error('\n🔒 AUTHORIZATION ERROR: Your token does not have permission for this endpoint');
          console.error('   Please check if your API token has the correct permissions.');
        }
      } else if (error.request) {
        console.error('   No response received from server. Network issue?');
      } else {
        console.error('   Error message:', error.message);
      }
    }
    
    console.log('\n' + '-'.repeat(60) + '\n');
  }
};

// Run the tests
testEndpoints()
  .then(() => {
    console.log('All tests completed.');
    console.log('If any tests failed, please check your WISE_CLIENT_SECRET and API permissions.');
    console.log('\nCommon solutions:');
    console.log('1. Generate a new API token from the Wise Developer Portal (https://wise.com/settings/api-tokens)');
    console.log('2. Make sure your token has permissions for the Rates API');
    console.log('3. Check if the token has expired');
    console.log('4. Verify the token is correctly set in your .env file');
    console.log('\nTo update your token, run: node refresh-wise-token.js');
  })
  .catch(error => {
    console.error('Test script failed:', error);
  }); 