const axios = require('axios');
const NodeCache = require('node-cache');
const WiseRateCache = require('../models/WiseRateCache');

// In-memory cache for 5 minutes (current rates) and 1 hour (historical rates)
const currentRateCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
const historicalRateCache = new NodeCache({ stdTTL: 3600, checkperiod: 300 });

class WiseRatesService {
  constructor() {
    this.baseUrl = 'https://api.wise.com';
    this.initialized = false;
    this.clientId = null;
    this.clientSecret = null;
    this.authHeader = null;
  }

  async initialize() {
    if (this.initialized) return;
    
    console.log('[WiseRates] Initializing Wise Rates API service');
    
    // Check if we have the necessary Wise API credentials in env vars
    const clientId = process.env.WISE_CLIENT_ID;
    const clientSecret = process.env.WISE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('[WiseRates] ERROR: WISE_CLIENT_ID or WISE_CLIENT_SECRET is not set in environment variables');
      console.error('[WiseRates] This may be because the .env file is not being loaded correctly');
      console.error('[WiseRates] Please check that dotenv is configured correctly in your application');
      this.initialized = true;
      return;
    }
    
    // Log the credentials length and a few characters for debugging
    console.log(`[WiseRates] Using Client ID: ${clientId}`);
    console.log(`[WiseRates] Using Client Secret (length: ${clientSecret.length}): ${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}`);
    
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    // Create Basic Authentication header
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    this.authHeader = `Basic ${auth}`;
    
