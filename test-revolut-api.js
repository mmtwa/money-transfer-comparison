/**
 * Test script for the Revolut calculator
 * This script tests the Revolut calculator directly to ensure it works correctly
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration for the test
const testConfigs = [
  { amount: 1000, fromCurrency: 'GBP', toCurrency: 'EUR' },
  { amount: 2500, fromCurrency: 'USD', toCurrency: 'GBP' },
  { amount: 500, fromCurrency: 'EUR', toCurrency: 'USD' }
];

// Run the tests
async function runTests() {
  console.log('Testing Revolut calculator for BANK routes with STANDARD plans...');
  
  for (const config of testConfigs) {
    const { amount, fromCurrency, toCurrency } = config;
    
    console.log(`\nTest case: ${amount} ${fromCurrency} to ${toCurrency}`);
    
    try {
      const result = await runCalculator(amount, fromCurrency, toCurrency);
      console.log('Test result:', result);
      console.log(`Route: ${result.route}, Plan: ${result.plan}`);
      console.log(`Transfer Type: ${result.transfer_type || 'N/A'}`);
      console.log(`Estimated Delivery: ${result.estimate || 'N/A'}`);
    } catch (error) {
      console.error('Test failed:', error.message);
    }
    
    // Add a small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run the Revolut calculator script as a child process
function runCalculator(amount, fromCurrency, toCurrency) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, 'scripts/scrapers/revolut/revolut-calculator.js');
    
    console.log(`Running: node ${scriptPath} ${amount} ${fromCurrency} ${toCurrency}`);
    
    const process = spawn('node', [
      scriptPath,
      amount.toString(),
      fromCurrency,
      toCurrency
    ]);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Calculator exited with code ${code}: ${stderr}`));
      }
      
      try {
        const jsonOutputMatch = stdout.match(/JSON_OUTPUT: (.*)/);
        if (jsonOutputMatch && jsonOutputMatch[1]) {
          const jsonData = JSON.parse(jsonOutputMatch[1]);
          return resolve(jsonData);
        } else {
          return reject(new Error('Could not find JSON_OUTPUT in calculator response'));
        }
      } catch (error) {
        return reject(new Error(`Error parsing calculator output: ${error.message}`));
      }
    });
  });
}

// Run the tests
runTests()
  .then(() => console.log('\nAll tests completed'))
  .catch(error => console.error('Test suite error:', error)); 