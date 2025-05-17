/**
 * Revolut API Service
 * Handles fetching and caching exchange rates from Revolut
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
 * Get exchange rate information from Revolut
 * @param {string} fromCurrency - Source currency code (e.g., 'GBP')
 * @param {string} toCurrency - Destination currency code (e.g., 'EUR')
 * @param {number} amount - Amount to convert
 * @param {string} sourceCountry - Source country code (e.g., 'GB')
 * @param {string} destCountry - Destination country code (e.g., 'FR')
 * @returns {Promise<Object>} - Exchange rate information
 */
exports.getExchangeRate = async (fromCurrency, toCurrency, amount, sourceCountry = null, destCountry = null) => {
  try {
    // Validate inputs
    if (!fromCurrency || !toCurrency || !amount) {
      throw new Error('Missing required parameters: fromCurrency, toCurrency, and amount are required');
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    
    // Create cache key - only include the essential parameters
    const cacheKey = `${fromCurrency}-${toCurrency}-${amount}`;
    
    // Log detailed information about the request
    console.log(`[Revolut] Processing exchange rate request for ${fromCurrency} to ${toCurrency}, amount: ${amount}, sourceCountry: ${sourceCountry || 'auto'}, destCountry: ${destCountry || 'auto'}`);
    
    // Check if we have a valid cached response
    if (
      cache.exchangeRates[cacheKey] && 
      cache.timestamps[cacheKey] && 
      (Date.now() - cache.timestamps[cacheKey]) < CACHE_TIMEOUT
    ) {
      console.log(`[Revolut] Using cached exchange rate for ${fromCurrency} to ${toCurrency}`);
      return {
        success: true,
        cached: true,
        data: cache.exchangeRates[cacheKey]
      };
    }
    
    console.log(`[Revolut] Fetching fresh exchange rate for ${fromCurrency} to ${toCurrency}`);
    
    // Use the Revolut calculator script to get the rate
    const scriptPath = path.resolve(__dirname, '../scripts/scrapers/revolut/revolut-calculator.js');
    
    // Check if the script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`[Revolut] Calculator script not found at ${scriptPath}`);
      return {
        success: false,
        error: `Calculator script not found at ${scriptPath}`
      };
    }
    
    const data = await runRevolutCalculator(scriptPath, amount, fromCurrency, toCurrency, sourceCountry, destCountry);
    
    // Validate key fields in the response
    if (!data.route || data.route !== 'BANK') {
      throw new Error(`Invalid or missing 'route' in Revolut response. Expected 'BANK', got '${data.route}'`);
    }
    
    if (!data.plan || data.plan !== 'STANDARD') {
      throw new Error(`Invalid or missing 'plan' in Revolut response. Expected 'STANDARD', got '${data.plan}'`);
    }
    
    if (!data.exchange_rate || typeof data.exchange_rate !== 'number' || data.exchange_rate <= 0) {
      throw new Error(`Invalid or missing 'exchange_rate' in Revolut response: ${data.exchange_rate}`);
    }
    
    if (data.total_fee === undefined || typeof data.total_fee !== 'number') {
      throw new Error(`Invalid or missing 'total_fee' in Revolut response: ${data.total_fee}`);
    }
    
    if (!data.amount_received || typeof data.amount_received !== 'number' || data.amount_received <= 0) {
      throw new Error(`Invalid or missing 'amount_received' in Revolut response: ${data.amount_received}`);
    }
    
    if (!data.amount_charged || typeof data.amount_charged !== 'number' || data.amount_charged <= 0) {
      throw new Error(`Invalid or missing 'amount_charged' in Revolut response: ${data.amount_charged}`);
    }
    
    // Verify the calculations for sanity check
    const expectedReceived = (data.amount_charged - data.total_fee) * data.exchange_rate;
    const discrepancy = Math.abs(expectedReceived - data.amount_received);
    
    if (discrepancy > data.amount_charged * 0.01) { // Allow 1% discrepancy for rounding
      console.warn(`[Revolut] Possible calculation discrepancy: expected ~${expectedReceived.toFixed(2)}, got ${data.amount_received.toFixed(2)} (${discrepancy.toFixed(2)} difference)`);
    }
    
    // Cache the response
    cache.exchangeRates[cacheKey] = data;
    cache.timestamps[cacheKey] = Date.now();
    
    console.log(`[Revolut] Successfully retrieved exchange rate: ${data.exchange_rate}`);
    
    return {
      success: true,
      cached: false,
      data
    };
  } catch (error) {
    console.error(`[Revolut] Error fetching exchange rate: ${error.message}`);
    
    // Provide more detailed error information
    let errorDetails = error.message;
    if (error.message.includes('HTTP 4')) {
      errorDetails = `Revolut API rejected the request for ${fromCurrency} to ${toCurrency}. This may indicate this currency pair is not supported.`;
    } else if (error.message.includes('No plans returned')) {
      errorDetails = `No payment plans found for ${fromCurrency} to ${toCurrency}. This currency pair may not be supported by Revolut.`;
    } else if (error.message.includes('No BANK routes found')) {
      errorDetails = `No BANK transfer routes found for ${fromCurrency} to ${toCurrency}. This currency pair may not support BANK transfers.`;
    } else if (error.message.includes('No STANDARD plans found')) {
      errorDetails = `No STANDARD plans found for ${fromCurrency} to ${toCurrency} BANK transfers.`;
    }
    
    return {
      success: false,
      error: errorDetails,
      originalError: error.message
    };
  }
};

