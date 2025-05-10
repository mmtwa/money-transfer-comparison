const axios = require('axios');
const Provider = require('../models/Provider');
const RateCache = require('../models/RateCache');
const NodeCache = require('node-cache');
const wiseApiService = require('./wiseApiService');
const ofxApiService = require('./ofxApiService');

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
      
      // Add OFX provider if credentials are set in environment
      if (process.env.OFX_CLIENT_ID && process.env.OFX_CLIENT_SECRET) {
        console.log('Setting up OFX provider');
        const baseUrl = process.env.ENABLE_SANDBOX_MODE === 'true' ? 
          'https://sandbox.api.ofx.com' : 'https://api.ofx.com';
          
        this.providers['ofx'] = {
          id: 'ofx-test-id',
          name: 'OFX',
          logo: '/images/providers/OFX_Logo.webp',
          apiKey: process.env.OFX_CLIENT_ID,
          apiSecret: process.env.OFX_CLIENT_SECRET,
          baseUrl: baseUrl,
          transferFeeStructure: {
            type: 'flat',
            amount: 15,
            minimum: 0,
            maximum: 15
          },
          exchangeRateMargin: 0.01,
          transferTimeHours: {
            min: 24,
            max: 48
          },
          rating: 4.6,
          methods: ['bank_transfer'],
          apiEnabled: true,
          apiHandler: 'ofx'
        };
      }
      
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
    
    for (const [code, rate] of Object.entries(providerRates)) {
      const provider = this.providers[code];
      if (!provider) {
        console.warn(`[CalculateResults] Provider ${code} not found in providers list`);
        continue;
      }
      
      console.log(`[CalculateResults] Processing provider ${provider.name}`);
      
      // Calculate transfer fee
      let transferFee = 0;
      let deliveryTimeText = '';
      
      // For Wise, check if we have a fee from the API
      if (code === 'wise' && provider.transferFees && provider.transferFees[`${fromCurrency}_${targetCurrency}_${amount}`]) {
        transferFee = provider.transferFees[`${fromCurrency}_${targetCurrency}_${amount}`];
        console.log(`[CalculateResults] Using Wise API fee: ${transferFee} for ${fromCurrency} to ${targetCurrency}, amount: ${amount}`);
        
        // Check if we have delivery time information
        if (provider.deliveryTimes && provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`]) {
          deliveryTimeText = provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`];
          console.log(`[CalculateResults] Using Wise API delivery time: ${deliveryTimeText}`);
        }
      } else if (code === 'ofx') {
        // OFX: Always set fee to 0
        transferFee = 0;
        // Use the convertedAmount from the OFX API if available
        const amountKey = `${fromCurrency}_${targetCurrency}_${amount}`;
        let amountReceived = provider.convertedAmounts && provider.convertedAmounts[amountKey] !== undefined
          ? provider.convertedAmounts[amountKey]
          : amount * rate;
        // Format delivery time text if not already set
        if (provider.deliveryTimes && provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`]) {
          deliveryTimeText = provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`];
        }
        results.push({
          provider: {
            id: provider.id,
            name: provider.name,
            logo: provider.logo,
            rating: provider.rating
          },
          rate: rate,
          effectiveRateWithFees: amountReceived / amount, // For OFX, no fee, so this is just the rate
          amountReceived: amountReceived,
          transferFee: transferFee,
          totalCost: amount, // No fee, so total cost is just the amount
          deliveryTime: deliveryTimeText,
          methods: provider.methods
        });
        continue;
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
      
      // Calculate total cost including fees
      const totalCost = amount + transferFee;
      
      // Calculate effective rate including fees
      const effectiveRateWithFees = amountReceived / totalCost;
      
      // Format delivery time text if not already set
      if (!deliveryTimeText) {
        const minHours = provider.transferTimeHours.min;
        const maxHours = provider.transferTimeHours.max;
        
        if (minHours === maxHours) {
          deliveryTimeText = `${minHours} hour${minHours !== 1 ? 's' : ''}`;
        } else {
          deliveryTimeText = `${minHours}-${maxHours} hours`;
        }
      }
      
      results.push({
        provider: {
          id: provider.id,
          name: provider.name,
          logo: provider.logo,
          rating: provider.rating
        },
        rate: effectiveRate,
        effectiveRateWithFees,
        amountReceived,
        transferFee,
        totalCost,
        deliveryTime: deliveryTimeText,
        methods: provider.methods
      });
    }
    
    // Sort results by amount received (highest first)
    results.sort((a, b) => b.amountReceived - a.amountReceived);
    
    return results;
  }
  
  async fetchRateFromProvider(provider, fromCurrency, targetCurrency, amount) {
    console.log(`Fetching rate from ${provider.name} (${provider.apiHandler}) for ${fromCurrency} to ${targetCurrency}`);
    
    try {
      switch (provider.apiHandler.toLowerCase()) {
        case 'wise':
          return await this.fetchWiseRate(provider, fromCurrency, targetCurrency, amount);
        case 'ofx':
          return await this.fetchOFXRate(provider, fromCurrency, targetCurrency, amount);
        default:
          console.log(`No specific handler for provider: ${provider.apiHandler}`);
          return null;
      }
    } catch (error) {
      console.error(`Error fetching rate from ${provider.name}:`, error.message);
      return null; // Return null instead of throwing so other providers can still succeed
    }
  }
  
  async fetchWiseRate(provider, fromCurrency, targetCurrency, amount) {
    try {
      console.log(`[fetchWiseRate] Attempting to get rate for ${fromCurrency} to ${targetCurrency}`);
      
      // Use the Wise API service to get the rate
      const rateInfo = await wiseApiService.getExchangeRate(fromCurrency, targetCurrency, amount);
      
      if (!rateInfo || !rateInfo.rate) {
        throw new Error('No rate returned from Wise API');
      }
      
      // Store the fee for later use in calculations
      if (!provider.transferFees) {
        provider.transferFees = {};
      }
      
      const feeKey = `${fromCurrency}_${targetCurrency}_${amount}`;
      provider.transferFees[feeKey] = rateInfo.fee || 0;
      
      // Store delivery time if available
      if (rateInfo.deliveryTime) {
        if (!provider.deliveryTimes) {
          provider.deliveryTimes = {};
        }
        provider.deliveryTimes[`${fromCurrency}_${targetCurrency}`] = rateInfo.deliveryTime;
      }
      
      return rateInfo.rate;
    } catch (error) {
      console.error('[fetchWiseRate] Error:', error.message);
      throw error;
    }
  }
  
  async fetchOFXRate(provider, fromCurrency, targetCurrency, amount) {
    try {
      console.log(`[fetchOFXRate] Attempting to get rate for ${fromCurrency} to ${targetCurrency}`);
      
      // Clear any existing rate cache for this currency pair
      await this.clearCache(fromCurrency, targetCurrency);
      
      // Use the dedicated OFX API service to get the rate
      const rateInfo = await ofxApiService.getExchangeRate(fromCurrency, targetCurrency, amount);
      
      if (!rateInfo || !rateInfo.rate) {
        throw new Error('No rate returned from OFX API');
      }
      
      console.log(`[fetchOFXRate] Received rate from OFX API: ${rateInfo.rate}`);
      
      // Store the fee for later use in calculations
      if (!provider.transferFees) {
        provider.transferFees = {};
      }
      
      const feeKey = `${fromCurrency}_${targetCurrency}_${amount}`;
      provider.transferFees[feeKey] = rateInfo.fee || 0;
      
      // Store converted amount if available
      if (!provider.convertedAmounts) {
        provider.convertedAmounts = {};
      }
      
      provider.convertedAmounts[feeKey] = rateInfo.targetAmount;
      
      // Store delivery time if available
      if (rateInfo.deliveryTime) {
        if (!provider.deliveryTimes) {
          provider.deliveryTimes = {};
        }
        
        const currencyPairKey = `${fromCurrency}_${targetCurrency}`;
        provider.deliveryTimes[currencyPairKey] = rateInfo.deliveryTime;
        
        console.log(`[fetchOFXRate] Set delivery time for ${fromCurrency} to ${targetCurrency}: ${rateInfo.deliveryTime}`);
      }
      
      return rateInfo.rate;
    } catch (error) {
      console.error('[fetchOFXRate] Error:', error.message);
      if (error.response) {
        console.error('[fetchOFXRate] Response status:', error.response.status);
        console.error('[fetchOFXRate] Response data:', JSON.stringify(error.response.data));
      }
      // Do not return a fallback or mock rate. OFX will not be included for this pair.
      return null;
    }
  }
  
  async clearCache(fromCurrency = null, targetCurrency = null) {
    try {
      if (fromCurrency && targetCurrency) {
        // Clear specific currency pair
        await RateCache.deleteMany({
          fromCurrency,
          toCurrency: targetCurrency
        });
        console.log(`Cleared cache for ${fromCurrency} to ${targetCurrency}`);
      } else {
        // Clear all cache
        await RateCache.deleteMany({});
        console.log('Cleared all rate cache');
      }
      
      // Clear memory cache
      memoryCache.flushAll();
      console.log('Cleared memory cache');
      
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
  
  /**
   * Remove a specific API-related key from the memory cache
   * @param {string} cacheKey - The cache key to remove
   */
  removeFromCache(cacheKey) {
    const apiCacheKey = cacheKey.startsWith('api:') ? cacheKey : `api:${cacheKey}`;
    
    // Try to delete from memory cache
    const deleted = memoryCache.del(apiCacheKey);
    
    console.log(`Removed ${apiCacheKey} from memory cache: ${deleted ? 'success' : 'not found'}`);
    
    return deleted;
  }
}

module.exports = new ProviderService();