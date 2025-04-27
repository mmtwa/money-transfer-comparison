// provider-gatherer.js
const axios = require('axios');

async function gatherAllProviderCodes() {
  console.log('Starting provider code gathering...');
  
  // List of common currencies to test with (reduced list to minimize API calls)
  const currencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'NZD', 
    'ZAR', 'INR', 'SGD', 'HKD', 'SEK', 'NOK'
  ];
  
  // The standard test amount
  const amount = 1000;
  
  // Your API base URL - update this with your actual API URL
  const apiBaseUrl = 'https://www.mymoneytransfers.com/api';
  
  // Get our existing provider map from the ProviderCard component
  const existingMap = {
    'wise': 'https://www.wise.com',
    'transferwise': 'https://www.wise.com',
    'xe': 'https://www.xe.com',
    'westernunion': 'https://www.westernunion.com',
    'moneygram': 'https://www.moneygram.com',
    'paypal': 'https://www.paypal.com',
    'ofx': 'https://www.ofx.com',
    'remitly': 'https://www.remitly.com',
    'currencyfair': 'https://www.currencyfair.com',
    'worldremit': 'https://www.worldremit.com',
    'ria': 'https://www.riamoneytransfer.com',
    'azimo': 'https://www.azimo.com',
    'transfergo': 'https://www.transfergo.com',
    'worldfirst': 'https://www.worldfirst.com',
    'instarem': 'https://www.instarem.com',
    'skrill': 'https://www.skrill.com',
    'revolut': 'https://www.revolut.com'
  };
  
  // Create set to track all found provider codes
  const allProviderCodes = new Set(Object.keys(existingMap));
  // Map to store codes without URLs
  const newProviders = {};
  
  // Track progress
  let totalPairs = currencies.length * currencies.length - currencies.length; // Exclude same currency pairs
  let processedPairs = 0;
  
  // Function to make direct API calls using axios
  async function fetchExchangeRates(fromCurrency, toCurrency, amount) {
    try {
      const url = `${apiBaseUrl}/rates/compare?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error in fetchExchangeRates: ${error.message}`);
      return { success: false };
    }
  }
  
  async function fetchWiseComparison(fromCurrency, toCurrency, amount, sourceCountry, targetCountry) {
    try {
      let url = `${apiBaseUrl}/wise/compare?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`;
      if (sourceCountry) url += `&sourceCountry=${sourceCountry}`;
      if (targetCountry) url += `&targetCountry=${targetCountry}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error in fetchWiseComparison: ${error.message}`);
      return { success: false };
    }
  }
  
  // Loop through all currency pairs
  for (const fromCurrency of currencies) {
    for (const toCurrency of currencies) {
      // Skip same currency pairs
      if (fromCurrency === toCurrency) continue;
      
      try {
        console.log(`Testing ${fromCurrency} to ${toCurrency}...`);
        processedPairs++;
        
        // Call the API directly to get providers for this pair
        const response = await fetchExchangeRates(fromCurrency, toCurrency, amount);
        
        // Process main providers
        if (response && response.success && response.data) {
          const providers = response.data;
          if (Array.isArray(providers)) {
            providers.forEach(provider => {
              if (provider && provider.providerCode) {
                const code = provider.providerCode.toLowerCase();
                if (code && !allProviderCodes.has(code)) {
                  allProviderCodes.add(code);
                  newProviders[code] = `https://www.google.com/search?q=${encodeURIComponent(code)}+money+transfer`;
                  console.log(`Found new provider: ${code}`);
                }
              }
            });
          }
        }
        
        // Also try to fetch Wise comparison data which might have additional providers
        try {
          const comparisonResponse = await fetchWiseComparison(
            fromCurrency, 
            toCurrency, 
            amount,
            fromCurrency === 'GBP' ? 'GB' : null,
            toCurrency === 'EUR' ? 'DE' : null
          );
          
          if (comparisonResponse && comparisonResponse.success && 
              comparisonResponse.data && comparisonResponse.data.providers) {
            const wiseProviders = comparisonResponse.data.providers;
            
            if (Array.isArray(wiseProviders)) {
              wiseProviders.forEach(provider => {
                if (provider && provider.alias) {
                  const code = provider.alias.toLowerCase();
                  if (code && !allProviderCodes.has(code)) {
                    allProviderCodes.add(code);
                    newProviders[code] = `https://www.google.com/search?q=${encodeURIComponent(code)}+money+transfer`;
                    console.log(`Found new provider from Wise comparison: ${code}`);
                  }
                }
              });
            }
          }
        } catch (compError) {
          console.log(`Error getting Wise comparison for ${fromCurrency} to ${toCurrency}: ${compError.message}`);
        }
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show progress
        console.log(`Progress: ${processedPairs}/${totalPairs} (${Math.round(processedPairs/totalPairs*100)}%)`);
        
      } catch (error) {
        console.error(`Error fetching ${fromCurrency} to ${toCurrency}:`, error);
      }
    }
  }
  
  // Combine existing and new providers
  const combinedMap = { ...existingMap, ...newProviders };
  
  // Output the final results
  console.log('==== GATHERING COMPLETE ====');
  console.log(`Found ${allProviderCodes.size} unique provider codes`);
  console.log(`Added ${Object.keys(newProviders).length} new providers to the map`);
  
  // Format the new websiteMap as code you can copy-paste
  console.log('New websiteMap:');
  console.log('const websiteMap = {');
  Object.entries(combinedMap).forEach(([code, url], index, array) => {
    console.log(`  '${code}': '${url}'${index < array.length - 1 ? ',' : ''}`);
  });
  console.log('};');
  
  return combinedMap;
}

// Run the function
gatherAllProviderCodes().then(map => {
  console.log('Provider code gathering completed!');
}).catch(err => {
  console.error('Error gathering provider codes:', err);
});