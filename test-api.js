require('dotenv').config();
const providerService = require('./services/providerService');

async function testApi() {
  try {
    console.log('Testing providerService directly...');
    
    // First check if we can initialize properly
    await providerService.initialize();
    
    console.log('Providers after initialization:', Object.keys(providerService.providers));
    
    if (Object.keys(providerService.providers).length === 0) {
      console.error('No providers found, initialization of default provider may have failed');
    } else {
      console.log('Default/loaded providers:', 
        Object.values(providerService.providers).map(p => ({
          name: p.name, 
          apiHandler: p.apiHandler,
          apiEnabled: p.apiEnabled
        }))
      );
    }
    
    // Test getting exchange rates directly
    console.log('Testing getExchangeRates for GBP to EUR...');
    const rates = await providerService.getExchangeRates('GBP', 'EUR', 1000);
    
    console.log(`Got ${rates.length} provider rates`);
    console.log('Rates:', rates);
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testApi(); 