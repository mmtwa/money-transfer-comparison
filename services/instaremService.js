/**
 * InstaReM API Service
 * Handles fetching and caching exchange rates from InstaReM
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// In-memory cache
const cache = {
  exchangeRates: {},
  timestamps: {}
};

// Cache timeout (2 minutes)
const CACHE_TIMEOUT = 2 * 60 * 1000;

/**
 * Get exchange rate information from InstaReM
 * @param {string} fromCurrency - Source currency code (e.g., 'GBP')
 * @param {string} toCurrency - Destination currency code (e.g., 'EUR')
 * @param {number} amount - Amount to convert
 * @param {string} countryCode - Country code (e.g., 'GB')
 * @param {string} bankId - Bank account ID (e.g., '90')
 * @returns {Promise<Object>} - Exchange rate information
 */
exports.getExchangeRate = async (fromCurrency, toCurrency, amount, countryCode = null, bankId = null) => {
  try {
    // Create cache key - don't include countryCode and bankId in the key since they're now optional
    const cacheKey = `${fromCurrency}-${toCurrency}-${amount}`;
    
    // Log detailed information about the request
    console.log(`[InstaReM] Processing exchange rate request for ${fromCurrency} to ${toCurrency}, amount: ${amount}, countryCode: ${countryCode || 'auto'}, bankId: ${bankId || 'auto'}`);
    
    // Check if we have a valid cached response
    if (
      cache.exchangeRates[cacheKey] && 
      cache.timestamps[cacheKey] && 
      (Date.now() - cache.timestamps[cacheKey]) < CACHE_TIMEOUT
    ) {
      console.log(`[InstaReM] Using cached exchange rate for ${fromCurrency} to ${toCurrency}`);
      return {
        success: true,
        cached: true,
        data: cache.exchangeRates[cacheKey]
      };
    }
    
    console.log(`[InstaReM] Fetching fresh exchange rate for ${fromCurrency} to ${toCurrency}`);
    
    // Use the InstaReM calculator script to get the rate
    const scriptPath = path.resolve(__dirname, '../scripts/scrapers/instarem/InstaReM-calculator.js');
    
    // Check if the script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`[InstaReM] Calculator script not found at ${scriptPath}`);
      return {
        success: false,
        error: `Calculator script not found at ${scriptPath}`
      };
    }
    
    const data = await runInstaRemCalculator(scriptPath, amount, fromCurrency, toCurrency, countryCode, bankId);
    
    // Cache the response
    cache.exchangeRates[cacheKey] = data;
    cache.timestamps[cacheKey] = Date.now();
    
    return {
      success: true,
      cached: false,
      data
    };
  } catch (error) {
    console.error(`[InstaReM] Error fetching exchange rate: ${error.message}`);
    
    // Provide more detailed error information
    let errorDetails = error.message;
    if (error.message.includes('computed‑value call failed')) {
      errorDetails = `InstaReM API rejected the request for ${fromCurrency} to ${toCurrency}. This may indicate this currency pair is not supported.`;
    } else if (error.message.includes('No payment methods returned')) {
      errorDetails = `No payment methods found for ${fromCurrency} to ${toCurrency}. This currency pair may not be supported by InstaReM.`;
    }
    
    return {
      success: false,
      error: errorDetails,
      originalError: error.message
    };
  }
};

/**
 * Formats InstaReM exchange rate data for the provider card
 * @param {Object} rateData - Exchange rate data from InstaReM
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {number} amount - Amount to convert
 * @returns {Object} - Formatted provider data
 */
exports.formatForProviderCard = (rateData, fromCurrency, toCurrency, amount) => {
  const { 'Exchange rate': exchangeRate, 'Total fee': fee, 'Delivery ETA': deliveryETA, 'Amount received': amountReceived } = rateData;
  
  // Calculate margin against mid-market rate (this is a placeholder - in production you'd compare with an actual mid-market rate)
  const marginPercentage = 0.5; // Placeholder, typically calculated based on mid-market rate
  
  return {
    providerId: 'provider-instarem',
    providerName: 'InstaReM',
    providerCode: 'instarem',
    providerLogo: '/images/providers/instarem.png',
    rate: parseFloat(exchangeRate),
    effectiveRate: parseFloat(exchangeRate),
    transferFee: parseFloat(fee),
    marginPercentage: marginPercentage,
    marginCost: (amount * marginPercentage) / 100,
    totalCost: parseFloat(fee) + ((amount * marginPercentage) / 100),
    amountReceived: parseFloat(amountReceived),
    transferTime: deliveryETA,
    transferTimeHours: parseDeliveryTime(deliveryETA),
    rating: 4.3,
    realTimeApi: true
  };
};