/**
 * Formats Revolut exchange rate data for the provider card
 * @param {Object} rateData - Exchange rate data from Revolut
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {number} amount - Amount to convert
 * @returns {Object} - Formatted provider data
 */
exports.formatForProviderCard = (rateData, fromCurrency, toCurrency, amount) => {
  const { 
    exchange_rate, 
    total_fee, 
    fee_currency, 
    amount_received, 
    amount_charged,
    route, 
    plan, 
    transfer_type, 
    estimate,
    timestamp 
  } = rateData;
  
  // Verify we have BANK transfer with STANDARD plan
  if (route !== 'BANK') {
    console.error(`[Revolut] Unexpected route: ${route}, expected 'BANK'`);
  }
  
  if (plan !== 'STANDARD') {
    console.error(`[Revolut] Unexpected plan: ${plan}, expected 'STANDARD'`);
  }
  
  // Parse estimated delivery time from ISO date if available, otherwise use default
  let transferTime = "1-2 business days";
  let transferTimeHours = { min: 24, max: 48 };
  
  if (estimate) {
    try {
      // Fix for Revolut API returning date strings without timezone
      // If the estimate doesn't end with Z but has a T (indicating time component),
      // append Z to treat it as UTC
      let normalizedEstimate = estimate;
      if (estimate.includes('T') && !estimate.endsWith('Z') && !estimate.match(/[+-]\d{2}:\d{2}$/)) {
        normalizedEstimate = `${estimate}Z`;
        console.log(`[Revolut] Normalized estimate time from ${estimate} to ${normalizedEstimate}`);
      }
      
      // Special handling for LOCAL_TRANSFER type which is typically instant
      // This is common for GBP to EUR transfers within the EU/UK
      if (transfer_type === 'LOCAL_TRANSFER') {
        transferTime = 'Instant';
        transferTimeHours = { min: 0, max: 0 };
        console.log(`[Revolut] Using 'Instant' for LOCAL_TRANSFER type`);
      } else {
        // Try to parse the ISO date from the estimate field
        const estimateDate = new Date(normalizedEstimate);
        const now = new Date();
        
        // Debug info
        console.log(`[Revolut] Current time: ${now.toISOString()}`);
        console.log(`[Revolut] Estimate time: ${normalizedEstimate}`);
        console.log(`[Revolut] Parsed estimate: ${estimateDate.toISOString()}`);
        
        // Check if we have a valid date
        if (!isNaN(estimateDate.getTime())) {
          // Check if the date contains time information or just a date
          const isDateOnly = 
            normalizedEstimate.includes('T00:00:00') || 
            !normalizedEstimate.includes('T') || 
            (normalizedEstimate.split('T')[1] && normalizedEstimate.split('T')[1].startsWith('00:00:00'));
            
          // For date-only format, compare dates, not exact timestamps
          if (isDateOnly) {
            // Create fresh date objects for comparison to avoid modifying original dates
            const today = new Date();
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            // For date-only formats, handle different possible formats
            let deliveryDate;
            if (!normalizedEstimate.includes('T')) {
              // Handle YYYY-MM-DD format
              const parts = normalizedEstimate.split('-');
              if (parts.length === 3) {
                // Parse as local date to avoid timezone issues
                deliveryDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
              } else {
                deliveryDate = new Date(estimateDate.getFullYear(), estimateDate.getMonth(), estimateDate.getDate());
              }
            } else {
              // Handle date with T00:00:00 format
              deliveryDate = new Date(estimateDate.getFullYear(), estimateDate.getMonth(), estimateDate.getDate());
            }
            
            // Calculate days difference
            const diffMs = deliveryDate.getTime() - todayDate.getTime();
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
              transferTime = 'Today';
              transferTimeHours = { min: 0, max: 24 };
            } else if (diffDays === 1) {
              transferTime = '1 day';
              transferTimeHours = { min: 24, max: 48 };
            } else if (diffDays > 1) {
              transferTime = `${diffDays} days`;
              transferTimeHours = { min: diffDays * 24, max: diffDays * 24 };
            } else {
              // Default for past dates (shouldn't normally happen)
              transferTime = "1-2 business days";
              transferTimeHours = { min: 24, max: 48 };
            }
          } else {
            // Full datetime format - calculate precise time
            // Calculate difference in milliseconds (recalculate as we may have updated things)
            const diffMs = estimateDate.getTime() - now.getTime();
            console.log(`[Revolut] Time difference in ms: ${diffMs}`);
            
            // Handle case where the time appears to be in the past but is actually very close
            // This can happen due to timezone parsing issues with Revolut's API
            if (diffMs < 0) {
              if (diffMs > -60000) { // If it's less than a minute in the past
                transferTime = 'Instant';
                transferTimeHours = { min: 0, max: 0 };
              } else if (diffMs > -3600000) { // Within the last hour
                transferTime = 'Instant';
                transferTimeHours = { min: 0, max: 0 };
              } else {
                // Default for past dates that are significantly in the past
                transferTime = "1-2 business days";
                transferTimeHours = { min: 24, max: 48 };
              }
            } else {
              // Convert to seconds, minutes, hours and days
              const diffSeconds = Math.floor(diffMs / 1000);
              const diffMinutes = Math.floor(diffMs / (1000 * 60));
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              // Format based on how much time is left
              if (diffSeconds < 60) {
                // Less than a minute - might as well call it instant
                transferTime = (diffSeconds <= 5) ? 'Instant' : `${diffSeconds} seconds`;
              } else if (diffMinutes < 60) {
                // Less than an hour
                transferTime = diffMinutes === 1 ? '1 minute' : `${diffMinutes} minutes`;
              } else if (diffHours < 24) {
                // Less than a day
                transferTime = diffHours === 1 ? '1 hour' : `${diffHours} hours`;
              } else if (diffDays < 7) {
                // Less than a week
                transferTime = diffDays === 1 ? '1 day' : `${diffDays} days`;
              } else {
                // Check if it's within a month
                const deliveryMonth = estimateDate.getMonth();
                const deliveryDay = estimateDate.getDate();
                const currentMonth = now.getMonth();
                const currentDay = now.getDate();
                
                if (deliveryMonth === currentMonth || 
                    (deliveryMonth === currentMonth + 1 && deliveryDay < currentDay)) {
                  // Same month or early next month
                  transferTime = `${diffDays} days`;
                } else {
                  // Format as date
                  const options = { month: 'short', day: 'numeric' };
                  transferTime = estimateDate.toLocaleDateString(undefined, options);
                }
              }
              
              // Set transfer time hours for consistent comparisons
              transferTimeHours = { min: diffHours, max: diffHours };
            }
          }
        }
      }
    } catch (e) {
      console.error('Error parsing estimate date:', e);
      // Use default values if parsing fails
    }
  }
  
  // Ensure all numeric values are properly parsed
  const parsedExchangeRate = typeof exchange_rate === 'string' ? parseFloat(exchange_rate) : exchange_rate;
  const parsedTotalFee = typeof total_fee === 'string' ? parseFloat(total_fee) : total_fee;
  const parsedAmountReceived = typeof amount_received === 'string' ? parseFloat(amount_received) : amount_received;
  const parsedAmountCharged = typeof amount_charged === 'string' ? parseFloat(amount_charged) : amount_charged;
  
  // Use the amount_charged from the response for calculating the effective rate
  // This handles cases where Revolut adjusted the amount due to fees or minimum amounts
  const amountToUse = parsedAmountCharged || amount;
  
  // Verify that received amount is plausible
  if (parsedAmountReceived > 0 && parsedExchangeRate > 0) {
    const expectedAmountReceived = (amountToUse - parsedTotalFee) * parsedExchangeRate;
    const discrepancy = Math.abs(expectedAmountReceived - parsedAmountReceived);
    
    if (discrepancy > 0.1) {
      console.warn(`[Revolut] Amount received discrepancy: API returned ${parsedAmountReceived} ${toCurrency}, calculated ${expectedAmountReceived.toFixed(2)} ${toCurrency} (discrepancy: ${discrepancy.toFixed(2)})`);
    }
  }
  
  // Convert timestamp from API to ISO string (if available)
  // Timestamp is expected to be in milliseconds since epoch
  let rateTimestamp = new Date().toISOString();
  if (timestamp) {
    try {
      // Ensure timestamp is treated as a number
      const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
      if (!isNaN(timestampNum) && timestampNum > 0) {
        // Check if timestamp is stale (more than 2 hours old)
        const currentTime = Date.now();
        const twoHoursInMs = 2 * 60 * 60 * 1000;
        
        if ((currentTime - timestampNum) > twoHoursInMs) {
          console.warn(`[Revolut] Timestamp is stale: ${timestampNum} (${new Date(timestampNum).toISOString()}) - more than 2 hours old, using current time instead`);
          rateTimestamp = new Date().toISOString();
        } else {
          rateTimestamp = new Date(timestampNum).toISOString();
          console.log(`[Revolut] Using API timestamp: ${timestamp} (${rateTimestamp})`);
        }
      } else {
        console.warn(`[Revolut] Invalid timestamp format: ${timestamp}, using current time instead`);
      }
    } catch (error) {
      console.error(`[Revolut] Error parsing timestamp: ${error.message}`);
    }
  } else {
    console.log(`[Revolut] No timestamp provided in API response, using current time`);
  }
  
  return {
    providerId: 'provider-revolut',
    providerName: 'Revolut',
    providerCode: 'revolut',
    providerLogo: '/images/providers/revolut.png',
    rate: parsedExchangeRate,
    effectiveRate: parsedExchangeRate,
    transferFee: parsedTotalFee,
    marginPercentage: 0, // Will be calculated on client side based on mid-market rate
    marginCost: 0, // Will be calculated on client side
    totalCost: parsedTotalFee,
    amountReceived: parsedAmountReceived,
    transferTime: transferTime,
    transferTimeHours: transferTimeHours,
    rating: 4.4,
    realTimeApi: true,
    route: route,
    plan: plan,
    transfer_type: transfer_type,
    estimate: estimate,
    rateTimestamp: rateTimestamp // Using the timestamp from the API response instead of current time
  };
};

