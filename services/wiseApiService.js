const axios = require('axios');
const axiosRateLimit = require('axios-rate-limit');
const { default: axiosRetry } = require('axios-retry');
const NodeCache = require('node-cache');

// Cache configuration - items expire after 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Create rate-limited Axios instance (max 10 requests per second)
const http = axiosRateLimit(axios.create({
  baseURL: 'https://api.wise.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.WISE_API_KEY}`
  }
}), { maxRequests: 10, perMilliseconds: 1000 });

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
 * Get the latest exchange rate from the Wise API
 * @param {string} sourceCurrency - The source currency code (e.g. 'USD')
 * @param {string} targetCurrency - The target currency code (e.g. 'EUR')
 * @param {number} sourceAmount - The amount to convert (defaults to 1000)
 * @returns {Promise} - Promise resolving to the exchange rate data
 */
async function getExchangeRate(sourceCurrency, targetCurrency, sourceAmount = 1000) {
  const cacheKey = `wise_rate_${sourceCurrency}_${targetCurrency}_${sourceAmount}`;
  
  // Try to get data from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Returning cached exchange rate for ${sourceCurrency} to ${targetCurrency}`);
    return cachedData;
  }

  try {
    // Query parameters for the request
    const params = {
      source: sourceCurrency,
      target: targetCurrency,
      amount: sourceAmount
    };

    // Make the API request
    const response = await http.get('/rates', { params });
    
    // Process the response
    const rateData = {
      rate: response.data.rate,
      fee: response.data.fee || 0,
      estimatedDelivery: response.data.estimatedDelivery,
      sourceAmount,
      targetAmount: response.data.targetAmount,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, rateData);
    
    return rateData;
  } catch (error) {
    console.error(`Error fetching Wise exchange rate: ${error.message}`);
    throw new Error(`Wise API Error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Get available currency routes from Wise API
 * @returns {Promise} - Promise resolving to array of available currency pairs
 */
async function getAvailableCurrencies() {
  const cacheKey = 'wise_available_currencies';
  
  // Try to get data from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached currency routes');
    return cachedData;
  }

  try {
    const response = await http.get('/currency-pairs');
    
    // Store in cache for 24 hours (currency routes don't change often)
    cache.set(cacheKey, response.data, 86400);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching Wise currency routes: ${error.message}`);
    throw new Error(`Wise API Error: ${error.response?.data?.message || error.message}`);
  }
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
 * Get the estimated fee for a money transfer
 * @param {string} sourceCurrency 
 * @param {string} targetCurrency 
 * @param {number} amount 
 * @returns {Promise} - Promise resolving to fee data
 */
async function getTransferFee(sourceCurrency, targetCurrency, amount) {
  const cacheKey = `wise_fee_${sourceCurrency}_${targetCurrency}_${amount}`;
  
  // Try to get data from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Returning cached fee for ${sourceCurrency} to ${targetCurrency}`);
    return cachedData;
  }

  try {
    const params = {
      source: sourceCurrency,
      target: targetCurrency,
      amount: amount
    };

    const response = await http.get('/quotes', { params });
    
    const feeData = {
      fee: response.data.fee,
      rate: response.data.rate,
      estimatedDelivery: response.data.estimatedDelivery,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, feeData);
    
    return feeData;
  } catch (error) {
    console.error(`Error fetching Wise fee: ${error.message}`);
    throw new Error(`Wise API Error: ${error.response?.data?.message || error.message}`);
  }
}

module.exports = {
  getExchangeRate,
  getAvailableCurrencies,
  getTransferFee,
  clearCache
};