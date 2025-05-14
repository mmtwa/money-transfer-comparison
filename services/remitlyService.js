/**
 * Remitly API Service
 * Handles fetching and caching exchange rates from Remitly
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// In-memory cache
const cache = {
  exchangeRates: {},
  timestamps: {}
};

// Cache timeout (5 minutes)
const CACHE_TIMEOUT = 2 * 60 * 1000;

/**
 * Get exchange rate information from Remitly
 * @param {string} fromCurrency - Source currency code (e.g., 'GBP')
 * @param {string} toCurrency - Destination currency code (e.g., 'EUR')
 * @param {number} amount - Amount to convert
 * @param {string} sourceCountry - Source country code (e.g., 'GBR')
 * @param {string} destCountry - Destination country code (e.g., 'FRA')
 * @returns {Promise<Object>} - Exchange rate information
 */
exports.getExchangeRate = async (fromCurrency, toCurrency, amount, sourceCountry = null, destCountry = null) => {
  try {
    // Create cache key - don't include countries in the key since they're optional
    const cacheKey = `${fromCurrency}-${toCurrency}-${amount}`;
    
    // Log detailed information about the request
    console.log(`[Remitly] Processing exchange rate request for ${fromCurrency} to ${toCurrency}, amount: ${amount}, sourceCountry: ${sourceCountry || 'auto'}, destCountry: ${destCountry || 'auto'}`);
    
    // Check if we have a valid cached response
    if (
      cache.exchangeRates[cacheKey] && 
      cache.timestamps[cacheKey] && 
      (Date.now() - cache.timestamps[cacheKey]) < CACHE_TIMEOUT
    ) {
      console.log(`[Remitly] Using cached exchange rate for ${fromCurrency} to ${toCurrency}`);
      return {
        success: true,
        cached: true,
        data: cache.exchangeRates[cacheKey]
      };
    }
    
    console.log(`[Remitly] Fetching fresh exchange rate for ${fromCurrency} to ${toCurrency}`);
    
    // Use the Remitly calculator script to get the rate
    const scriptPath = path.resolve(__dirname, '../scripts/scrapers/remitly/remitly-calculator.js');
    
    // Check if the script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`[Remitly] Calculator script not found at ${scriptPath}`);
      return {
        success: false,
        error: `Calculator script not found at ${scriptPath}`
      };
    }
    
    const data = await runRemitlyCalculator(scriptPath, amount, fromCurrency, toCurrency, sourceCountry, destCountry);
    
    // Cache the response
    cache.exchangeRates[cacheKey] = data;
    cache.timestamps[cacheKey] = Date.now();
    
    return {
      success: true,
      cached: false,
      data
    };
  } catch (error) {
    console.error(`[Remitly] Error fetching exchange rate: ${error.message}`);
    
    // Provide more detailed error information
    let errorDetails = error.message;
    if (error.message.includes('HTTP') && error.message.includes('fetching estimate')) {
      errorDetails = `Remitly API rejected the request for ${fromCurrency} to ${toCurrency}. This may indicate this currency pair is not supported.`;
    } else if (error.message.includes('Malformed response')) {
      errorDetails = `Invalid response from Remitly API for ${fromCurrency} to ${toCurrency}. This currency pair may not be supported.`;
    }
    
    return {
      success: false,
      error: errorDetails,
      originalError: error.message
    };
  }
};

/**
 * Formats Remitly exchange rate data for the provider card
 * @param {Object} rateData - Exchange rate data from Remitly
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {number} amount - Amount to convert
 * @returns {Object} - Formatted provider data
 */
exports.formatForProviderCard = (rateData, fromCurrency, toCurrency, amount) => {
  const { exchange_rate, total_fee, amount_received, promo_base_delta } = rateData;
  
  // Calculate margin against mid-market rate if we have promo_base_delta
  const marginPercentage = promo_base_delta !== 'n/a' ? 
    (parseFloat(promo_base_delta) / parseFloat(exchange_rate)) * 100 : 
    0.5; // Fallback placeholder
  
  return {
    providerId: 'provider-remitly',
    providerName: 'Remitly',
    providerCode: 'remitly',
    providerLogo: '/images/providers/remitly.png',
    rate: parseFloat(exchange_rate),
    effectiveRate: parseFloat(exchange_rate),
    transferFee: parseFloat(total_fee),
    marginPercentage: marginPercentage,
    marginCost: (amount * marginPercentage) / 100,
    totalCost: parseFloat(total_fee) + ((amount * marginPercentage) / 100),
    amountReceived: parseFloat(amount_received),
    transferTime: "1-2 days", // Remitly typically takes 1-2 days
    transferTimeHours: { min: 24, max: 48 },
    rating: 4.5,
    realTimeApi: true
  };
};

/**
 * Runs the Remitly calculator script as a child process
 * @param {string} scriptPath - Path to the Remitly calculator script
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Destination currency code
 * @param {string} sourceCountry - Source country code
 * @param {string} destCountry - Destination country code
 * @returns {Promise<Object>} - Exchange rate information
 */
function runRemitlyCalculator(scriptPath, amount, fromCurrency, toCurrency, sourceCountry, destCountry) {
  return new Promise((resolve, reject) => {
    console.log(`Running Remitly calculator with args: ${amount} ${fromCurrency} ${toCurrency} ${sourceCountry || ''} ${destCountry || ''}`);
    
    // The script expects arguments in this order: amount, sourceCurrency, destCurrency, [sourceCountry], [destCountry]
    // If country codes are not provided, the script will try to guess from the currency
    const args = [
      scriptPath,
      amount.toString(),
      fromCurrency,
      toCurrency
    ];
    
    // Add country codes if provided
    if (sourceCountry) {
      args.push(sourceCountry);
      if (destCountry) {
        args.push(destCountry);
      }
    }
    
    const process = spawn('node', args);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`[Remitly Calculator Output]: ${data.toString()}`);
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`[Remitly Calculator Error]: ${data.toString()}`);
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Remitly calculator exited with code ${code}: ${stderr}`));
      }
      
      try {
        console.log('Raw output from Remitly calculator:', stdout);
        
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
        
        // If all parsing methods fail
        return reject(new Error('Could not parse Remitly calculator output. Raw output: ' + stdout));
      } catch (error) {
        console.error('Error parsing Remitly calculator output:', error);
        reject(error);
      }
    });
  });
} 