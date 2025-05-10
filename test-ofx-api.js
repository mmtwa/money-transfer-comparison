require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const providerService = require('./services/providerService');

async function testOFXAPI() {
  try {
    // Step 1: Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Step 2: Initialize provider service
    console.log('Initializing provider service...');
    await providerService.initialize();
    console.log('Provider service initialized');

    // Test currency pair and amount
    const fromCurrency = 'USD';
    const toCurrency = 'AUD';
    const amount = 1000;

    // Step 3: Clear the cache to force fetching fresh rates
    console.log('Clearing cache to fetch fresh rates...');
    await providerService.clearCache(fromCurrency, toCurrency);

    console.log(`Getting exchange rates for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
    
    // Step 4: Test getting exchange rates (this will use all available providers)
    const results = await providerService.getExchangeRates(fromCurrency, toCurrency, amount);
    
    console.log('Exchange rate results:');
    console.log(JSON.stringify(results, null, 2));

    // Step 5: Transform to frontend format to verify compatibility
    console.log('Transforming to frontend format...');
    const frontendResults = results.map(result => ({
      providerId: result.provider.id,
      providerCode: result.provider.name.toLowerCase().replace(/\s+/g, ''),
      providerName: result.provider.name,
      providerLogo: result.provider.logo,
      baseRate: result.rate * 1.005, // Adding a small margin to get the base rate
      effectiveRate: result.rate,
      transferFee: result.transferFee,
      marginPercentage: 0.5, // Example value
      marginCost: amount * (result.rate * 1.005 - result.rate), // Calculation based on margin
      totalCost: result.totalCost,
      amountReceived: result.amountReceived,
      transferTimeHours: { min: 1, max: 48 }, // Example value
      transferTime: result.deliveryTime,
      rating: result.provider.rating,
      methods: result.methods,
      realTimeApi: true,
      timestamp: new Date().toISOString()
    }));

    console.log('Frontend format results:');
    console.log(JSON.stringify(frontendResults, null, 2));

    // Step 6: Check if OFX is included in the results
    const ofxProvider = frontendResults.find(provider => 
      provider.providerName.toLowerCase().includes('ofx') || 
      provider.providerCode.toLowerCase().includes('ofx')
    );

    if (ofxProvider) {
      console.log('OFX Provider found in results:', ofxProvider.providerName);
    } else {
      console.error('OFX Provider not found in results');
    }

    // Disconnect from MongoDB
    console.log('Disconnecting from MongoDB...');
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testOFXAPI(); 