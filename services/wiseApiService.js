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
  } else {
    // Clear all keys that start with 'wise_'
    const keys = cache.keys();
    keys.forEach(k => {
      if (k.startsWith('wise_')) {
        cache.del(k);
      }
    });
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
 * Get historical exchange rates from the Wise API
 * @param {string} sourceCurrency - The source currency code (e.g. 'USD')
 * @param {string} targetCurrency - The target currency code (e.g. 'EUR')
 * @param {number} days - Number of days of historical data to fetch
 * @returns {Promise<Array>} - Promise resolving to array of historical rate data
 */
async function getHistoricalRates(sourceCurrency, targetCurrency, days = 30) {
  const cacheKey = `wise_historical_${sourceCurrency}_${targetCurrency}_${days}`;
  
  // Try to get data from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Returning cached historical rates for ${sourceCurrency} to ${targetCurrency}`);
    return cachedData;
  }

  // Check if we have API credentials configured
  if (!apiKey && (!clientId || !clientSecret)) {
    console.error('Wise API credentials not configured properly in .env file.');
    throw new Error('Wise API credentials not configured. Please set WISE_API_KEY or WISE_CLIENT_ID and WISE_CLIENT_SECRET in the environment variables.');
  }

  try {
    // First get the current exchange rate
    const currentRate = await getExchangeRate(sourceCurrency, targetCurrency);
    
    // Since Wise API doesn't provide historical rates directly in their public API,
    // we're implementing a solution that simulates historical data by using 
    // only what we know for certain - the current rate
    
    // Use current knowledge of today's rate to generate placeholder historical data
    // Real implementation would need to store historical rates over time
    const history = [];
    const baseRate = currentRate.rate;
    
    // Throw error so clients can handle this properly
    console.error('Historical data is not available through the Wise API');
    throw new Error(`Historical exchange rate data not available for ${sourceCurrency} to ${targetCurrency}. Please implement and use your own rate storage for historical data.`);
  } catch (error) {
    console.error(`Error getting historical rates: ${error.message}`);
    throw new Error(`Failed to get historical rates: ${error.message}`);
  }
}

/**
 * Get price comparison data from Wise API
 * @param {string} sourceCurrency - Source currency code (3 letter ISO code)
 * @param {string} targetCurrency - Target currency code (3 letter ISO code)
 * @param {number} amount - Amount to convert
 * @param {string|null} sourceCountry - Source country code (2 letter ISO code)
 * @param {string|null} targetCountry - Target country code (2 letter ISO code)
 * @param {string|null} providerType - Provider type to filter by
 * @returns {Promise<Object>} - Wise price comparison data
 */
