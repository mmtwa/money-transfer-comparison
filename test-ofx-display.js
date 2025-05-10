require('dotenv').config();
const mongoose = require('mongoose');
const providerService = require('./services/providerService');

async function testProviders() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Initialize the provider service
    console.log('Initializing provider service...');
    await providerService.initialize();
    console.log('Provider service initialized');
    
    // Get a list of active providers
    console.log('Getting active providers...');
    const providers = await providerService.getActiveProviders();
    console.log('Active providers:', providers.map(p => p.name).join(', '));
    
    // Check for OFX specifically
    const ofxProvider = providers.find(p => 
      p.name.toLowerCase().includes('ofx')
    );
    
    if (ofxProvider) {
      console.log('OFX Provider found in active providers:', ofxProvider.name);
    } else {
      console.error('OFX Provider not found in active providers list!');
    }
    
    // Test a rates query with OFX
    console.log('\nTesting exchange rates with USD to AUD...');
    const fromCurrency = 'USD';
    const toCurrency = 'AUD';
    const amount = 1000;
    
    // Clear cache to force fresh rates
    await providerService.clearCache(fromCurrency, toCurrency);
    
    // Get exchange rates
    const results = await providerService.getExchangeRates(fromCurrency, toCurrency, amount);
    console.log(`Got ${results.length} provider results`);
    
    // Check if OFX is in the results
    const ofxResult = results.find(r => 
      r.provider.name.toLowerCase().includes('ofx')
    );
    
    if (ofxResult) {
      console.log('OFX Provider found in exchange rate results:');
      console.log(JSON.stringify(ofxResult, null, 2));
    } else {
      console.error('OFX Provider not found in exchange rate results!');
    }
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    try {
      // Try to close the MongoDB connection in case of error
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError.message);
    }
  }
}

testProviders().then(() => console.log('Test complete')); 