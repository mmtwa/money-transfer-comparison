const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const Provider = require('../models/Provider');

// Cache for API responses
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 minute default TTL

/**
 * Create a rate limiter for API routes
 * @param {number} maxRequests - Maximum requests in time window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} - Rate limiting middleware
 */
const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later'
    },
    headers: true
  });
};

/**
 * Middleware to cache API responses
 * @param {number} duration - Cache duration in seconds
 */
const cacheApiResponse = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Create a cache key from the URL and query parameters
    const cacheKey = `api:${req.originalUrl}`;
    const cachedResponse = apiCache.get(cacheKey);
    
    if (cachedResponse) {
      // Return cached response
      return res.json(cachedResponse);
    }
    
    // Store the original send method
    const originalSend = res.json;
    
    // Override the send method to cache the response
    res.json = function(body) {
      // Only cache successful responses
      if (res.statusCode === 200 && body && body.success !== false) {
        try {
          // Ensure we're caching a plain object, not a MongoDB document
          const cacheableBody = JSON.parse(JSON.stringify(body));
          apiCache.set(cacheKey, cacheableBody, duration);
        } catch (err) {
          console.error('Error caching API response:', err);
          // Continue without caching
        }
      }
      
      // Call the original send method
      originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * Middleware to track provider API usage
 * @param {string} providerParam - Parameter name that contains the provider code
 */
const trackProviderUsage = (providerParam = 'provider') => {
  return async (req, res, next) => {
    const providerCode = req.params[providerParam] || req.query[providerParam];
    
    if (!providerCode) {
      return next();
    }
    
    try {
      const provider = await Provider.findOne({ code: providerCode });
      
      if (provider && provider.apiEnabled) {
        // Track the API call
        await provider.trackApiCall();
      }
    } catch (error) {
      console.error(`Error tracking API usage for ${providerCode}:`, error);
    }
    
    next();
  };
};

/**
 * Middleware to enforce provider API quotas
 * @param {string} providerParam - Parameter name that contains the provider code
 */
const enforceProviderQuota = (providerParam = 'provider') => {
  return async (req, res, next) => {
    const providerCode = req.params[providerParam] || req.query[providerParam];
    
    if (!providerCode) {
      return next();
    }
    
    try {
      const provider = await Provider.findOne({ code: providerCode });
      
      if (provider && provider.apiEnabled) {
        // Check if we're within quota
        if (provider.apiUsage.today >= provider.apiQuota.daily) {
          return res.status(429).json({
            success: false,
            message: `Daily API quota exceeded for provider ${providerCode}`
          });
        }
        
        if (provider.apiUsage.thisMonth >= provider.apiQuota.monthly) {
          return res.status(429).json({
            success: false,
            message: `Monthly API quota exceeded for provider ${providerCode}`
          });
        }
      }
    } catch (error) {
      console.error(`Error checking API quota for ${providerCode}:`, error);
    }
    
    next();
  };
};

/**
 * Clear the API cache for specific endpoints
 * @param {string} pattern - Pattern to match cache keys (e.g., 'rates:*')
 */
const clearApiCache = (pattern = null) => {
  if (pattern) {
    const keys = apiCache.keys();
    
    keys.forEach(key => {
      if (key.includes(pattern)) {
        apiCache.del(key);
      }
    });
    
    console.log(`Cleared API cache for pattern: ${pattern}`);
  } else {
    apiCache.flushAll();
    console.log('Cleared all API cache');
  }
};

module.exports = {
  createRateLimiter,
  cacheApiResponse,
  trackProviderUsage,
  enforceProviderQuota,
  clearApiCache
};