const axios = require('axios');
const axiosRateLimit = require('axios-rate-limit');
const { default: axiosRetry } = require('axios-retry');
const NodeCache = require('node-cache');

// Cache configuration - items expire after 30 minutes (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

// Get credentials from environment
const clientId = process.env.OFX_CLIENT_ID;
const clientSecret = process.env.OFX_CLIENT_SECRET;
const isSandboxMode = process.env.ENABLE_SANDBOX_MODE === 'true';

// Determine the base URL based on sandbox mode
const baseUrl = isSandboxMode ? 'https://sandbox.api.ofx.com' : 'https://api.ofx.com';

// Create HTTP client with rate limiting
const http = axiosRateLimit(axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
}), { maxRequests: 5, perMilliseconds: 1000 }); // Lower rate limit for OFX API

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
 * Get an access token from the OFX API using client credentials flow
 * @returns {Promise<string>} - The access token
 */
async function getAccessToken() {
  // Check cache first
  const cachedToken = cache.get('ofx_access_token');
  if (cachedToken) {
    console.log('[OFX API] Using cached access token');
    return cachedToken;
  }

  console.log('[OFX API] Getting new access token');
  try {
    const tokenResponse = await axios.post(
      `${baseUrl}/v1/oauth/token`,
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=ofxrates`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      throw new Error('Failed to get access token from OFX API');
    }

    const accessToken = tokenResponse.data.access_token;
    const expiresIn = tokenResponse.data.expires_in || 3600; // Default to 1 hour if not specified

    // Cache the token for slightly less than its expiry time
    cache.set('ofx_access_token', accessToken, expiresIn - 60);
    console.log(`[OFX API] Access token received, expires in ${expiresIn} seconds`);

    return accessToken;
  } catch (error) {
    console.error('[OFX API] Error getting access token:', error.message);
    if (error.response) {
      console.error('[OFX API] Response status:', error.response.status);
      console.error('[OFX API] Response data:', JSON.stringify(error.response.data));
    }
    throw new Error(`Failed to get OFX access token: ${error.message}`);
  }
}

/**
 * Test if the OFX API credentials are valid
 * @returns {Promise<Object>} - Object containing success status and message
 */
async function testApiCredentials() {
  try {
    // Try to get an access token as a simple API test
    const accessToken = await getAccessToken();
    return {
      success: true,
      message: 'OFX API credentials are valid'
    };
  } catch (error) {
    console.error(`OFX API credentials test failed: ${error.message}`);
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get the exchange rate from the OFX API
 * @param {string} sourceCurrency - Source currency code
 * @param {string} targetCurrency - Target currency code
 * @param {number} amount - Amount to convert
 * @returns {Promise<Object>} - Exchange rate information
 */
async function getExchangeRate(sourceCurrency, targetCurrency, amount = 1000) {
  try {
    // Create a cache key for this specific request
    const cacheKey = `ofx_rate_${sourceCurrency}_${targetCurrency}_${amount}`;
    
    // Check cache first
    const cachedRate = cache.get(cacheKey);
    if (cachedRate) {
      console.log(`[OFX API] Using cached exchange rate for ${sourceCurrency} to ${targetCurrency}`);
      return cachedRate;
    }

    // Get a fresh access token
    const accessToken = await getAccessToken();

    // Make the API request to get the rate
    const rateUrl = `${baseUrl}/v1/ofxrates/${sourceCurrency}/${targetCurrency}/${amount}`;
    console.log(`[OFX API] Making request to: ${rateUrl}`);

    const rateResponse = await axios.get(rateUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!rateResponse.data || !rateResponse.data.ofxRate) {
      throw new Error('No rate returned from OFX API');
    }

    console.log(`[OFX API] Received rate from OFX: ${rateResponse.data.ofxRate}`);

    // Set delivery time based on currency pair
    let deliveryTimeText = '';
    // Major currencies (faster delivery)
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD'];
    if (majorCurrencies.includes(sourceCurrency) && majorCurrencies.includes(targetCurrency)) {
      deliveryTimeText = '1-2 business days';
    } else {
      deliveryTimeText = '2-3 business days';
    }

    // OFX typically has a flat fee structure based on amount
    // Default to no fee or a minimal fee depending on the implementation needs
    const transferFee = calculateOFXFee(sourceCurrency, amount);

    const result = {
      rate: rateResponse.data.ofxRate,
      fee: transferFee,
      sourceAmount: amount,
      targetAmount: rateResponse.data.convertedAmount,
      deliveryTime: deliveryTimeText
    };

    // Cache the result
    cache.set(cacheKey, result, 1800); // Cache for 30 minutes

    return result;
  } catch (error) {
    console.error(`[OFX API] Error getting exchange rate: ${error.message}`);
    if (error.response) {
      console.error('[OFX API] Response status:', error.response.status);
      console.error('[OFX API] Response data:', JSON.stringify(error.response.data));
    }
    throw new Error(`Failed to get exchange rate from OFX API: ${error.message}`);
  }
}

/**
 * Calculate OFX fee based on currency and amount
 * @param {string} sourceCurrency - Source currency code
 * @param {number} amount - Amount to transfer
 * @returns {number} - Fee amount
 */
function calculateOFXFee(sourceCurrency, amount) {
  // OFX typically has fee structures based on amount and currency
  // These values should be adjusted based on actual OFX fee structure
  
  // Example implementation:
  switch (sourceCurrency) {
    case 'USD':
      return amount >= 10000 ? 0 : 15;
    case 'EUR':
      return amount >= 8000 ? 0 : 15;
    case 'GBP':
      return amount >= 8000 ? 0 : 12;
    case 'AUD':
      return amount >= 10000 ? 0 : 15;
    case 'CAD':
      return amount >= 10000 ? 0 : 15;
    default:
      return 15; // Default fee for other currencies
  }
}

/**
 * Clear the cache
 * @param {string} key - Specific key to clear, or null to clear all
 */
function clearCache(key = null) {
  if (key) {
    console.log(`[OFX API] Clearing cache for key: ${key}`);
    cache.del(key);
  } else {
    console.log('[OFX API] Clearing all cache');
    cache.flushAll();
  }
}

/**
 * Check if OFX supports a currency pair
 * @param {string} sourceCurrency - Source currency code
 * @param {string} targetCurrency - Target currency code
 * @returns {boolean} - Whether the pair is supported
 */
function isCurrencyPairSupported(sourceCurrency, targetCurrency) {
  // OFX supported currencies
  // This list should be updated based on actual OFX supported currencies
  const supportedCurrencies = [
    'USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'JPY', 'CHF', 'HKD', 'SGD', 
    'ZAR', 'SEK', 'NOK', 'DKK', 'CNY', 'INR', 'MXN', 'THB', 'AED', 'PLN'
  ];

  return supportedCurrencies.includes(sourceCurrency) && 
         supportedCurrencies.includes(targetCurrency);
}

module.exports = {
  getExchangeRate,
  testApiCredentials,
  clearCache,
  isCurrencyPairSupported
}; 