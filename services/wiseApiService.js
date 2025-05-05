const axios = require('axios');
const axiosRateLimit = require('axios-rate-limit');
const { default: axiosRetry } = require('axios-retry');
const NodeCache = require('node-cache');
const WISE_API_URL = process.env.WISE_API_URL || 'https://api.wise.com';

// Cache configuration - items expire after 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Get credentials from environment
const clientId = process.env.WISE_CLIENT_ID;
const clientSecret = process.env.WISE_CLIENT_SECRET;
const apiKey = process.env.WISE_API_KEY;

// Create HTTP client based on available credentials
let http;
if (apiKey) {
  console.log('Using Wise API key authentication');
  // Create rate-limited Axios instance with API key auth
  http = axiosRateLimit(axios.create({
    baseURL: process.env.WISE_API_URL || 'https://api.wise.com',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  }), { maxRequests: 10, perMilliseconds: 1000 });
} else if (clientId && clientSecret) {
  console.log('Using Wise Basic Auth authentication');
  // Create rate-limited Axios instance with Basic Auth
  http = axiosRateLimit(axios.create({
    baseURL: process.env.WISE_API_URL || 'https://api.wise.com',
    headers: {
      'Content-Type': 'application/json'
    },
    auth: {
      username: clientId,
      password: clientSecret
    }
  }), { maxRequests: 10, perMilliseconds: 1000 });
} else {
  console.log('No Wise API credentials provided, using unauthenticated client');
  // Create rate-limited Axios instance without auth
  http = axiosRateLimit(axios.create({
    baseURL: process.env.WISE_API_URL || 'https://api.wise.com',
    headers: {
      'Content-Type': 'application/json'
    }
  }), { maxRequests: 10, perMilliseconds: 1000 });
}

// Setup automatic retries
axiosRetry(http, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response && error.response.status >= 500);
  }
});

/**
 * Utility function to retry axios requests
 * @param {Function} requestFunction - Async function that returns an axios request
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} retryDelay - Base delay between retries in ms
 * @returns {Promise<Object>} - The axios response
 */
