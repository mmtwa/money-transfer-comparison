require('dotenv').config();
const ofxApiService = require('./services/ofxApiService');

async function testOFXDirectAPI() {
  try {
    // Test credentials
    console.log('Testing OFX API credentials...');
    const testResult = await ofxApiService.testApiCredentials();
    
    console.log('Credentials test result:', testResult);
    
    if (!testResult.success) {
      console.error('OFX API credentials test failed. Please check your OFX_CLIENT_ID and OFX_CLIENT_SECRET environment variables.');
      return;
    }
    
    console.log('OFX API credentials are valid. Proceeding with exchange rate test.');
    
    // Test currency pairs
    const pairs = [
      { from: 'USD', to: 'AUD', amount: 1000 },
      { from: 'EUR', to: 'GBP', amount: 2000 },
      { from: 'GBP', to: 'USD', amount: 3000 },
      { from: 'AUD', to: 'CAD', amount: 5000 }
    ];
    
    // Test each currency pair
    for (const pair of pairs) {
      console.log(`\nTesting exchange rate for ${pair.from} to ${pair.to}, amount: ${pair.amount}`);
      
      try {
        // Clear any existing cache
        ofxApiService.clearCache(`ofx_rate_${pair.from}_${pair.to}_${pair.amount}`);
        
        // Get exchange rate
        const rateInfo = await ofxApiService.getExchangeRate(pair.from, pair.to, pair.amount);
        
        console.log('Exchange rate result:');
        console.log(JSON.stringify(rateInfo, null, 2));
        
        // Calculate summary
        const totalCost = pair.amount + rateInfo.fee;
        const effectiveRate = rateInfo.targetAmount / totalCost;
        
        console.log('\nSummary:');
        console.log(`Amount: ${pair.amount} ${pair.from}`);
        console.log(`Fee: ${rateInfo.fee} ${pair.from}`);
        console.log(`Total cost: ${totalCost} ${pair.from}`);
        console.log(`Rate: ${rateInfo.rate}`);
        console.log(`Amount received: ${rateInfo.targetAmount} ${pair.to}`);
        console.log(`Effective rate (including fees): ${effectiveRate}`);
        console.log(`Delivery time: ${rateInfo.deliveryTime}`);
        
      } catch (error) {
        console.error(`Error testing ${pair.from} to ${pair.to}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Error in OFX direct API test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

console.log('Starting OFX Direct API Test');
console.log('---------------------------');
console.log(`Using ${process.env.ENABLE_SANDBOX_MODE === 'true' ? 'SANDBOX' : 'PRODUCTION'} mode`);
console.log('Client ID:', process.env.OFX_CLIENT_ID);
console.log('---------------------------\n');

testOFXDirectAPI(); 