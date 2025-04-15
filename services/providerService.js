// services/providerService.js
const axios = require('axios');
const Provider = require('../models/Provider');
const RateCache = require('../models/RateCache');

class ProviderService {
  constructor() {
    this.providers = {};
    this.initialized = false;
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
          methods: provider.methods
        };
      }
      
      this.initialized = true;
      console.log(`Initialized ${Object.keys(this.providers).length} providers`);
    } catch (error) {
      console.error('Error initializing provider service:', error);
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

  async getExchangeRates(fromCurrency, toCurrency, amount) {
    await this.initialize();
    const results = [];
    
    // Check if we have cached rates first
    const cachedRates = await RateCache.findOne({
      fromCurrency,
      toCurrency,
      createdAt: { $gte: new Date(Date.now() - 3600000) } // Within the last hour
    });
    
    if (cachedRates) {
      console.log('Using cached exchange rates');
      return this.calculateResults(cachedRates.rates, fromCurrency, toCurrency, amount);
    }
    
    // If no cache, fetch new rates from provider APIs
    console.log('Fetching fresh exchange rates');
    const providerRates = {};
    
    const providerPromises = Object.entries(this.providers).map(async ([code, provider]) => {
      try {
        const rate = await this.fetchRateFromProvider(provider, fromCurrency, toCurrency);
        providerRates[code] = rate;
      } catch (error) {
        console.error(`Error fetching rate from ${provider.name}:`, error.message);
        // If one provider fails, don't fail the whole request
      }
    });
    
    await Promise.all(providerPromises);
    
    // Store in cache for future requests
    await RateCache.create({
      fromCurrency,
      toCurrency,
      rates: providerRates
    });
    
    return this.calculateResults(providerRates, fromCurrency, toCurrency, amount);
  }
  
  calculateResults(providerRates, fromCurrency, toCurrency, amount) {
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
      const effectiveRate = rate * (1 - provider.exchangeRateMargin);
      
      // Calculate amount received
      const amountReceived = amount * effectiveRate;
      
      // Calculate total cost
      const marginCost = amount * (rate - effectiveRate);
      const totalCost = transferFee + marginCost;
      
      results.push({
        providerId: provider.id,
        providerCode: code,
        providerName: provider.name,
        providerLogo: provider.logo,
        baseRate: rate,
        effectiveRate: effectiveRate,
        transferFee: transferFee,
        marginPercentage: provider.exchangeRateMargin * 100,
        marginCost: marginCost,
        totalCost: totalCost,
        amountReceived: amountReceived,
        transferTimeHours: provider.transferTimeHours,
        rating: provider.rating,
        methods: provider.methods
      });
    }
    
    return results;
  }
  
  async fetchRateFromProvider(provider, fromCurrency, toCurrency) {
    // This implementation will vary based on each provider's API
    // Here's a generic implementation that would need to be customized
    
    switch (provider.name) {
      case 'TransferWise':
        return this.fetchTransferWiseRate(provider, fromCurrency, toCurrency);
      
      case 'XE Money Transfer':
        return this.fetchXERate(provider, fromCurrency, toCurrency);
      
      case 'Western Union':
        return this.fetchWesternUnionRate(provider, fromCurrency, toCurrency);
        
      default:
        // Generic implementation using a public exchange rate API
        return this.fetchGenericRate(fromCurrency, toCurrency);
    }
  }
  
  async fetchTransferWiseRate(provider, fromCurrency, toCurrency) {
    try {
      const response = await axios.get(`${provider.baseUrl}/rates`, {
        params: {
          source: fromCurrency,
          target: toCurrency
        },
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`
        }
      });
      
      return response.data.rate;
    } catch (error) {
      console.error('TransferWise API error:', error.message);
      throw error;
    }
  }
  
  async fetchXERate(provider, fromCurrency, toCurrency) {
    try {
      const response = await axios.get(`${provider.baseUrl}/convert`, {
        params: {
          from: fromCurrency,
          to: toCurrency
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
  
  async fetchWesternUnionRate(provider, fromCurrency, toCurrency) {
    try {
      const response = await axios.post(`${provider.baseUrl}/price`, {
        fromCurrency,
        toCurrency,
        amount: 1000 // Sample amount to get the rate
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
  
  async fetchGenericRate(fromCurrency, toCurrency) {
    try {
      // Using a public exchange rate API for providers without specific implementations
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      
      if (response.data && response.data.rates && response.data.rates[toCurrency]) {
        return response.data.rates[toCurrency];
      } else {
        throw new Error('Rate not found');
      }
    } catch (error) {
      console.error('Generic rate API error:', error.message);
      throw error;
    }
  }
}

module.exports = new ProviderService();