/**
 * Runs the InstaReM calculator script as a child process
 * @param {string} scriptPath - Path to the InstaReM calculator script
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Destination currency code
 * @param {string} countryCode - Country code
 * @param {string} bankId - Bank ID
 * @returns {Promise<Object>} - Exchange rate information
 */
function runInstaRemCalculator(scriptPath, amount, fromCurrency, toCurrency, countryCode, bankId) {
  return new Promise((resolve, reject) => {
    console.log(`Running InstaReM calculator with args: ${amount} ${fromCurrency} ${toCurrency} ${countryCode || ''} ${bankId || ''}`);
    
    // The script now expects arguments in this order: amount, sourceCurrency, destCurrency, [countryCode], [payMethodId]
    // If countryCode is not provided, the script will try to guess from the currency
    const args = [
      scriptPath,
      amount.toString(),
      fromCurrency,
      toCurrency
    ];
    
    // Only add countryCode and bankId if they're provided
    if (countryCode) {
      args.push(countryCode);
      if (bankId) {
        args.push(bankId);
      }
    }
    
    const process = spawn('node', args);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`[InstaReM Calculator Output]: ${data.toString()}`);
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`[InstaReM Calculator Error]: ${data.toString()}`);
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`InstaReM calculator exited with code ${code}: ${stderr}`));
      }
      
      try {
        console.log('Raw output from InstaReM calculator:', stdout);
        
        // Method 0: Look for JSON_OUTPUT format first (most reliable)
        const jsonOutputMatch = stdout.match(/JSON_OUTPUT: (.*)/);
        if (jsonOutputMatch && jsonOutputMatch[1]) {
          try {
            const jsonData = JSON.parse(jsonOutputMatch[1]);
            console.log('Successfully parsed using JSON_OUTPUT format:', jsonData);
            return resolve(jsonData);
          } catch (jsonError) {
            console.log('JSON_OUTPUT parsing failed:', jsonError);
            // Continue to other methods if this fails
          }
        }
        
        // Try multiple parsing methods to handle different console.table formats
        
        // Method 1: Standard regex for console.table format (original approach)
        const regex = /┌─+┬─+┬─+┐\n│([^│]+)│([^│]+)│\n├─+┼─+┼─+┤\n│([^│]+)│([^│]+)│\n│([^│]+)│([^│]+)│\n│([^│]+)│([^│]+)│\n│([^│]+)│([^│]+)│\n└─+┴─+┴─+┘/;
        const match = stdout.match(regex);
        
        if (match) {
          const result = {
            'Exchange rate': match[3].trim(),
            'Total fee': match[5].trim(),
            'Delivery ETA': match[7].trim(),
            'Amount received': match[9].trim()
          };
          
          console.log('Successfully parsed using method 1:', result);
          return resolve(result);
        }
        
        // Method 2: Windows-specific table format with different characters
        const windowsRegex = /╔═+╦═+╦═+╗\r?\n║([^║]+)║([^║]+)║\r?\n╠═+╬═+╬═+╣\r?\n║([^║]+)║([^║]+)║\r?\n║([^║]+)║([^║]+)║\r?\n║([^║]+)║([^║]+)║\r?\n║([^║]+)║([^║]+)║\r?\n╚═+╩═+╩═+╝/;
        const windowsMatch = stdout.match(windowsRegex);
        
        if (windowsMatch) {
          const result = {
            'Exchange rate': windowsMatch[3].trim(),
            'Total fee': windowsMatch[5].trim(),
            'Delivery ETA': windowsMatch[7].trim(),
            'Amount received': windowsMatch[9].trim()
          };
          
          console.log('Successfully parsed using method 2:', result);
          return resolve(result);
        }
        
        // Method 3: Look for specific keys in the output
        const lines = stdout.split(/\r?\n/); // Handle both Windows and Unix line endings
        const result = {};
        
        // Keys we're looking for
        const keys = ['Exchange rate', 'Total fee', 'Delivery ETA', 'Amount received'];
        
        // Try to find each key in the output
        for (const key of keys) {
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(key)) {
              // Look for a value on the same line or the next line
              const valueLine = lines[i].includes('│') || lines[i].includes('║') ?
                lines[i] : // Value is in the same line
                (i + 1 < lines.length ? lines[i + 1] : null); // Value is in the next line
              
              if (valueLine) {
                // Extract the value using regex
                const valueMatches = valueLine.match(/([\d.]+)/);
                if (valueMatches && valueMatches[1]) {
                  result[key] = valueMatches[1];
                  continue;
                }
                
                // If we couldn't extract with regex, try to get the value from the line
                const parts = valueLine
                  .split(/[│║]/)
                  .map(part => part.trim())
                  .filter(part => part);
                
                if (parts.length >= 2) {
                  // Assume value is in the second column
                  result[key] = parts[1];
                }
              }
            }
          }
        }
        
        if (Object.keys(result).length === keys.length) {
          console.log('Successfully parsed using method 3:', result);
          return resolve(result);
        }
        
        // Method 4: Parse JSON output
        try {
          // Look for JSON-like structure in the output
          const jsonMatch = stdout.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const jsonData = JSON.parse(jsonStr);
            
            if (jsonData && typeof jsonData === 'object') {
              console.log('Successfully parsed using method 4:', jsonData);
              return resolve(jsonData);
            }
          }
        } catch (jsonError) {
          console.log('JSON parsing failed:', jsonError);
        }
        
        // Method 5: Most flexible approach - extract numeric values
        // This will extract all numbers from the output and map them to the keys
        const allNumbers = stdout.match(/\d+(\.\d+)?/g);
        if (allNumbers && allNumbers.length >= 4) {
          // Assuming the numbers appear in a specific order
          const fallbackResult = {
            'Exchange rate': allNumbers[0],
            'Total fee': allNumbers[1],
            'Delivery ETA': 'n/a', // Can't reliably extract this
            'Amount received': allNumbers[allNumbers.length - 1] // Usually the last number
          };
          
          console.log('Successfully parsed using method 5:', fallbackResult);
          return resolve(fallbackResult);
        }
        
        // If all parsing methods fail
        return reject(new Error('Could not parse InstaReM calculator output. Raw output: ' + stdout));
      } catch (error) {
        console.error('Error parsing InstaReM calculator output:', error);
        reject(error);
      }
    });
  });
}

