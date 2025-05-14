// Test script for InstaReM API endpoint
const http = require('http');

async function testInstaRemEndpoint(fromCurrency, toCurrency, amount) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:10000/api/instarem/compare?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`;
    console.log(`Requesting: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      // Log status code
      console.log(`Status code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP error: ${res.statusCode} ${data}`));
          }
          
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

// Test a few currency pairs
async function runTests() {
  try {
    console.log('Testing GBP to EUR with GB country code...');
    const gbpEurResult = await testInstaRemEndpoint('GBP', 'EUR', 1000);
    console.log('GBP to EUR result:', JSON.stringify(gbpEurResult, null, 2));
    
    console.log('\nTesting USD to AUD with US country code...');
    const url = `http://localhost:10000/api/instarem/compare?fromCurrency=USD&toCurrency=AUD&amount=1000&countryCode=US`;
    console.log(`Requesting: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`USD to AUD result with US country code:`, data);
        
        // Continue with Euro to USD test
        testEurToUsd();
      });
    }).on('error', (e) => {
      console.error(`Error testing USD to AUD: ${e.message}`);
      testEurToUsd();
    });
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Separate function to test EUR to USD
async function testEurToUsd() {
  try {
    console.log('\nTesting EUR to USD with IE country code...');
    const url = `http://localhost:10000/api/instarem/compare?fromCurrency=EUR&toCurrency=USD&amount=1000&countryCode=IE`;
    console.log(`Requesting: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`EUR to USD result with IE country code:`, data);
        
        // Continue with MYR to EUR test
        testMyrToEur();
      });
    }).on('error', (e) => {
      console.error(`Error testing EUR to USD: ${e.message}`);
      testMyrToEur(); // Still try MYR to EUR even if EUR to USD fails
    });
  } catch (error) {
    console.error('Test EUR to USD failed:', error.message);
    testMyrToEur(); // Still try MYR to EUR even if EUR to USD fails
  }
}

// Separate function to test MYR to EUR
async function testMyrToEur() {
  try {
    console.log('\nTesting MYR to EUR with MY country code...');
    const url = `http://localhost:10000/api/instarem/compare?fromCurrency=MYR&toCurrency=EUR&amount=1000&countryCode=MY`;
    console.log(`Requesting: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`MYR to EUR result with MY country code:`, data);
      });
    }).on('error', (e) => {
      console.error(`Error testing MYR to EUR: ${e.message}`);
    });
  } catch (error) {
    console.error('Test MYR to EUR failed:', error.message);
  }
}

runTests(); 