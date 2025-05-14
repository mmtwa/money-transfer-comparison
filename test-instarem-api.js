// Test script for InstaReM calculator
const { spawn } = require('child_process');
const path = require('path');

async function testInstaRemCalculator() {
  console.log('Testing InstaReM calculator with USD to AUD...');
  
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, 'scripts/scrapers/instarem/InstaReM-calculator.js');
    console.log(`Script path: ${scriptPath}`);
    
    const amount = '1000';
    const fromCurrency = 'USD';
    const toCurrency = 'AUD';
    
    const process = spawn('node', [
      scriptPath,
      amount,
      fromCurrency,
      toCurrency
    ]);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log(`[OUTPUT]: ${output}`);
    });
    
    process.stderr.on('data', (data) => {
      const error = data.toString();
      stderr += error;
      console.error(`[ERROR]: ${error}`);
    });
    
    process.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
      
      if (code !== 0) {
        return reject(new Error(`InstaReM calculator exited with code ${code}: ${stderr}`));
      }
      
      resolve(stdout);
    });
  });
}

// Run the test
testInstaRemCalculator()
  .then(output => {
    console.log('Test completed successfully');
    
    // Try to extract the JSON output
    const jsonOutputMatch = output.match(/JSON_OUTPUT: (.*)/);
    if (jsonOutputMatch && jsonOutputMatch[1]) {
      try {
        const jsonData = JSON.parse(jsonOutputMatch[1]);
        console.log('Parsed JSON data:', jsonData);
      } catch (jsonError) {
        console.error('JSON parsing failed:', jsonError);
      }
    } else {
      console.log('Could not find JSON_OUTPUT in the output');
    }
  })
  .catch(error => {
    console.error('Test failed:', error);
  }); 