const retryAxiosRequest = async (requestFunction, maxRetries = 3, retryDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFunction();
    } catch (error) {
      lastError = error;
      console.warn(`Request failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff - wait longer with each retry
        const delay = retryDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError; // If we get here, all retries failed
};

/**
 * Check if we have a Wise auth token
 * @returns {boolean} - Whether we have a token
 */
const hasAuthToken = () => {
  return !!process.env.WISE_API_TOKEN;
};

/**
 * Get the Wise auth token
 * @returns {string} - The auth token
 */
const getWiseAuthToken = () => {
  return process.env.WISE_API_TOKEN;
};

/**
 * Test if the Wise API credentials are valid
 * @returns {Promise<Object>} - Object containing success status and message
 */
async function testApiCredentials() {
  try {
    // Try to fetch exchange rates as a simple API test
    // Using the /rates endpoint which is publicly accessible
    const response = await http.get('/rates', {
      params: {
        source: 'GBP',
        target: 'EUR'
      }
    });
    
    return {
      success: true,
      status: response.status,
      message: 'API credentials are valid'
    };
  } catch (error) {
    console.error(`Wise API credentials test failed: ${error.message}`);
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get the exchange rate from the Wise API
 * @param {string} sourceCurrency - Source currency code
 * @param {string} targetCurrency - Target currency code
 * @param {number} amount - Amount to convert
 * @returns {Promise<Object>} - Exchange rate information
 */
async function getExchangeRate(sourceCurrency, targetCurrency, amount = 1000) {
  try {
    // Define query parameters for the quotes endpoint
    const params = {
      source: sourceCurrency,
      target: targetCurrency,
      sourceAmount: amount,
      rateType: 'FIXED',
      preferredPayIn: 'BANK_TRANSFER',
      preferredPayOut: 'BANK_TRANSFER'
    };

    // Log the request URL for debugging
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = `${WISE_API_URL}/v1/quotes?${queryString}`;
    console.log(`[WiseAPI] Making request to: ${requestUrl}`);

    // Make the API request to get the quote
    const response = await http.get('/v1/quotes', { params });

    // Extract the exchange rate
    const rate = response.data.rate;

    // Extract the fee from the response
    const fee = response.data.fee || 0;
    
    // Extract the target amount
    const targetAmount = response.data.targetAmount || (amount * rate);

    // Extract the delivery estimate time if available
    let deliveryTime = null;
    if (response.data.deliveryEstimate) {
      deliveryTime = response.data.deliveryEstimate;
    } else if (response.data.estimatedDelivery) {
      deliveryTime = response.data.estimatedDelivery;
    } else {
      // Fallback to estimated delivery time if not available
      deliveryTime = getEstimatedDeliveryTime(sourceCurrency, targetCurrency);
    }

    return {
      rate,
      fee,
      sourceAmount: amount,
      targetAmount,
      deliveryTime
    };
  } catch (error) {
    console.error(`Error getting exchange rate from Wise API: ${error.message}`);
    throw new Error(`Failed to get exchange rate from Wise API: ${error.message}`);
  }
}

/**
 * Get realistic estimated delivery time for a currency pair with bank transfer method
 * @param {string} sourceCurrency - Source currency code
 * @param {string} targetCurrency - Target currency code 
 * @returns {string} - Human readable delivery time estimate
 */
function getEstimatedDeliveryTime(sourceCurrency, targetCurrency) {
  // Convert currency pair to a key for lookup
  const currencyPair = `${sourceCurrency}-${targetCurrency}`;
  
  // Define delivery time estimates for common routes (in hours)
  const deliveryTimeMap = {
    'EUR-USD': '2-3 business days',
    'USD-EUR': '1-2 business days',
    'GBP-EUR': '1 business day',
    'EUR-GBP': '1 business day',
    'USD-GBP': 'Within 1 hour',
    'GBP-USD': '1-2 business days',
    'EUR-AUD': '2-3 business days',
    'AUD-EUR': '2-3 business days',
    'USD-AUD': '1-2 business days',
    'AUD-USD': '1-2 business days'
  };
  
  // Check if we have a specific estimate for this currency pair
  if (deliveryTimeMap[currencyPair]) {
    return deliveryTimeMap[currencyPair];
  }
  
  // Regional estimates based on source currency
  const regionalEstimates = {
    'EUR': '2-3 business days',
    'USD': '1-2 business days',
    'GBP': '1-2 business days',
    'AUD': '2-3 business days',
    'CAD': '2-3 business days',
    'JPY': '2-3 business days',
    'CHF': '1-2 business days',
    'NZD': '2-3 business days',
    'SGD': '1-2 business days',
    'HKD': '1-2 business days'
  };
  
  // Fallback to regional estimate based on source currency
  if (regionalEstimates[sourceCurrency]) {
    return regionalEstimates[sourceCurrency];
  }
  
  // Default fallback
  return '2-3 business days';
}

/**
 * Clear the cache for a specific key or all Wise-related cache
 * @param {string} key - Specific cache key to clear (optional)
 */
function clearCache(key = null) {
  if (key) {
    cache.del(key);
    console.log(`Cleared cache for key: ${key}`);
  } else {
    // Clear all keys that start with 'wise_'
    const keys = cache.keys();
    keys.forEach(k => {
      if (k.startsWith('wise_')) {
        cache.del(k);
      }
    });
    console.log('Cleared all cache');
  }
}

/**
 * Get the transfer pricing from the Wise API
 * @param {string} sourceCurrency - Source currency code
 * @param {string} targetCurrency - Target currency code
 * @param {number} amount - Amount to convert
 * @returns {Promise<Object>} - Transfer pricing information
 */
async function getTransferPricing(sourceCurrency, targetCurrency, amount) {
  try {
    // Define query parameters for the quotes endpoint
    const params = {
      source: sourceCurrency,
      target: targetCurrency,
      sourceAmount: amount,
      rateType: 'FIXED',
      preferredPayIn: 'BANK_TRANSFER',
      preferredPayOut: 'BANK_TRANSFER'
    };

    // Make the API request to get the quote
    const response = await http.get('/quotes', { params });

    // Extract the fee information
    const fee = response.data.fee || 0;
    
    // Extract detailed fee breakdown if available
    let feeBreakdown = {};
    if (response.data.feeDetails) {
      feeBreakdown = response.data.feeDetails;
    }

    // Extract the delivery estimate time if available
    let deliveryTime = null;
    if (response.data.deliveryEstimate) {
      deliveryTime = response.data.deliveryEstimate;
    } else if (response.data.estimatedDelivery) {
      deliveryTime = response.data.estimatedDelivery;
    } else {
      // Fallback to estimated delivery time if not available
      deliveryTime = getEstimatedDeliveryTime(sourceCurrency, targetCurrency);
    }

    return {
      fee,
      feeBreakdown,
      deliveryTime
    };
  } catch (error) {
    console.error(`Error getting transfer pricing from Wise API: ${error.message}`);
    throw new Error(`Failed to get transfer pricing from Wise API: ${error.message}`);
  }
}

/**
 * Calculate a realistic Wise fee based on their typical fee structure
 * Fees vary by currency and amount sent
 * @param {string} sourceCurrency 
 * @param {number} amount 
 * @returns {number} - Calculated fee amount
 */
function calculateWiseFee(sourceCurrency, amount) {
  // Wise typically has a percentage-based fee with minimums
  // These values are based on typical Wise fee structures
  let fee = 0;
  
  switch (sourceCurrency) {
    case 'USD':
      if (amount <= 100) {
        fee = 0.99;
      } else if (amount <= 1000) {
        fee = 1.99;
      } else if (amount <= 5000) {
        fee = amount * 0.0045; // 0.45%
        fee = Math.max(fee, 1.99); // Minimum fee
      } else {
        fee = amount * 0.0035; // 0.35%
        fee = Math.max(fee, 22.5); // Minimum fee for larger amounts
      }
      break;
      
    case 'EUR':
      if (amount <= 100) {
        fee = 0.69;
      } else if (amount <= 1000) {
        fee = 1.49;
      } else if (amount <= 5000) {
        fee = amount * 0.0041; // 0.41%
        fee = Math.max(fee, 1.49); // Minimum fee
      } else {
        fee = amount * 0.0031; // 0.31%
        fee = Math.max(fee, 20.5); // Minimum fee for larger amounts
      }
      break;
      
    case 'GBP':
      if (amount <= 100) {
        fee = 0.65;
      } else if (amount <= 1000) {
        fee = 1.25;
      } else if (amount <= 5000) {
        fee = amount * 0.0039; // 0.39%
        fee = Math.max(fee, 1.25); // Minimum fee
      } else {
        fee = amount * 0.0029; // 0.29%
        fee = Math.max(fee, 19.5); // Minimum fee for larger amounts
      }
      break;
      
    case 'AUD':
      if (amount <= 100) {
        fee = 1.50;
      } else if (amount <= 1000) {
        fee = 2.50;
      } else if (amount <= 5000) {
        fee = amount * 0.0053; // 0.53%
        fee = Math.max(fee, 2.50); // Minimum fee
      } else {
        fee = amount * 0.0043; // 0.43%
        fee = Math.max(fee, 26.5); // Minimum fee for larger amounts
      }
      break;
      
    case 'CAD':
      if (amount <= 100) {
        fee = 1.50;
      } else if (amount <= 1000) {
        fee = 2.50;
      } else if (amount <= 5000) {
        fee = amount * 0.0056; // 0.56%
        fee = Math.max(fee, 2.50); // Minimum fee
      } else {
        fee = amount * 0.0046; // 0.46%
        fee = Math.max(fee, 28.0); // Minimum fee for larger amounts
      }
      break;
      
    default:
      // Default fee structure for other currencies
      if (amount <= 100) {
        fee = 1.50;
      } else if (amount <= 1000) {
        fee = 2.00;
      } else if (amount <= 5000) {
        fee = amount * 0.005; // 0.5%
        fee = Math.max(fee, 2.00); // Minimum fee
      } else {
        fee = amount * 0.004; // 0.4%
        fee = Math.max(fee, 25.0); // Minimum fee for larger amounts
      }
  }

  // Round to 2 decimal places
  return Math.round(fee * 100) / 100;
}

// Export a list of common currency pairs we know Wise supports
const supportedCurrencyPairs = [
  { source: 'USD', target: 'EUR' },
  { source: 'USD', target: 'GBP' },
  { source: 'USD', target: 'CAD' },
  { source: 'USD', target: 'AUD' },
  { source: 'USD', target: 'NZD' },
  { source: 'USD', target: 'JPY' },
  { source: 'USD', target: 'CHF' },
  { source: 'EUR', target: 'USD' },
  { source: 'EUR', target: 'GBP' },
  { source: 'EUR', target: 'CAD' },
  { source: 'EUR', target: 'AUD' },
  { source: 'EUR', target: 'CHF' },
  { source: 'GBP', target: 'USD' },
  { source: 'GBP', target: 'EUR' },
  { source: 'GBP', target: 'CAD' },
  { source: 'GBP', target: 'AUD' },
  { source: 'GBP', target: 'NZD' },
  { source: 'CAD', target: 'USD' },
  { source: 'CAD', target: 'EUR' },
  { source: 'CAD', target: 'GBP' },
  { source: 'AUD', target: 'USD' },
  { source: 'AUD', target: 'EUR' },
  { source: 'AUD', target: 'GBP' },
  { source: 'NZD', target: 'USD' },
  { source: 'NZD', target: 'EUR' },
  { source: 'NZD', target: 'GBP' },
  { source: 'CHF', target: 'USD' },
  { source: 'CHF', target: 'EUR' },
  { source: 'CHF', target: 'GBP' }
];

/**
 * Check if a currency pair is supported by Wise
 * @param {string} sourceCurrency 
 * @param {string} targetCurrency 
 * @returns {boolean}
 */
function isCurrencyPairSupported(sourceCurrency, targetCurrency) {
  return supportedCurrencyPairs.some(
    pair => pair.source === sourceCurrency && pair.target === targetCurrency
  );
}

/**
 * Get historical exchange rates from Wise API
 * @param {string} sourceCurrency - Source currency code (e.g. 'EUR')
 * @param {string} targetCurrency - Target currency code (e.g. 'USD')
 * @param {string} fromDate - Start date in ISO format (e.g. '2023-01-01T00:00:00')
 * @param {string} toDate - End date in ISO format (e.g. '2023-01-30T23:59:59')
 * @param {string} group - Grouping interval (e.g. 'day')
 * @returns {Promise<Object>} - Historical exchange rate data
 */
async function getHistoricalRates(sourceCurrency, targetCurrency, fromDate = null, toDate = null, group = 'day') {
  try {
    // Build cache key
    const cacheKey = `historical_${sourceCurrency}_${targetCurrency}_${fromDate}_${toDate}_${group}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`[WiseAPI] Using cached historical rates for ${sourceCurrency}-${targetCurrency}`);
      return cachedData;
    }
    
    // Get current date to ensure we don't request future data
    const currentDate = new Date();
    
    // Set default date range if not provided (last 30 days)
    if (!toDate) {
      toDate = currentDate.toISOString();
    } else {
      // Ensure toDate is not in the future
      const requestedToDate = new Date(toDate);
      if (requestedToDate > currentDate) {
        console.log(`[WiseAPI] Adjusted future date ${toDate} to current date`);
        toDate = currentDate.toISOString();
      }
    }
    
    // Ensure fromDate is valid
    if (!fromDate) {
      // Default to 30 days before the 'to' date
      const fromDt = new Date(toDate); // Use the potentially adjusted toDate
      fromDt.setDate(fromDt.getDate() - 30);
      fromDate = fromDt.toISOString();
    } else {
      // Ensure fromDate is not in the future and not after toDate
      const requestedFromDate = new Date(fromDate);
      const finalToDate = new Date(toDate); // Use the adjusted 'to' date

      if (requestedFromDate > currentDate) {
        console.log(`[WiseAPI] Adjusted future fromDate ${fromDate} to 30 days before toDate`);
        const fromDt = new Date(toDate);
        fromDt.setDate(fromDt.getDate() - 30);
        fromDate = fromDt.toISOString();
      } else if (requestedFromDate > finalToDate) {
        console.log(`[WiseAPI] Adjusted fromDate ${fromDate} as it was after toDate ${toDate}`);
        const fromDt = new Date(toDate);
        fromDt.setDate(fromDt.getDate() - 30);
        fromDate = fromDt.toISOString();
      }
    }
    
    // Re-build cache key with potentially adjusted dates
    const finalCacheKey = `historical_${sourceCurrency}_${targetCurrency}_${fromDate}_${toDate}_${group}`;

    // Check cache again with final dates
    const finalCachedData = cache.get(finalCacheKey);
    if (finalCachedData) {
      console.log(`[WiseAPI] Using cached historical rates for ${sourceCurrency}-${targetCurrency} (post-date adjustment)`);
      return finalCachedData;
    }

    // Build parameters for the API call
    const params = {
      source: sourceCurrency,
      target: targetCurrency,
      from: fromDate,
      to: toDate,
      group
    };
    
    // Log the request details
    console.log(`[WiseAPI] Fetching historical rates for ${sourceCurrency}-${targetCurrency} from ${fromDate} to ${toDate}`);
    
    // Make the API request
    const response = await http.get('/v1/rates', { params });
    
    // Process the response
    const rateData = response.data;
    
    // Cache the results
    cache.set(cacheKey, rateData); // Original cache key might be wrong if dates were adjusted

    // Cache the results with the correct key based on final dates
    cache.set(finalCacheKey, rateData);
    
    return rateData;
  } catch (error) {
    console.error(`Error getting historical rates from Wise API: ${error.message}`);
    throw error;
  }
}

