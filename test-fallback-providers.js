require('dotenv').config();
const providerService = require('./services/providerService');

async function testFallbackProviders() {
  try {
    console.log('Testing Fallback Providers');
    console.log('=========================');

    // Initialize the provider service
    await providerService.initialize();
    
    // Get all available providers
    const providers = providerService.getProviders();
    console.log(`Total providers available: ${providers.length}`);
    
    // List all providers
    console.log('\nAvailable providers:');
    providers.forEach(provider => {
      console.log(`- ${provider.name} (ID: ${provider.id})`);
    });

    // Test currency conversion with each provider
    const fromCurrency = 'GBP';
    const toCurrency = 'EUR';
    const amount = 1000;
    
    console.log(`\nTesting ${fromCurrency} → ${toCurrency} conversion (amount: ${amount})`);
    console.log('------------------------------------------------');

    // Test each provider individually
    for (const provider of providers) {
      console.log(`\nTesting provider: ${provider.name}`);
      try {
        const rate = await providerService.getExchangeRate(
          provider.id,
          fromCurrency,
          toCurrency,
          amount
        );
        
        if (rate) {
          console.log(`✓ Success: ${provider.name}`);
          console.log(`  Rate: ${rate.rate}`);
          console.log(`  Converted amount: ${rate.convertedAmount}`);
          console.log(`  Fee: ${rate.fee || 'N/A'}`);
          console.log(`  Total cost: ${rate.totalCost || 'N/A'}`);
        } else {
          console.log(`✗ Failed: ${provider.name} - No rate returned`);
        }
      } catch (error) {
        console.log(`✗ Failed: ${provider.name} - ${error.message}`);
      }
    }

    // Test fallback mechanism
    console.log('\n\nTesting Fallback Mechanism');
    console.log('========================');
    try {
      const result = await providerService.getExchangeRateWithFallback(
        fromCurrency,
        toCurrency,
        amount
      );
      
      if (result) {
        console.log('✓ Fallback mechanism successful');
        console.log(`  Provider used: ${result.provider}`);
        console.log(`  Rate: ${result.rate}`);
        console.log(`  Converted amount: ${result.convertedAmount}`);
      } else {
        console.log('✗ Fallback mechanism failed - No result returned');
      }
    } catch (error) {
      console.log(`✗ Fallback mechanism failed: ${error.message}`);
    }
    
    console.log('\nFallback provider testing complete');
  } catch (error) {
    console.error('Error during fallback provider testing:', error.message);
  }
}

testFallbackProviders(); 