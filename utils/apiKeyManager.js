const crypto = require('crypto');
const Provider = require('../models/Provider');

/**
 * Utility class for managing API keys
 * - Securely stores and retrieves API keys
 * - Handles encryption/decryption if needed
 * - Tracks API usage and respects quotas
 */
class ApiKeyManager {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'your-fallback-encryption-key';
    this.algorithm = 'aes-256-cbc';
    this.providerKeyCache = {};
    this.lastCacheRefresh = null;
    this.cacheLifetime = 3600000; // 1 hour in milliseconds
  }

  /**
   * Encrypt sensitive data
   * @param {string} text - Text to encrypt
   * @returns {string} - Encrypted text
   */
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm, 
      Buffer.from(this.encryptionKey.padEnd(32).slice(0, 32)), 
      iv
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   * @param {string} encrypted - Encrypted text
   * @returns {string} - Decrypted text
   */
  decrypt(encrypted) {
    try {
      const parts = encrypted.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      
      const decipher = crypto.createDecipheriv(
        this.algorithm, 
        Buffer.from(this.encryptionKey.padEnd(32).slice(0, 32)), 
        iv
      );
      
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  /**
   * Get API key for a provider
   * @param {string} providerCode - Provider code
   * @returns {Promise<string>} - API key
   */
  async getApiKey(providerCode) {
    // Check cache first
    if (this.shouldRefreshCache()) {
      await this.refreshKeyCache();
    }
    
    if (this.providerKeyCache[providerCode]) {
      return this.providerKeyCache[providerCode].apiKey;
    }
    
    // If not in cache, fetch from database
    const provider = await Provider.findOne({ code: providerCode })
      .select('+apiKey')
      .exec();
    
    if (!provider) {
      throw new Error(`Provider ${providerCode} not found`);
    }
    
    // Track API usage
    const withinQuota = await provider.trackApiCall();
    if (!withinQuota) {
      throw new Error(`API quota exceeded for provider ${providerCode}`);
    }
    
    // Cache the API key
    this.providerKeyCache[providerCode] = {
      apiKey: provider.apiKey,
      timestamp: Date.now()
    };
    
    return provider.apiKey;
  }

  /**
   * Get API secret for a provider
   * @param {string} providerCode - Provider code
   * @returns {Promise<string>} - API secret
   */
  async getApiSecret(providerCode) {
    // Check cache first
    if (this.shouldRefreshCache()) {
      await this.refreshKeyCache();
    }
    
    if (this.providerKeyCache[providerCode] && this.providerKeyCache[providerCode].apiSecret) {
      return this.providerKeyCache[providerCode].apiSecret;
    }
    
    // If not in cache, fetch from database
    const provider = await Provider.findOne({ code: providerCode })
      .select('+apiSecret')
      .exec();
    
    if (!provider || !provider.apiSecret) {
      throw new Error(`API secret for provider ${providerCode} not found`);
    }
    
    // Cache the API secret
    if (!this.providerKeyCache[providerCode]) {
      this.providerKeyCache[providerCode] = { timestamp: Date.now() };
    }
    
    this.providerKeyCache[providerCode].apiSecret = provider.apiSecret;
    
    return provider.apiSecret;
  }

  /**
   * Check if we should refresh the cache
   * @returns {boolean} - True if cache should be refreshed
   */
  shouldRefreshCache() {
    return !this.lastCacheRefresh || 
           (Date.now() - this.lastCacheRefresh) > this.cacheLifetime;
  }

  /**
   * Refresh the key cache
   */
  async refreshKeyCache() {
    try {
      const providers = await Provider.find({ active: true, apiEnabled: true })
        .select('+apiKey +apiSecret')
        .exec();
      
      // Clear existing cache
      this.providerKeyCache = {};
      
      // Rebuild cache
      for (const provider of providers) {
        this.providerKeyCache[provider.code] = {
          apiKey: provider.apiKey,
          apiSecret: provider.apiSecret || null,
          timestamp: Date.now()
        };
      }
      
      this.lastCacheRefresh = Date.now();
    } catch (error) {
      console.error('Error refreshing API key cache:', error);
    }
  }

  /**
   * Update API key for a provider
   * @param {string} providerCode - Provider code
   * @param {string} apiKey - New API key
   * @returns {Promise<boolean>} - Success status
   */
  async updateApiKey(providerCode, apiKey) {
    try {
      const provider = await Provider.findOne({ code: providerCode });
      
      if (!provider) {
        throw new Error(`Provider ${providerCode} not found`);
      }
      
      provider.apiKey = apiKey;
      provider.apiLastTested = new Date();
      await provider.save();
      
      // Update cache
      if (!this.providerKeyCache[providerCode]) {
        this.providerKeyCache[providerCode] = { timestamp: Date.now() };
      }
      
      this.providerKeyCache[providerCode].apiKey = apiKey;
      
      return true;
    } catch (error) {
      console.error(`Error updating API key for ${providerCode}:`, error);
      return false;
    }
  }
}

module.exports = new ApiKeyManager();