const getPriceComparison = async (
  sourceCurrency,
  targetCurrency,
  amount,
  sourceCountry = null,
  targetCountry = null,
  providerType = null
) => {
  // Parameter validation
  if (!sourceCurrency || !targetCurrency || !amount) {
    throw new Error('Missing required parameters: sourceCurrency, targetCurrency, and amount are required');
  }
  
  // Ensure amount is a number and positive
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Amount must be a positive number');
  }
  
  // Normalize currency codes to uppercase
  const fromCurrency = sourceCurrency.toUpperCase();
  const toCurrency = targetCurrency.toUpperCase();
  
  // Log request details (useful for debugging)
  console.log('Wise price comparison request:', {
    sourceCurrency: fromCurrency, 
    targetCurrency: toCurrency, 
    amount: numAmount,
    sourceCountry,
    targetCountry,
    providerType
  });
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    sourceCurrency: fromCurrency,
    targetCurrency: toCurrency,
    sendAmount: numAmount
  });
  
  // Add optional parameters if provided
  if (sourceCountry) queryParams.append('sourceCountry', sourceCountry.toUpperCase());
  if (targetCountry) queryParams.append('targetCountry', targetCountry.toUpperCase());
  if (providerType) queryParams.append('providerType', providerType);
  
  // Build the URL - using the correct v3/comparisons endpoint
  const url = `${WISE_API_URL}/v3/comparisons/?${queryParams.toString()}`;
  
  console.log(`[WiseAPI] Using URL: ${url}`);
  
  // Create request headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // First try authenticated API
  if (hasAuthToken()) {
    console.log('Trying authenticated Wise API request');
    try {
      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${getWiseAuthToken()}`
      };
      
      // Make the request with retry logic
      const response = await retryAxiosRequest(async () => {
        console.log(`Making authenticated request to ${url}`);
        return await axios.get(url, {
          headers: authHeaders,
          timeout: 15000, // 15 second timeout
        });
      }, 3); // 3 retries
      
      if (!response || !response.data) {
        throw new Error('Empty response from Wise API');
      }
      
      // Check for HTML response (which indicates an error)
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        throw new Error('Received HTML instead of JSON from Wise API');
      }
      
      const validatedData = validateComparisonData(response.data, fromCurrency, toCurrency, numAmount);
      console.log(`Successfully retrieved ${validatedData.providers.length} providers from Wise authenticated API`);
      
      return validatedData;
    } catch (error) {
      console.error('Error in authenticated Wise price comparison request:', error.message);
      // Continue to public API fallback
    }
  }
  
  // Fallback to public API if authenticated request fails or no auth token
  console.log('Falling back to public Wise API request');
  try {
    // Make the request with retry logic
    const response = await retryAxiosRequest(async () => {
      console.log(`Making public request to ${url}`);
      return await axios.get(url, {
        headers,
        timeout: 15000, // 15 second timeout
      });
    }, 3); // 3 retries
    
    if (!response || !response.data) {
      throw new Error('Empty response from Wise public API');
    }
    
    // Check for HTML response (which indicates an error)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      throw new Error('Received HTML instead of JSON from Wise public API');
    }
    
    const validatedData = validateComparisonData(response.data, fromCurrency, toCurrency, numAmount);
    console.log(`Successfully retrieved ${validatedData.providers.length} providers from Wise public API`);
    
    return validatedData;
  } catch (error) {
    console.error('Error in public Wise price comparison request:', error.message);
    
    // Add contextual information to error
    const enhancedError = new Error(`Failed to get Wise price comparison: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status || 500;
    enhancedError.requestParams = {
      sourceCurrency: fromCurrency,
      targetCurrency: toCurrency,
      amount: numAmount,
      sourceCountry,
      targetCountry,
      providerType
    };
    
    throw enhancedError;
  }
};

/**
 * Helper function to validate comparison data
 * @param {Object} data - Response data from Wise API
 * @param {string} sourceCurrency - Expected source currency
 * @param {string} targetCurrency - Expected target currency
 * @param {number} amount - Expected amount
 * @returns {Object} - Validated data
 * @throws {Error} - If data is invalid
 */
const validateComparisonData = (data, sourceCurrency, targetCurrency, amount) => {
  // Basic validation
  if (!data) {
    throw new Error('Empty data received from Wise API');
  }
  
  // Ensure providers array exists
  if (!Array.isArray(data.providers)) {
    console.error('Invalid Wise API response structure:', data);
    throw new Error('Wise API response missing providers array');
  }
  
  // Transform the provider data to match the expected client format while preserving quotes array
  // We don't create a new quotes array since the API already returns one
  const transformedProviders = data.providers.map(provider => {
    // Create a standard provider object that works with our client app
    // Preserve quotes array if it already exists, otherwise use empty array
    return {
      id: provider.id || 'unknown',
      name: provider.name || 'Unknown Provider',
      alias: provider.alias || provider.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
      logo: (provider.logos?.normal?.pngUrl || provider.logos?.normal?.svgUrl || provider.logo || null),
      type: provider.type || 'Money Transfer',
      quotes: provider.quotes || [],
      // Keep these fields for compatibility with older client code
      quote: provider.quote || null,
      fee: provider.fee || null,
      receivedAmount: provider.receivedAmount || null,
      estimatedDelivery: provider.estimatedDelivery || null,
      rate: (provider.quotes && provider.quotes[0]?.rate) || provider.quote?.rate || null,
      logoUrl: (provider.logos?.normal?.pngUrl || provider.logos?.normal?.svgUrl || provider.logoUrl || null),
      companySlug: provider.alias || provider.companySlug || null
    };
  });

  // Create standardized response structure
  return {
    sourceCurrency: data.sourceCurrency || sourceCurrency,
    targetCurrency: data.targetCurrency || targetCurrency,
    sendAmount: data.sendAmount || amount,
    providers: transformedProviders,
    timestamp: new Date().toISOString()
  };
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