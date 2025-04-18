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
    this.fallbackRates = {};
  }

  async initialize() {
    if (this.initialized) return;
    
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
          apiEnabled: provider.apiEnabled || false, // Flag to indicate if live API is enabled
          apiHandler: provider.code.toLowerCase() // Used to determine which API handler to use
        };
      }
      
      // Initialize fallback rates from the database
      await this.initializeFallbackRates();
      
      this.initialized = true;
      console.log(`Initialized ${Object.keys(this.providers).length} providers`);
    } catch (error) {
      console.error('Error initializing provider service:', error);
      throw error;
    }
  }

  async initializeFallbackRates() {
    // Load common currency pairs as fallbacks
    const commonPairs = [
      { from: 'USD', to: 'EUR' },
      { from: 'USD', to: 'GBP' },
      { from: 'EUR', to: 'USD' },
      { from: 'GBP', to: 'USD' },
      { from: 'USD', to: 'CAD' },
      { from: 'USD', to: 'AUD' },
      { from: 'USD', to: 'JPY' },
      { from: 'EUR', to: 'GBP' }
    ];

    for (const pair of commonPairs) {
      try {
        const rate = await this.fetchGenericRate(pair.from, pair.to);
        this.fallbackRates[`${pair.from}_${pair.to}`] = rate;
      } catch (error) {
        console.warn(`Could not initialize fallback rate for ${pair.from} to ${pair.to}`);
      }
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
    
    // Create a cache key for this specific request
    const cacheKey = `rates_${fromCurrency}_${targetCurrency}_${amount}`;
    
    // Try getting the results from memory cache first
    const cachedResults = memoryCache.get(cacheKey);
    if (cachedResults) {
      console.log(`Using memory-cached exchange rates for ${fromCurrency} to ${targetCurrency}`);
      return cachedResults;
    }
    
    // Check if we have cached rates in the database
    const cachedRates = await RateCache.findOne({
      fromCurrency,
      toCurrency: targetCurrency,
      createdAt: { $gte: new Date(Date.now() - 3600000) } // Within the last hour
    });
    
    if (cachedRates) {
      console.log('Using database-cached exchange rates');
      const results = this.calculateResults(cachedRates.rates, fromCurrency, targetCurrency, amount);
      
      // Store in memory cache
      memoryCache.set(cacheKey, results);
      
      return results;
    }
    
    // If no cache, fetch new rates from provider APIs
    console.log('Fetching fresh exchange rates');
    const providerRates = {};
    
    const providerPromises = Object.entries(this.providers).map(async ([code, provider]) => {
      try {
        let rate;
        
        // Get rate based on the provider's API status
        if (provider.apiEnabled) {
          rate = await this.fetchRateFromProvider(provider, fromCurrency, targetCurrency, amount);
        } else {
          // Use fallback calculation for providers without API access
          rate = await this.calculateFallbackRate(provider, fromCurrency, targetCurrency);
        }
        
        providerRates[code] = rate;
      } catch (error) {
        console.error(`Error fetching rate from ${provider.name}:`, error.message);
        
        // Try using fallback rate if API fails
        try {
          const fallbackRate = await this.calculateFallbackRate(provider, fromCurrency, targetCurrency);
          providerRates[code] = fallbackRate;
          console.log(`Using fallback rate for ${provider.name}`);
        } catch (fallbackError) {
          console.error(`Fallback rate also failed for ${provider.name}:`, fallbackError.message);
        }
      }
    });
    
    await Promise.all(providerPromises);
    
    // Store in cache for future requests
    await RateCache.create({
      fromCurrency,
      toCurrency: targetCurrency,
      rates: providerRates
    });
    
    const results = this.calculateResults(providerRates, fromCurrency, targetCurrency, amount);
    
    // Store in memory cache
    memoryCache.set(cacheKey, results);
    
    return results;
  }
  
  async calculateFallbackRate(provider, fromCurrency, targetCurrency) {
    // First check if we have this pair in our fallback rates
    const directKey = `${fromCurrency}_${targetCurrency}`;
    
    if (this.fallbackRates[directKey]) {
      // Apply the provider's margin to the fallback rate
      return this.fallbackRates[directKey] * (1 - provider.exchangeRateMargin);
    }
    
    // If not, try to fetch a generic rate
    try {
      const baseRate = await this.fetchGenericRate(fromCurrency, targetCurrency);
      return baseRate * (1 - provider.exchangeRateMargin);
    } catch (error) {
      console.error('Error calculating fallback rate:', error.message);
      throw error;
    }
  }
  
  calculateResults(providerRates, fromCurrency, targetCurrency, amount) {
    const results = [];
    
    for (const [code, rate] of Object.entries(providerRates)) {
      const provider = this.providers[code];
      if (!rate || !provider) continue;
      
      // Calculate transfer fee based on the provider's fee structure
      let transferFee = 0;
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
      
      // Calculate effective exchange rate with margin
      const effectiveRate = rate;
      
      // Calculate amount received
      const amountReceived = amount * effectiveRate;
      
      // Calculate total cost
      const baseRate = rate / (1 - provider.exchangeRateMargin);
      const marginCost = amount * (baseRate - effectiveRate);
      const totalCost = transferFee + marginCost;
      
      results.push({
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
        rating: provider.rating,
        methods: provider.methods,
        realTimeApi: provider.apiEnabled
      });
    }
    
    return results;
  }
  
  async fetchRateFromProvider(provider, fromCurrency, targetCurrency, amount) {
    // This implementation varies based on each provider's API
    
    switch (provider.apiHandler) {
      case 'transferwise':
      case 'wise':
        return this.fetchWiseRate(provider, fromCurrency, targetCurrency, amount);
      
      case 'xe':
        return this.fetchXERate(provider, fromCurrency, targetCurrency);
      
      case 'westernunion':
        return this.fetchWesternUnionRate(provider, fromCurrency, targetCurrency, amount);
        
      default:
        // Generic implementation using a public exchange rate API
        return this.fetchGenericRate(fromCurrency, targetCurrency);
    }
  }
  
  async fetchWiseRate(provider, fromCurrency, targetCurrency, amount) {
    try {
      // Use our dedicated Wise API service
      const rateData = await wiseApiService.getExchangeRate(fromCurrency, targetCurrency, amount);
      return rateData.rate;
    } catch (error) {
      console.error('Wise API error:', error.message);
      throw error;
    }
  }
  
  async fetchXERate(provider, fromCurrency, targetCurrency) {
    try {
      const response = await axios.get(`${provider.baseUrl}/convert`, {
        params: {
          from: fromCurrency,
          to: targetCurrency
        },
        headers: {
          'X-Api-Key': provider.apiKey,
          'X-Api-Secret': provider.apiSecret
        }
      });
      
      return response.data.to[0].mid;
    } catch (error) {
      console.error('XE API error:', error.message);
      throw error;
    }
  }
  
  async fetchWesternUnionRate(provider, fromCurrency, targetCurrency, amount) {
    try {
      const response = await axios.post(`${provider.baseUrl}/price`, {
        fromCurrency,
        targetCurrency,
        amount: amount // Use the actual amount for more accurate pricing
      }, {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`
        }
      });
      
      return response.data.exchangeRate;
    } catch (error) {
      console.error('Western Union API error:', error.message);
      throw error;
    }
  }
  
  async fetchGenericRate(fromCurrency, targetCurrency) {
    try {
      // Using a public exchange rate API for providers without specific implementations
      // or as a fallback when specific provider APIs fail
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