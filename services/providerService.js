const axios = require('axios');
const Provider = require('../models/Provider');
const RateCache = require('../models/RateCache');
const NodeCache = require('node-cache');
const wiseApiService = require('./wiseApiService');

// In-memory cache for 15 minutes
const memoryCache = new NodeCache({ stdTTL: 900, checkperiod: 60 });

class ProviderService {
  constructor() {
    this.providers = {};
    this.initialized = false;
  }

  async isInitialized() {
    return this.initialized;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Add a default wise provider first, so we have at least one provider even if DB connection fails
      console.log('Setting up default Wise provider for testing');
      this.providers['wise'] = {
        id: 'wise-test-id',
        name: 'Wise',
        logo: '/images/providers/wise.png',
        apiKey: process.env.WISE_CLIENT_ID,
        apiSecret: process.env.WISE_CLIENT_SECRET,
        baseUrl: 'https://api.wise.com',
        transferFeeStructure: {
          type: 'percentage',
          percentage: 0.5,
          minimum: 2,
          maximum: 15
        },
        exchangeRateMargin: 0.005,
        transferTimeHours: {
          min: 1,
          max: 24
        },
        rating: 4.8,
        methods: ['bank_transfer', 'debit_card'],
        apiEnabled: true,
        apiHandler: 'wise'
      };
      
      // Try to load providers from database, but continue even if it fails
      try {
        // Load all active providers from the database
        const providers = await Provider.find({ active: true });
        
        for (const provider of providers) {
          this.providers[provider.code] = {
            id: provider._id,
            name: provider.name,
            logo: provider.logo,
            apiKey: provider.apiKey,
            apiSecret: provider.apiSecret,
            baseUrl: provider.baseUrl,
            transferFeeStructure: provider.transferFeeStructure,
            exchangeRateMargin: provider.exchangeRateMargin,
            transferTimeHours: provider.transferTimeHours,
            rating: provider.rating,
            methods: provider.methods,
            apiEnabled: provider.apiEnabled || false,
            apiHandler: provider.code.toLowerCase()
          };
        }
        console.log(`Loaded ${providers.length} providers from database`);
      } catch (dbError) {
        console.error('Error loading providers from database, using default provider only:', dbError.message);
      }
      
      this.initialized = true;
      console.log(`Initialized ${Object.keys(this.providers).length} providers`);
    } catch (error) {
      console.error('Error in provider service initialization:', error);
      // Even if there's an error, mark as initialized to prevent further attempts
      this.initialized = true;
      throw error;
    }
  }

  async getActiveProviders() {
    await this.initialize();
    return Object.values(this.providers).map(provider => ({
      id: provider.id,
      name: provider.name,
      logo: provider.logo,
      rating: provider.rating,
      methods: provider.methods,
      transferTimeHours: provider.transferTimeHours
    }));
  }

  async getExchangeRates(fromCurrency, targetCurrency, amount) {
    await this.initialize();
    
    console.log(`[getExchangeRates] Getting rates for ${fromCurrency} to ${targetCurrency}, amount: ${amount}`);
    console.log(`[getExchangeRates] Available providers:`, Object.keys(this.providers));
    
    // Create a cache key for this specific request
    const cacheKey = `rates_${fromCurrency}_${targetCurrency}_${amount}`;
    
    // Try getting the results from memory cache first
    const cachedResults = memoryCache.get(cacheKey);
    if (cachedResults) {
      console.log(`[getExchangeRates] Using memory-cached exchange rates for ${fromCurrency} to ${targetCurrency}`);
      return cachedResults;
    }
    
    // Check if we have cached rates in the database, but don't fail if DB has issues
    let cachedRates = null;
    try {
      cachedRates = await RateCache.findOne({
        fromCurrency,
        toCurrency: targetCurrency,
        createdAt: { $gte: new Date(Date.now() - 3600000) } // Within the last hour
      });
    } catch (dbError) {
      console.warn('[getExchangeRates] Could not check database cache, continuing with fresh rates:', dbError.message);
    }
    
    if (cachedRates) {
      console.log('[getExchangeRates] Using database-cached exchange rates');
      
      // Convert MongoDB Map to a regular JavaScript object to prevent iteration issues
      const ratesObject = {};
      if (cachedRates.rates && cachedRates.rates instanceof Map) {
        for (const [provider, rate] of cachedRates.rates.entries()) {
          ratesObject[provider] = rate;
        }
      } else if (cachedRates.rates && typeof cachedRates.rates === 'object') {
        // Handle case where rates might already be an object
        Object.assign(ratesObject, cachedRates.rates);
      }
      
      const results = this.calculateResults(ratesObject, fromCurrency, targetCurrency, amount);
      
      // Only use cached results if we actually got some
      if (results && results.length > 0) {
        // Store in memory cache
        memoryCache.set(cacheKey, results);
        return results;
      }
      
      // If no results from cache, we'll continue to fetch fresh rates
      console.log('[getExchangeRates] No results from cache, fetching fresh rates');
    }
    
    // If no cache, fetch new rates from provider APIs
    console.log('[getExchangeRates] Fetching fresh exchange rates');
    const providerRates = {};
    
    // Ensure we have at least the Wise provider configured
    if (Object.keys(this.providers).length === 0) {
      console.warn('[getExchangeRates] No providers found');
      throw new Error('No money transfer providers configured. Please make sure the Wise API credentials are properly set in your environment variables.');
    }
    
    // Try to get rates from each provider
    const providerPromises = Object.entries(this.providers).map(async ([code, provider]) => {
      try {
        console.log(`[getExchangeRates] Trying provider ${provider.name} (${provider.apiHandler})`);
        
        // Only attempt to fetch rates if the provider's API is enabled
        if (provider.apiEnabled) {
          const rate = await this.fetchRateFromProvider(provider, fromCurrency, targetCurrency, amount);
          console.log(`[getExchangeRates] Provider ${provider.name} returned rate: ${rate}`);
          providerRates[code] = rate;
        } else {
          console.log(`[getExchangeRates] Skipping provider ${provider.name} because API is not enabled`);
        }
      } catch (error) {
        console.error(`[getExchangeRates] Error fetching rate from ${provider.name}:`, error.message);
        // Don't include this provider in the results
      }
    });
    
    await Promise.all(providerPromises);
    
    console.log('[getExchangeRates] Providers with rates:', Object.keys(providerRates));
    
    // Check if we got any rates
    if (Object.keys(providerRates).length === 0) {
      console.error('[getExchangeRates] No providers returned valid rates');
      
      // Instead of throwing an error, try to use the Wise API directly
      try {
        console.log('[getExchangeRates] Trying direct Wise API call as fallback');
        const wiseRate = await wiseApiService.getExchangeRate(fromCurrency, targetCurrency, amount);
        
        if (wiseRate && wiseRate.rate) {
          console.log(`[getExchangeRates] Direct Wise API call succeeded with rate: ${wiseRate.rate}`);
          
          // Add a Wise provider with the direct rate
          providerRates['wise'] = wiseRate.rate;
          
          // If we have the wise provider, store the fee for later use
          if (this.providers['wise']) {
            if (!this.providers['wise'].transferFees) {
              this.providers['wise'].transferFees = {};
            }
            
            // Store the fee for this specific currency pair and amount
            const feeKey = `${fromCurrency}_${targetCurrency}_${amount}`;
            this.providers['wise'].transferFees[feeKey] = wiseRate.fee || 0;
          }
        } else {
          throw new Error('Direct Wise API call failed to return a valid rate');
        }
      } catch (wiseError) {
        console.error('[getExchangeRates] Direct Wise API call failed:', wiseError.message);
        throw new Error(`No valid exchange rates could be obtained for ${fromCurrency} to ${targetCurrency}. Please check your API credentials and try again.`);
      }
    }
    
    // Try to store in database cache, but don't fail if DB has issues
    try {
      // Create a Map for MongoDB storage
      const ratesMap = new Map();
      for (const [provider, rate] of Object.entries(providerRates)) {
        ratesMap.set(provider, rate);
      }
      
      await RateCache.create({
        fromCurrency,
        toCurrency: targetCurrency,
        rates: ratesMap
      });
      console.log('[getExchangeRates] Successfully stored rates in database cache');
    } catch (cacheError) {
      console.warn('[getExchangeRates] Could not store rates in database cache:', cacheError.message);
    }
    
    const results = this.calculateResults(providerRates, fromCurrency, targetCurrency, amount);
    
    // Store in memory cache
    memoryCache.set(cacheKey, results);
    
    console.log(`[getExchangeRates] Returning ${results.length} provider results`);
    return results;
  }
  
  calculateResults(providerRates, fromCurrency, targetCurrency, amount) {
    console.log(`[CalculateResults] Starting calculation for ${fromCurrency} to ${targetCurrency}, amount ${amount}`);
    console.log(`[CalculateResults] Provider rates received:`, providerRates);
    
    const results = [];
    
    // Ensure providerRates is a regular object, not a Map
    const ratesObject = providerRates instanceof Map 
      ? Object.fromEntries(providerRates) 
      : providerRates;
    
    for (const [code, rate] of Object.entries(ratesObject)) {
      console.log(`[CalculateResults] Processing provider ${code} with rate ${rate}`);
      
      const provider = this.providers[code];
      if (!rate || !provider) {
        console.log(`[CalculateResults] Skipping provider ${code} - invalid rate or provider not found`);
        continue;
      }
      
      console.log(`[CalculateResults] Provider ${provider.name} found, calculating fees...`);
      
      // Calculate transfer fee based on the provider's fee structure or use the fee from the API
      let transferFee = 0;
      let transferTime = provider.transferTimeHours || { min: 24, max: 48 };
      let deliveryTimeText = `${transferTime.min}-${transferTime.max} hours`;
      
      // For Wise, check if we have a fee from the API
      if (code === 'wise' && provider.transferFees && provider.transferFees[`${fromCurrency}_${targetCurrency}_${amount}`]) {
        transferFee = provider.transferFees[`${fromCurrency}_${targetCurrency}_${amount}`];
        console.log(`[CalculateResults] Using Wise API fee: ${transferFee} for ${fromCurrency} to ${targetCurrency}, amount: ${amount}`);
        
        // Check if we have delivery time information
        if (provider.deliveryTimes && provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`]) {
          deliveryTimeText = provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`];
          console.log(`[CalculateResults] Using Wise API delivery time: ${deliveryTimeText}`);
        }
      } else {
        // Calculate fee based on provider's fee structure
        if (provider.transferFeeStructure.type === 'flat') {
          transferFee = provider.transferFeeStructure.amount;
        } else if (provider.transferFeeStructure.type === 'percentage') {
          transferFee = amount * (provider.transferFeeStructure.percentage / 100);
          
          // Apply minimum fee if calculated fee is below minimum
          if (transferFee < provider.transferFeeStructure.minimum) {
            transferFee = provider.transferFeeStructure.minimum;
          }
          
          // Apply maximum fee if calculated fee is above maximum and maximum exists
          if (provider.transferFeeStructure.maximum && 
              transferFee > provider.transferFeeStructure.maximum) {
            transferFee = provider.transferFeeStructure.maximum;
          }
        }
      }
      
      // Calculate effective exchange rate with margin
      const effectiveRate = rate;
      
      // Calculate amount received - for Wise, subtract the fee from the targetAmount
      let amountReceived = amount * effectiveRate;
      
      if (code === 'wise') {
        // For Wise, subtract the fee from the amount received if it's in target currency
        // or just use the amountReceived from the API if we have it
        if (provider.amountReceived && provider.amountReceived[`${fromCurrency}_${targetCurrency}_${amount}`]) {
          amountReceived = provider.amountReceived[`${fromCurrency}_${targetCurrency}_${amount}`];
          console.log(`[CalculateResults] Using Wise API amount received: ${amountReceived}`);
        } else {
          // If we don't have the specific amount received, subtract the fee from the calculated amount
          amountReceived = amountReceived - transferFee;
          console.log(`[CalculateResults] Calculated Wise amount received by subtracting fee: ${amountReceived}`);
        }
      }
      
      // Calculate total cost
      const baseRate = rate / (1 - provider.exchangeRateMargin);
      const marginCost = amount * (baseRate - effectiveRate);
      const totalCost = transferFee + marginCost;
      
      const result = {
        providerId: provider.id,
        providerCode: code,
        providerName: provider.name,
        providerLogo: provider.logo,
        baseRate: baseRate,
        effectiveRate: effectiveRate,
        transferFee: transferFee,
        marginPercentage: provider.exchangeRateMargin * 100,
        marginCost: marginCost,
        totalCost: totalCost,
        amountReceived: amountReceived,
        transferTimeHours: provider.transferTimeHours,
        transferTime: deliveryTimeText,
        rating: provider.rating,
        methods: provider.methods,
        realTimeApi: provider.apiEnabled,
        timestamp: new Date().toISOString()
      };
      
      console.log(`[CalculateResults] Added provider ${provider.name} to results with amount received: ${amountReceived}, fee: ${transferFee}, delivery time: ${deliveryTimeText}`);
      results.push(result);
    }
    
    console.log(`[CalculateResults] Returning ${results.length} provider results`);
    return results;
  }
  
  async fetchRateFromProvider(provider, fromCurrency, targetCurrency, amount) {
    console.log(`Fetching rate from ${provider.name} (${provider.apiHandler}) for ${fromCurrency} to ${targetCurrency}`);
    
    try {
      switch (provider.apiHandler.toLowerCase()) {
        case 'wise':
        case 'transferwise':
          return await this.fetchWiseRate(provider, fromCurrency, targetCurrency, amount);
        case 'xe':
          try {
            return await this.fetchXERate(provider, fromCurrency, targetCurrency);
          } catch (xeError) {
            console.error(`Error fetching XE rate: ${xeError.message}`);
            return null;
          }
        case 'westernunion':
          try {
            return await this.fetchWesternUnionRate(provider, fromCurrency, targetCurrency, amount);
          } catch (wuError) {
            console.error(`Error fetching Western Union rate: ${wuError.message}`);
            return null;
          }
        default:
          // If no specific handler, try the generic rate handler
          console.log(`No specific handler for provider: ${provider.apiHandler}, trying generic handler`);
          try {
            return await this.fetchGenericRate(fromCurrency, targetCurrency);
          } catch (genericError) {
            console.error(`Error fetching generic rate: ${genericError.message}`);
            return null;
          }
      }
    } catch (error) {
      console.error(`Error fetching rate from ${provider.name}:`, error.message);
      return null; // Return null instead of throwing so other providers can still succeed
    }
  }
  
  async fetchWiseRate(provider, fromCurrency, targetCurrency, amount) {
    try {
      console.log(`[fetchWiseRate] Attempting to get rate and fee for ${fromCurrency} to ${targetCurrency} from Wise`);
      
      // First try to get rate and fee together from the exchange rate API
      try {
        const rateData = await wiseApiService.getExchangeRate(fromCurrency, targetCurrency, amount);
        console.log(`[fetchWiseRate] Wise API returned rate: ${rateData.rate} and fee: ${rateData.fee} for ${fromCurrency} to ${targetCurrency}`);
        
        // Store fee information in provider object for later use
        if (!provider.transferFees) {
          provider.transferFees = {};
        }
        
        // Store the fee for this specific currency pair and amount
        const feeKey = `${fromCurrency}_${targetCurrency}_${amount}`;
        provider.transferFees[feeKey] = rateData.fee;
        
        // Store delivery time information if available
        if (!provider.deliveryTimes) {
          provider.deliveryTimes = {};
        }
        
        if (rateData.deliveryTime) {
          // Use the deliveryTime field from the updated wiseApiService
          provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`] = rateData.deliveryTime;
          console.log(`[fetchWiseRate] Stored delivery time: ${rateData.deliveryTime} for ${fromCurrency} to ${targetCurrency}`);
        } else if (rateData.estimatedDelivery) {
          // Fallback to estimatedDelivery field for backward compatibility
          provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`] = rateData.estimatedDelivery;
          console.log(`[fetchWiseRate] Stored delivery time: ${rateData.estimatedDelivery} for ${fromCurrency} to ${targetCurrency}`);
        }
        
        // Store amount received if available
        if (rateData.targetAmount) {
          if (!provider.amountReceived) {
            provider.amountReceived = {};
          }
          
          provider.amountReceived[`${fromCurrency}_${targetCurrency}_${amount}`] = rateData.targetAmount;
          console.log(`[fetchWiseRate] Stored amount received: ${rateData.targetAmount} for ${fromCurrency} to ${targetCurrency}`);
        }
        
        // Return the rate
        return rateData.rate;
      } catch (error) {
        console.error(`[fetchWiseRate] Error getting rate and fee: ${error.message}`);
        
        // If there was an error, try to get at least the delivery time estimate
        try {
          const deliveryTime = wiseApiService.getEstimatedDeliveryTime(fromCurrency, targetCurrency);
          
          // Store this fallback delivery time
          if (!provider.deliveryTimes) {
            provider.deliveryTimes = {};
          }
          
          provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`] = deliveryTime;
          console.log(`[fetchWiseRate] Stored fallback delivery time: ${deliveryTime} for ${fromCurrency} to ${targetCurrency}`);
        } catch (timeError) {
          console.error(`[fetchWiseRate] Error getting fallback delivery time: ${timeError.message}`);
        }
        
        throw error;
      }
    } catch (error) {
      console.error(`[fetchWiseRate] Error fetching Wise rate: ${error.message}`);
      throw error;
    }
  }
  
  async fetchXERate(provider, fromCurrency, targetCurrency) {
    try {
      console.log(`[fetchXERate] Attempting to get rate for ${fromCurrency} to ${targetCurrency}`);
      
      // XE API is not implemented, throw an error
      throw new Error(`XE API is not implemented. Please configure the XE API credentials and implement the API handler.`);
    } catch (error) {
      console.error('[fetchXERate] Error:', error.message);
      throw error;
    }
  }
  
  async fetchWesternUnionRate(provider, fromCurrency, targetCurrency, amount) {
    try {
      console.log(`[fetchWesternUnionRate] Attempting to get rate for ${fromCurrency} to ${targetCurrency}`);
      
      // Western Union API is not implemented, throw an error
      throw new Error(`Western Union API is not implemented. Please configure the Western Union API credentials and implement the API handler.`);
    } catch (error) {
      console.error('[fetchWesternUnionRate] Error:', error.message);
      throw error;
    }
  }
  
  async fetchGenericRate(fromCurrency, targetCurrency) {
    try {
      // Using a public exchange rate API for providers without specific implementations
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      
      if (response.data && response.data.rates && response.data.rates[targetCurrency]) {
        return response.data.rates[targetCurrency];
      } else {
        throw new Error('Rate not found');
      }
    } catch (error) {
      console.error('Generic rate API error:', error.message);
      throw error;
    }
  }

  // Clear cache for specific provider or currency pair
  async clearCache(fromCurrency = null, targetCurrency = null) {
    // Clear memory cache
    if (fromCurrency && targetCurrency) {
      const keys = memoryCache.keys();
      keys.forEach(key => {
        if (key.includes(`${fromCurrency}_${targetCurrency}`)) {
          memoryCache.del(key);
        }
      });
    } else {
      memoryCache.flushAll();
    }
    
    // Clear database cache
    if (fromCurrency && targetCurrency) {
      await RateCache.deleteMany({ 
        fromCurrency, 
        toCurrency: targetCurrency 
      });
    } else {
      await RateCache.deleteMany({});
    }
    
    console.log('Cache cleared');
  }
}

module.exports = new ProviderService();