/**
 * Parse delivery time string into hours object
 * @param {string} deliveryETA - Delivery ETA string (e.g., "1-2 days")
 * @returns {Object} - Object with min and max hours
 */
function parseDeliveryTime(deliveryETA) {
  try {
    const etaLower = deliveryETA.toLowerCase();
    
    // Match patterns like "1-2 days", "24 hours", etc.
    const daysMatch = etaLower.match(/(\d+)(?:-(\d+))?\s*days?/);
    const hoursMatch = etaLower.match(/(\d+)(?:-(\d+))?\s*hours?/);
    
    if (daysMatch) {
      const minDays = parseInt(daysMatch[1], 10);
      const maxDays = daysMatch[2] ? parseInt(daysMatch[2], 10) : minDays;
      
      return {
        min: minDays * 24,
        max: maxDays * 24
      };
    }
    
    if (hoursMatch) {
      const minHours = parseInt(hoursMatch[1], 10);
      const maxHours = hoursMatch[2] ? parseInt(hoursMatch[2], 10) : minHours;
      
      return {
        min: minHours,
        max: maxHours
      };
    }
    
    // Default fallback for n/a or other formats
    return {
      min: 48,
      max: 72
    };
  } catch (error) {
    console.error(`[InstaReM] Error parsing delivery time: ${error.message}`);
    return {
      min: 48,
      max: 72
    };
  }
} 