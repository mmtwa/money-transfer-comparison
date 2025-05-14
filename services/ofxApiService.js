const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for storing OFX access tokens to avoid making too many auth requests
const tokenCache = new NodeCache({ stdTTL: 3500, checkperiod: 120 }); // Cache for slightly less than 1 hour (3600 seconds)

class OFXApiService {
  constructor() {
    this.clientId = process.env.OFX_CLIENT_ID || '';
    this.clientSecret = process.env.OFX_CLIENT_SECRET || '';
    this.baseUrl = process.env.ENABLE_SANDBOX_MODE === 'true' 
      ? 'https://sandbox.api.ofx.com' 
      : 'https://api.ofx.com';
    this.initialized = false;
    this.supportedCurrencyPairs = [];
    
    // Initialize automatically
    this.initialize();
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      console.log('[OFXApiService] Initializing OFX API service');
      
      // Validate credentials
      if (!this.clientId || !this.clientSecret) {
        console.error('[OFXApiService] OFX_CLIENT_ID or OFX_CLIENT_SECRET not set in environment variables');
        throw new Error('OFX API credentials not configured');
      }
      
      // Initialize supported currency pairs (this would ideally come from OFX API)
      // For now we'll use a predefined list of common pairs
      this.supportedCurrencyPairs = [
        'USD-EUR', 'USD-GBP', 'USD-CAD', 'USD-AUD', 'USD-NZD', 'USD-JPY',
        'EUR-USD', 'EUR-GBP', 'EUR-CAD', 'EUR-AUD', 'EUR-NZD', 'EUR-JPY',
        'GBP-USD', 'GBP-EUR', 'GBP-CAD', 'GBP-AUD', 'GBP-NZD', 'GBP-JPY',
        'AUD-USD', 'AUD-EUR', 'AUD-GBP', 'AUD-CAD', 'AUD-NZD', 'AUD-JPY'
      ];
      
      this.initialized = true;
      console.log('[OFXApiService] Initialization complete');
    } catch (error) {
      console.error('[OFXApiService] Initialization failed:', error.message);
      throw error;
    }
  }

  async getAccessToken() {
    try {
      // Check if we have a cached token
      const cachedToken = tokenCache.get('ofx_token');
      if (cachedToken) {
        console.log('[OFXApiService] Using cached OFX access token');
        return cachedToken;
      }
      
      console.log('[OFXApiService] Getting new OFX access token');
      
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('scope', 'ofxrates');
      
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth/token`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid response from OFX token endpoint');
      }
      
      const token = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
      
      // Cache the token for slightly less than its expiry time
      tokenCache.set('ofx_token', token, expiresIn - 100);
      
      console.log('[OFXApiService] Successfully obtained OFX access token');
      return token;
    } catch (error) {
      console.error('[OFXApiService] Error getting OFX access token:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data));
      }
      throw error;
    }
  }

  async testApiCredentials() {
    try {
      // Try to get an access token as a test
      const token = await this.getAccessToken();
      return {
        success: !!token,
        message: token ? 'OFX API credentials are valid' : 'Failed to obtain OFX access token'
      };
    } catch (error) {
      console.error('[OFXApiService] API credentials test failed:', error.message);
      return {
        success: false,
        message: `OFX API credentials are invalid: ${error.message}`
      };
    }
  }

  isCurrencyPairSupported(fromCurrency, toCurrency) {
    const pair = `${fromCurrency}-${toCurrency}`;
    return this.supportedCurrencyPairs.includes(pair);
  }

  async getExchangeRate(fromCurrency, toCurrency, amount) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      if (!amount || isNaN(parseFloat(amount))) {
        throw new Error('Invalid amount');
      }
      
      console.log(`[OFXApiService] Getting exchange rate for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
      
      // Get access token
      const token = await this.getAccessToken();
      
      // Call OFX API to get rate
      const response = await axios.get(
        `${this.baseUrl}/v1/ofxrates/${fromCurrency}/${toCurrency}/${amount}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data || !response.data.ofxRate) {
        throw new Error('Invalid response from OFX rates API');
      }
      
      const { ofxRate, inverseOfxRate, convertedAmount } = response.data;
      
      console.log(`[OFXApiService] OFX rate: ${ofxRate}, converted amount: ${convertedAmount}`);
      
      // Calculate transfer fee based on provider's fee structure
      // For OFX, typically a flat fee for most transfers
      const transferFee = 15; // Default flat fee in source currency
      
      // Return rate info
      return {
        rate: ofxRate,
        inverseRate: inverseOfxRate,
        targetAmount: convertedAmount,
        sourceAmount: amount,
        fee: transferFee,
        deliveryTime: '1-3 business days' // OFX typical delivery time
      };
    } catch (error) {
      console.error('[OFXApiService] Error getting exchange rate:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data));
      }
      throw error;
    }
  }

  async getHistoricalRates(fromCurrency, toCurrency, params = {}) {
    console.error('[OFXApiService] Historical rates not supported by OFX API');
    throw new Error('Historical rates not supported by OFX API');
  }
}

module.exports = new OFXApiService(); 