/**
 * Runs the Revolut calculator script as a child process
 * @param {string} scriptPath - Path to the Revolut calculator script
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Destination currency code
 * @param {string} sourceCountry - Source country code
 * @param {string} destCountry - Destination country code
 * @returns {Promise<Object>} - Exchange rate information
 */
function runRevolutCalculator(scriptPath, amount, fromCurrency, toCurrency, sourceCountry, destCountry) {
  return new Promise((resolve, reject) => {
    console.log(`Running Revolut calculator with args: ${amount} ${fromCurrency} ${toCurrency} ${sourceCountry || ''} ${destCountry || ''}`);
    
    // The script expects arguments in this order: amount, sourceCurrency, destCurrency, [sourceCountry], [destCountry]
    // If countries are not provided, the script will try to guess from the currency
    const args = [
      scriptPath,
      amount.toString(),
      fromCurrency,
      toCurrency
    ];
    
    // Only add country codes if they're provided
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
      console.log(`[Revolut Calculator Output]: ${data.toString()}`);
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`[Revolut Calculator Error]: ${data.toString()}`);
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Revolut calculator exited with code ${code}: ${stderr}`));
      }
      
      try {
        console.log('Raw output from Revolut calculator:', stdout);
        
        // Look for JSON_OUTPUT format (most reliable)
        const jsonOutputMatch = stdout.match(/JSON_OUTPUT: (.*)/);
        if (jsonOutputMatch && jsonOutputMatch[1]) {
          try {
            const jsonData = JSON.parse(jsonOutputMatch[1]);
            console.log('Successfully parsed using JSON_OUTPUT format:', jsonData);
            
            // Validate required fields for BANK transfer with STANDARD plan
            if (jsonData.route !== 'BANK') {
              return reject(new Error(`Revolut returned non-BANK route: ${jsonData.route}. Only BANK transfers are supported.`));
            }
            
            if (jsonData.plan !== 'STANDARD') {
              return reject(new Error(`Revolut returned non-STANDARD plan: ${jsonData.plan}. Only STANDARD plan is supported.`));
            }
            
            // Validate other required fields
            const requiredFields = ['exchange_rate', 'total_fee', 'amount_received', 'amount_charged'];
            const missingFields = requiredFields.filter(field => jsonData[field] === undefined);
            
            if (missingFields.length > 0) {
              return reject(new Error(`Missing required fields in Revolut response: ${missingFields.join(', ')}`));
            }
            
            // Make sure all numeric fields are parsed as numbers
            jsonData.exchange_rate = parseFloat(jsonData.exchange_rate);
            jsonData.total_fee = parseFloat(jsonData.total_fee);
            jsonData.amount_received = parseFloat(jsonData.amount_received);
            jsonData.amount_charged = parseFloat(jsonData.amount_charged);
            
            // Look for the timestamp field in the top-level response
            // This should be extracted from the "timestamp" field in the API response
            if (jsonData.timestamp) {
              console.log(`[Revolut] Found timestamp in API response: ${jsonData.timestamp} (${new Date(jsonData.timestamp).toISOString()})`);
              
              // Verify the timestamp is recent (within the last 24 hours)
              const currentTime = Date.now();
              const oneDayInMs = 24 * 60 * 60 * 1000;
              if ((currentTime - jsonData.timestamp) > oneDayInMs) {
                console.warn(`[Revolut] API timestamp is more than 24 hours old: ${jsonData.timestamp} (${new Date(jsonData.timestamp).toISOString()})`);
                console.warn(`[Revolut] This may indicate an issue with the Revolut API caching old rate data.`);
              }
            } else {
              // If we don't have a timestamp field directly, look for it in the raw output
              const timestampMatch = stdout.match(/"timestamp"\s*:\s*(\d+)/);
              if (timestampMatch && timestampMatch[1]) {
                jsonData.timestamp = parseInt(timestampMatch[1], 10);
                console.log(`[Revolut] Extracted timestamp from raw output: ${jsonData.timestamp} (${new Date(jsonData.timestamp).toISOString()})`);
                
                // Verify the timestamp is recent (within the last 24 hours)
                const currentTime = Date.now();
                const oneDayInMs = 24 * 60 * 60 * 1000;
                if ((currentTime - jsonData.timestamp) > oneDayInMs) {
                  console.warn(`[Revolut] Extracted timestamp is more than 24 hours old: ${jsonData.timestamp} (${new Date(jsonData.timestamp).toISOString()})`);
                  console.warn(`[Revolut] This may indicate an issue with the Revolut API caching old rate data.`);
                }
              } else {
                console.log('[Revolut] No timestamp found in API response, will use current time');
                jsonData.timestamp = Date.now();
              }
            }
            
            // Ensure exchange rate is plausible (not zero or extremely large)
            if (jsonData.exchange_rate <= 0 || jsonData.exchange_rate > 10000) {
              return reject(new Error(`Implausible exchange rate received from Revolut: ${jsonData.exchange_rate}`));
            }
            
            // Ensure received amount is plausible
            if (jsonData.amount_received <= 0) {
              return reject(new Error(`Invalid amount received from Revolut: ${jsonData.amount_received}`));
            }
            
            // Ensure charged amount is plausible
            if (jsonData.amount_charged <= 0) {
              return reject(new Error(`Invalid amount charged from Revolut: ${jsonData.amount_charged}`));
            }
            
            return resolve(jsonData);
          } catch (jsonError) {
            console.log('JSON_OUTPUT parsing failed:', jsonError);
            // Continue to other methods if this fails
          }
        }
        
        // If no valid response could be parsed, reject
        return reject(new Error('Could not parse a valid response from Revolut calculator'));
      } catch (error) {
        return reject(new Error(`Error parsing Revolut calculator output: ${error.message}`));
      }
    });
  });
} 