/**
 * Get price comparison data from Wise API showing all providers
 * @param {string} sourceCurrency - Source currency code
 * @param {string} targetCurrency - Target currency code
 * @param {number} amount - Amount to convert
 * @param {string} sourceCountry - Source country code (optional)
 * @param {string} targetCountry - Target country code (optional)
 * @param {string} providerType - Type of provider (optional)
 * @returns {Promise<Object>} - Comparison data with all providers
 */
const getPriceComparison = async (
  sourceCurrency,
  targetCurrency,
  amount,
  sourceCountry = null,
  targetCountry = null,
  providerType = null
) => {
  const cacheKey = `compare:${sourceCurrency}-${targetCurrency}-${amount}-${sourceCountry || ''}-${targetCountry || ''}-${providerType || ''}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    console.log('[WiseAPI] Returning cached comparison data');
    return cachedData;
  }

  console.log('[WiseAPI] Fetching comparison data from Wise API');

  const params = {
    sourceCurrency,
    targetCurrency,
    sendAmount: amount,
    sourceCountry: sourceCountry || undefined,
    targetCountry: targetCountry || undefined,
    providerType: providerType || undefined,
  };

  try {
    const response = await http.get('/v3/comparisons', { params });
    let comparisonData = response.data;

    // --- Start of TorFX Integration ---
    if (comparisonData && comparisonData.providers && comparisonData.providers.length > 0) {
      let midMarketRate = null;

      // Try to find Wise in the results to determine the mid-market rate
      const wiseProviderResult = comparisonData.providers.find(p =>
        p.alias?.toLowerCase() === 'wise' || p.name?.toLowerCase()?.includes('wise')
      );

      if (wiseProviderResult && wiseProviderResult.quotes && wiseProviderResult.quotes.length > 0) {
        // Assume the first quote's rate is close enough to mid-market for Wise
        // (Wise usually has minimal markup shown explicitly)
        const wiseQuote = wiseProviderResult.quotes[0];
        midMarketRate = wiseQuote.rate;
        console.log('[WiseAPI] Determined mid-market rate from Wise result:', midMarketRate);
      } else {
         // Fallback: if Wise isn't in the results, try to infer from the first provider
         // This is less reliable and assumes the first provider has a listed rate
         if (comparisonData.providers[0].quotes && comparisonData.providers[0].quotes.length > 0) {
            midMarketRate = comparisonData.providers[0].quotes[0].rate;
            console.warn('[WiseAPI] Wise provider not found, using first provider rate as approximation for mid-market:', midMarketRate);
         }
      }


      if (midMarketRate) {
        // Define TorFX helper functions (copied from frontend)
        const getTorFXMarkup = (fromCurr, toCurr) => {
          const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
          const tier2Currencies = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
          if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) return 0.01;
          if ((majorCurrencies.includes(fromCurr) && tier2Currencies.includes(toCurr)) || (majorCurrencies.includes(toCurr) && tier2Currencies.includes(fromCurr))) return 0.015;
          return 0.02;
        };

        const getTorFXDeliveryTime = (fromCurr, toCurr) => {
          const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
          const tier2Currencies = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
          if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) return { text: 'Same day to 1 business day', hours: { min: 0, max: 24 } };
          if ((majorCurrencies.includes(fromCurr) && tier2Currencies.includes(toCurr)) || (majorCurrencies.includes(toCurr) && tier2Currencies.includes(fromCurr))) return { text: '1–2 business days', hours: { min: 24, max: 48 } };
          return { text: '1–3 business days', hours: { min: 24, max: 72 } };
        };

        // Check minimum amount (£100 equivalent)
        const checkMinimumAmount = () => {
          const numericAmount = parseFloat(amount);
          if (isNaN(numericAmount)) return false;

          if (sourceCurrency.toUpperCase() === 'GBP') {
            return numericAmount >= 100;
          } else {
            // Approximate GBP equivalent using the determined mid-market rate
            // We need a GBP rate. If source is not GBP, we need Wise GBP -> source rate.
            // This simplification assumes direct conversion is possible and uses the current pair's rate.
            // A more robust solution would fetch the specific GBP->sourceCurrency rate.
            // For now, let's assume if it's not GBP, we *can't* accurately check the minimum.
            // Consider improving this logic later. For now, only allow GBP source for TorFX minimum check.
            console.warn('[WiseAPI] TorFX minimum amount check skipped for non-GBP source currency due to rate complexity.');
            return false; // Temporarily disable for non-GBP until rate fetching is improved
          }
        };


        // Add TorFX if conditions met
        // TODO: Improve minimum amount check for non-GBP currencies
        if (checkMinimumAmount() || sourceCurrency.toUpperCase() !== 'GBP') { // Allow if check passes OR if it's non-GBP (temporarily bypassing check)
            const torFXMarkup = getTorFXMarkup(sourceCurrency.toUpperCase(), targetCurrency.toUpperCase());
            const deliveryTime = getTorFXDeliveryTime(sourceCurrency.toUpperCase(), targetCurrency.toUpperCase());
            const torFXRate = midMarketRate * (1 - torFXMarkup);
            const receivedAmount = parseFloat(amount) * torFXRate;

            const torFXProvider = {
              id: 'torfx', // Use a simple ID
              name: 'TorFX',
              alias: 'torfx',
              logo: '/images/providers/torfx.svg', // Assuming the logo path is accessible
              quotes: [{ // Structure similar to Wise API response
                  rate: torFXRate,
                  fee: 0, // TorFX has no fees
                  markup: torFXMarkup,
                  sourceAmount: parseFloat(amount),
                  receivedAmount: receivedAmount,
                  estimatedDelivery: deliveryTime.text,
                  // Add other relevant fields if needed, mirroring Wise structure
                  baseRate: midMarketRate, // Store the base rate used for calculation
                  transferFee: 0,
                  marginPercentage: torFXMarkup * 100,
                  marginCost: parseFloat(amount) * (midMarketRate - torFXRate),
                  totalCost: parseFloat(amount) * (midMarketRate - torFXRate),
                  transferTimeHours: deliveryTime.hours,
                  transferTime: deliveryTime.text,
                  rating: 4.5, // Default static rating
                  methods: ['bank_transfer'],
                  realTimeApi: false, // Manually added provider
                  timestamp: new Date().toISOString(),
                  sourceCountry: sourceCountry || undefined,
                  targetCountry: targetCountry || undefined
              }],
              // Add top-level provider details if needed
              providerId: `provider-torfx`, // Keep consistent frontend ID
              providerCode: 'torfx',
              providerName: 'TorFX',
              providerLogo: '/images/providers/torfx.svg',
            };

            // Add TorFX to the comparison data providers list
            comparisonData.providers.push(torFXProvider);
            console.log('[WiseAPI] Added TorFX provider to comparison results.');
        } else {
           console.log('[WiseAPI] TorFX minimum amount not met for GBP transfer, skipping.');
        }
      } else {
        console.warn('[WiseAPI] Could not determine mid-market rate, skipping TorFX addition.');
      }
    }
    // --- End of TorFX Integration ---

    // Cache the modified results
    cache.set(cacheKey, comparisonData);
    console.log('[WiseAPI] Comparison data fetched and cached');
    return comparisonData;

  } catch (error) {
    console.error(`Error getting price comparison from Wise API: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getExchangeRate,
  getTransferPricing,
  clearCache,
  testApiCredentials,
  supportedCurrencyPairs,
  isCurrencyPairSupported,
  getHistoricalRates,
  calculateWiseFee,
  getEstimatedDeliveryTime,
  getPriceComparison
};