const axios = require('axios');
const WiseCache = require('../models/WiseCache');
const NodeCache = require('node-cache');

// In-memory cache for 2 minutes
const memoryCache = new NodeCache({ stdTTL: 120, checkperiod: 30 });

class WiseApiService {
  constructor() {
    this.baseUrl = 'https://api.wise.com';
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    // Check if we have the necessary Wise API credentials
    if (!process.env.WISE_CLIENT_ID || !process.env.WISE_CLIENT_SECRET) {
      console.warn('Wise API credentials are not configured. Wise comparison API will not be available.');
      this.initialized = true;
      return;
    }

    console.log('Initializing Wise API service with credentials');
    console.log(`Client ID: ${process.env.WISE_CLIENT_ID}`);
    console.log(`Client Secret: ${process.env.WISE_CLIENT_SECRET ? '******' : 'Not set'}`);
    
    this.initialized = true;
  }

  /**
   * Get comparison data from Wise API
   * @param {string} sourceCurrency Source currency code (e.g., USD)
   * @param {string} targetCurrency Target currency code (e.g., EUR)
   * @param {number} sendAmount Amount to send
   * @returns {Promise<Object>} Wise comparison data
   */
  async getComparison(sourceCurrency, targetCurrency, sendAmount) {
    await this.initialize();
    
    console.log(`[WiseApi] Getting comparison for ${sourceCurrency} to ${targetCurrency}, amount: ${sendAmount}`);
    
    // Create a cache key for this specific request
    const cacheKey = `wise_comparison_${sourceCurrency}_${targetCurrency}_${sendAmount}`;
    
    // Try getting the results from memory cache first
    const cachedResults = memoryCache.get(cacheKey);
    if (cachedResults) {
      console.log(`[WiseApi] Using memory-cached comparison data for ${sourceCurrency} to ${targetCurrency}`);
      return cachedResults;
    }
    
    // Check if we have cached data in the database
    try {
      const cachedData = await WiseCache.findOne({
        sourceCurrency,
        targetCurrency,
        sendAmount,
        createdAt: { $gte: new Date(Date.now() - 120000) } // Within the last 2 minutes
      });
      
      if (cachedData && cachedData.providers) {
        console.log('[WiseApi] Using database-cached comparison data');
        
        // Store in memory cache
        memoryCache.set(cacheKey, cachedData.providers);
        return cachedData.providers;
      }
    } catch (dbError) {
      console.warn('[WiseApi] Could not check database cache, continuing with fresh data:', dbError.message);
    }
    
    // If no cache, fetch new data from Wise API
    console.log('[WiseApi] Fetching fresh comparison data from Wise API');
    
    try {
      const url = `${this.baseUrl}/v4/comparisons/?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${sendAmount}`;
      
      // Create authorization using the proper OAuth2 Bearer token format
      // or Basic Auth depending on what Wise API expects
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      // Option 1: Bearer token authentication (most common for API keys)
      headers['Authorization'] = `Bearer ${process.env.WISE_CLIENT_SECRET}`;
      
      // Option 2: Basic authentication (username:password)
      // const basicAuth = Buffer.from(`${process.env.WISE_CLIENT_ID}:${process.env.WISE_CLIENT_SECRET}`).toString('base64');
      // headers['Authorization'] = `Basic ${basicAuth}`;
      
      // Option 3: API key as a query parameter (less secure, use only if required by API)
      // const urlWithKey = `${url}&apiKey=${process.env.WISE_CLIENT_SECRET}`;
      
      console.log('[WiseApi] Making API request with Bearer token authentication');
      
      const response = await axios.get(url, { headers });
      
      if (!response.data || !response.data.providers) {
        console.error('[WiseApi] Invalid API response:', response.data);
        throw new Error('Invalid response from Wise API');
      }
      
      console.log('[WiseApi] Successful API response received');
      
      // Store the data in database
      try {
        await WiseCache.create({
          sourceCurrency,
          targetCurrency,
          sendAmount,
          providers: response.data.providers
        });
        
        console.log('[WiseApi] Successfully stored comparison data in database cache');
      } catch (cacheError) {
        console.warn('[WiseApi] Could not store data in database cache:', cacheError.message);
      }
      
      // Store in memory cache
      memoryCache.set(cacheKey, response.data.providers);
      
      return response.data.providers;
    } catch (error) {
      // Log more detailed error information
      console.error('[WiseApi] Error fetching comparison data from Wise API:');
      console.error(`[WiseApi] Status: ${error.response?.status}`);
      console.error(`[WiseApi] Data: ${JSON.stringify(error.response?.data || {})}`);
      console.error(`[WiseApi] Message: ${error.message}`);
      
      throw new Error(`Failed to fetch comparison data from Wise API: ${error.message}`);
    }
  }
  