    console.log('[WiseRates] Wise Rates API service initialized with Basic Authentication');
    this.initialized = true;
  }

  /**
   * Get current exchange rate from Wise API
   * @param {string} sourceCurrency Source currency code (e.g., USD)
   * @param {string} targetCurrency Target currency code (e.g., EUR)
   * @returns {Promise<Object>} Current exchange rate data
   */
  async getCurrentRate(sourceCurrency, targetCurrency) {
    await this.initialize();
    
    console.log(`[WiseRates] Getting current rate for ${sourceCurrency} to ${targetCurrency}`);
    
    // If no authentication header is available, throw an error
    if (!this.authHeader) {
      throw new Error('Wise API authentication is not configured. Check your environment variables.');
    }
    
    // Create a cache key for this specific request
    const cacheKey = `current_rate_${sourceCurrency}_${targetCurrency}`;
    
    // Try getting the results from memory cache first
    const cachedResults = currentRateCache.get(cacheKey);
    if (cachedResults) {
      console.log(`[WiseRates] Using memory-cached current rate data for ${sourceCurrency} to ${targetCurrency}`);
      return cachedResults;
    }
    
    // Check if we have cached data in the database (less than 5 minutes old)
    try {
      const cachedData = await WiseRateCache.findOne({
        source: sourceCurrency,
        target: targetCurrency,
        type: 'current',
        createdAt: { $gte: new Date(Date.now() - 300000) } // Within the last 5 minutes
      });
      
      if (cachedData && cachedData.rate) {
        console.log('[WiseRates] Using database-cached current rate data');
        
        // Store in memory cache
        currentRateCache.set(cacheKey, cachedData.rate);
        return cachedData.rate;
      }
    } catch (dbError) {
      console.warn('[WiseRates] Could not check database cache, continuing with fresh data:', dbError.message);
    }
    
    // If no cache, fetch new data from Wise API
    console.log('[WiseRates] Fetching fresh current rate data from Wise API');
    
    try {
      const url = `${this.baseUrl}/v1/rates?source=${sourceCurrency}&target=${targetCurrency}`;
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      };
      
      console.log('[WiseRates] Making API request for current rate');
      
      const response = await axios.get(url, { headers });
      
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error('[WiseRates] Invalid API response:', response.data);
        throw new Error('Invalid response from Wise Rates API');
      }
      
      console.log('[WiseRates] Successful API response received');
      
      // Return the first rate in the array
      const rateData = response.data[0];
      
      // Store the data in database
      try {
        await WiseRateCache.create({
          source: sourceCurrency,
          target: targetCurrency,
          type: 'current',
          rate: rateData
        });
        
        console.log('[WiseRates] Successfully stored current rate data in database cache');
      } catch (cacheError) {
        console.warn('[WiseRates] Could not store data in database cache:', cacheError.message);
      }
      
      // Store in memory cache
      currentRateCache.set(cacheKey, rateData);
      
      return rateData;
    } catch (error) {
      // Log more detailed error information
      console.error('[WiseRates] Error fetching current rate data from Wise API:');
      console.error(`[WiseRates] Status: ${error.response?.status}`);
      console.error(`[WiseRates] Data: ${JSON.stringify(error.response?.data || {})}`);
      console.error(`[WiseRates] Message: ${error.message}`);
      
      // Check for 401 errors which indicate authentication issues
      if (error.response?.status === 401) {
        console.error('[WiseRates] AUTHENTICATION ERROR: Your Wise API credentials are invalid or expired');
        console.error('[WiseRates] Please check your WISE_CLIENT_ID and WISE_CLIENT_SECRET in the .env file');
      }
      
      throw new Error(`Failed to fetch current rate data from Wise API: ${error.message}`);
    }
  }

  /**
   * Get historical exchange rate from Wise API for a specific time
   * @param {string} sourceCurrency Source currency code
   * @param {string} targetCurrency Target currency code
   * @param {string} time Timestamp in ISO format
   * @returns {Promise<Object>} Historical exchange rate data
   */
  async getHistoricalRate(sourceCurrency, targetCurrency, time) {
    await this.initialize();
    
    console.log(`[WiseRates] Getting historical rate for ${sourceCurrency} to ${targetCurrency} at time ${time}`);
    
    // If no authentication header is available, throw an error
    if (!this.authHeader) {
      throw new Error('Wise API authentication is not configured. Check your environment variables.');
    }
    
    // Create a cache key for this specific request
    const cacheKey = `historical_rate_${sourceCurrency}_${targetCurrency}_${time}`;
    
    // Try getting the results from memory cache first
    const cachedResults = historicalRateCache.get(cacheKey);
    if (cachedResults) {
      console.log(`[WiseRates] Using memory-cached historical rate data for ${sourceCurrency} to ${targetCurrency} at ${time}`);
      return cachedResults;
    }
    
    // Check if we have cached data in the database
    try {
      const cachedData = await WiseRateCache.findOne({
        source: sourceCurrency,
        target: targetCurrency,
        type: 'historical',
        timeKey: time
      });
      
      if (cachedData && cachedData.rate) {
        console.log('[WiseRates] Using database-cached historical rate data');
        
        // Store in memory cache
        historicalRateCache.set(cacheKey, cachedData.rate);
        return cachedData.rate;
      }
    } catch (dbError) {
      console.warn('[WiseRates] Could not check database cache, continuing with fresh data:', dbError.message);
    }
    
    // If no cache, fetch new data from Wise API
    console.log('[WiseRates] Fetching fresh historical rate data from Wise API');
    
    try {
      const url = `${this.baseUrl}/v1/rates?source=${sourceCurrency}&target=${targetCurrency}&time=${time}`;
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      };
      
      console.log('[WiseRates] Making API request for historical rate');
      
      const response = await axios.get(url, { headers });
      
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error('[WiseRates] Invalid API response:', response.data);
        throw new Error('Invalid response from Wise Rates API');
      }
      
      console.log('[WiseRates] Successful API response received');
      
      // Return the first rate in the array
      const rateData = response.data[0];
      
      // Store the data in database
      try {
        await WiseRateCache.create({
          source: sourceCurrency,
          target: targetCurrency,
          type: 'historical',
          timeKey: time,
          rate: rateData
        });
        
        console.log('[WiseRates] Successfully stored historical rate data in database cache');
      } catch (cacheError) {
        console.warn('[WiseRates] Could not store data in database cache:', cacheError.message);
      }
      
      // Store in memory cache
      historicalRateCache.set(cacheKey, rateData);
      
      return rateData;
    } catch (error) {
      // Log more detailed error information
      console.error('[WiseRates] Error fetching historical rate data from Wise API:');
      console.error(`[WiseRates] Status: ${error.response?.status}`);
      console.error(`[WiseRates] Data: ${JSON.stringify(error.response?.data || {})}`);
      console.error(`[WiseRates] Message: ${error.message}`);
      
      // Check for 401 errors which indicate authentication issues
      if (error.response?.status === 401) {
        console.error('[WiseRates] AUTHENTICATION ERROR: Your Wise API credentials are invalid or expired');
        console.error('[WiseRates] Please check your WISE_CLIENT_ID and WISE_CLIENT_SECRET in the .env file');
      }
      
      throw new Error(`Failed to fetch historical rate data from Wise API: ${error.message}`);
    }
  }

  /**
   * Get historical exchange rates from Wise API for a time period
   * @param {string} sourceCurrency Source currency code
   * @param {string} targetCurrency Target currency code
   * @param {string} fromDate Start date/time in ISO format
   * @param {string} toDate End date/time in ISO format
   * @param {string} group Grouping interval (day, hour, minute)
   * @returns {Promise<Array>} Array of historical exchange rate data
   */
  async getHistoricalRates(sourceCurrency, targetCurrency, fromDate, toDate, group = 'day') {
    await this.initialize();
    
    console.log(`[WiseRates] Getting historical rates for ${sourceCurrency} to ${targetCurrency} from ${fromDate} to ${toDate} grouped by ${group}`);
    
    // If no authentication header is available, throw an error
    if (!this.authHeader) {
      throw new Error('Wise API authentication is not configured. Check your environment variables.');
    }
    
    // Create a cache key for this specific request
    const cacheKey = `historical_rates_${sourceCurrency}_${targetCurrency}_${fromDate}_${toDate}_${group}`;
    
    // Try getting the results from memory cache first
    const cachedResults = historicalRateCache.get(cacheKey);
    if (cachedResults) {
      console.log(`[WiseRates] Using memory-cached historical rates data for ${sourceCurrency} to ${targetCurrency}`);
      return cachedResults;
    }
    
    // Check if we have cached data in the database
    try {
      const cachedData = await WiseRateCache.findOne({
        source: sourceCurrency,
        target: targetCurrency,
        type: 'historical_range',
        timeKey: `${fromDate}_${toDate}_${group}`
      });
      
      if (cachedData && cachedData.rates) {
        console.log('[WiseRates] Using database-cached historical rates data');
        
        // Store in memory cache
        historicalRateCache.set(cacheKey, cachedData.rates);
        return cachedData.rates;
      }
    } catch (dbError) {
      console.warn('[WiseRates] Could not check database cache, continuing with fresh data:', dbError.message);
    }
    
    // If no cache, fetch new data from Wise API
    console.log('[WiseRates] Fetching fresh historical rates data from Wise API');
    
    try {
      const url = `${this.baseUrl}/v1/rates?source=${sourceCurrency}&target=${targetCurrency}&from=${fromDate}&to=${toDate}&group=${group}`;
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      };
      
      console.log('[WiseRates] Making API request for historical rates');
      
      const response = await axios.get(url, { headers });
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('[WiseRates] Invalid API response:', response.data);
        throw new Error('Invalid response from Wise Rates API');
      }
      
      console.log('[WiseRates] Successful API response received with', response.data.length, 'data points');
      
      // Return the array of rates
      const ratesData = response.data;
      
      // Store the data in database
      try {
        await WiseRateCache.create({
          source: sourceCurrency,
          target: targetCurrency,
          type: 'historical_range',
          timeKey: `${fromDate}_${toDate}_${group}`,
          rates: ratesData
        });
        
        console.log('[WiseRates] Successfully stored historical rates data in database cache');
      } catch (cacheError) {
        console.warn('[WiseRates] Could not store data in database cache:', cacheError.message);
      }
      
      // Store in memory cache
      historicalRateCache.set(cacheKey, ratesData);
      
      return ratesData;
    } catch (error) {
      // Log more detailed error information
      console.error('[WiseRates] Error fetching historical rates data from Wise API:');
      console.error(`[WiseRates] Status: ${error.response?.status}`);
      console.error(`[WiseRates] Data: ${JSON.stringify(error.response?.data || {})}`);
      console.error(`[WiseRates] Message: ${error.message}`);
      
      // Check for 401 errors which indicate authentication issues
      if (error.response?.status === 401) {
        console.error('[WiseRates] AUTHENTICATION ERROR: Your Wise API credentials are invalid or expired');
        console.error('[WiseRates] Please check your WISE_CLIENT_ID and WISE_CLIENT_SECRET in the .env file');
      }
      
      throw new Error(`Failed to fetch historical rates data from Wise API: ${error.message}`);
    }
  }
}

module.exports = new WiseRatesService(); 