  /**
   * Format Wise API provider data to match the application's provider format
   * @param {Array} wiseProviders Array of providers from Wise API
   * @param {string} fromCurrency Source currency code
   * @param {string} toCurrency Target currency code 
   * @param {number} amount Amount to send
   * @returns {Array} Formatted provider data
   */
  formatProvidersForFrontend(wiseProviders, fromCurrency, toCurrency, amount) {
    if (!wiseProviders || !Array.isArray(wiseProviders)) {
      return [];
    }
    
    return wiseProviders.map(provider => {
      // Select the first quote if there are multiple
      const quote = provider.quotes && provider.quotes.length > 0 ? provider.quotes[0] : null;
      
      if (!quote) {
        return null; // Skip if no quote
      }
      
      // Parse ISO duration to hours
      const getHoursFromDuration = (duration) => {
        if (!duration) return 0;
        
        // Simple regex to extract hours, days, and minutes from ISO duration
        const daysMatch = duration.match(/(\d+)D/);
        const hoursMatch = duration.match(/(\d+)H/);
        const minutesMatch = duration.match(/(\d+)M(?!S)/); // Match minutes but not seconds
        
        let totalHours = 0;
        
        if (daysMatch && daysMatch[1]) {
          totalHours += parseInt(daysMatch[1]) * 24;
        }
        
        if (hoursMatch && hoursMatch[1]) {
          totalHours += parseInt(hoursMatch[1]);
        }
        
        if (minutesMatch && minutesMatch[1]) {
          totalHours += parseInt(minutesMatch[1]) / 60;
        }
        
        return totalHours > 0 ? totalHours : 24; // Default to 24 hours if we can't parse
      };
      
      // Get transfer time hours from delivery estimation
      const transferTimeHours = {
        min: quote.deliveryEstimation && quote.deliveryEstimation.duration && quote.deliveryEstimation.duration.min 
          ? getHoursFromDuration(quote.deliveryEstimation.duration.min) : 24,
        max: quote.deliveryEstimation && quote.deliveryEstimation.duration && quote.deliveryEstimation.duration.max 
          ? getHoursFromDuration(quote.deliveryEstimation.duration.max) : 72
      };
      
      // Get delivery time text in a more human-readable format
      const getDeliveryTimeText = (hours) => {
        // If min and max are the same
        if (hours.min === hours.max) {
          const hoursValue = hours.min;
          
          // If less than 24 hours, show in hours and minutes
          if (hoursValue < 24) {
            const wholeHours = Math.floor(hoursValue);
            const minutes = Math.round((hoursValue - wholeHours) * 60);
            
            if (minutes > 0) {
              return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
              return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
            }
          } 
          // If more than 24 hours, show in days
          else {
            const days = Math.ceil(hoursValue / 24);
            return `${days} day${days !== 1 ? 's' : ''}`;
          }
        } 
        // If min and max are different
        else {
          // If both are under 24 hours
          if (hours.min < 24 && hours.max < 24) {
            const minHours = Math.floor(hours.min);
            const minMinutes = Math.round((hours.min - minHours) * 60);
            const maxHours = Math.floor(hours.max);
            const maxMinutes = Math.round((hours.max - maxHours) * 60);
            
            // Format as "X-Y hours"
            return `${minHours}-${maxHours} hour${maxHours !== 1 ? 's' : ''}`;
          }
          // If one is under 24 hours and one is over
          else if (hours.min < 24 && hours.max >= 24) {
            const minHours = Math.floor(hours.min);
            const maxDays = Math.ceil(hours.max / 24);
            
            return `${minHours} hour${minHours !== 1 ? 's' : ''} - ${maxDays} day${maxDays !== 1 ? 's' : ''}`;
          }
          // If both are over 24 hours
          else {
            const minDays = Math.ceil(hours.min / 24);
            const maxDays = Math.ceil(hours.max / 24);
            
            return `${minDays}-${maxDays} day${maxDays !== 1 ? 's' : ''}`;
          }
        }
      };
      
      // Calculate markup percentage if available
      const markup = quote.markup ? quote.markup : 0;
      
      // Get base rate without markup
      // If we know it's considered mid-market, use the rate directly
      // Otherwise, we need to adjust to get the base rate by removing markup
      const baseRate = quote.isConsideredMidMarketRate 
        ? quote.rate 
        : quote.rate / (1 + markup / 100);
      
      // Generate a unique ID prefixed with "wise-" to avoid collisions
      const providerId = `wise-${provider.id || provider.alias || Math.random().toString(36).substring(2, 10)}`;
      
      return {
        providerId,
        providerCode: provider.alias || '',
        providerName: provider.name || 'Unknown',
        providerLogo: provider.logos && provider.logos.normal ? provider.logos.normal.pngUrl : '',
        baseRate: baseRate || 0,
        effectiveRate: quote.rate || 0,
        transferFee: quote.fee || 0,
        marginPercentage: markup || 0,
        marginCost: (amount * markup / 100) || 0,
        totalCost: quote.fee + (amount * markup / 100) || 0,
        amountReceived: quote.receivedAmount || 0,
        transferTimeHours,
        transferTime: getDeliveryTimeText(transferTimeHours),
        rating: 4.5, // Default rating if not available
        methods: ['bank_transfer'],
        realTimeApi: true,
        isIndicative: false,
        timestamp: new Date().toISOString(),
        fromWiseApi: true // Mark as coming from Wise API
      };
    }).filter(Boolean); // Remove null items
  }
}

module.exports = new WiseApiService(); 