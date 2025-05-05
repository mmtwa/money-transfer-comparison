const express = require('express');
const router = express.Router();
const providerScraperService = require('../services/providerScraperService');

// Simple in-memory cache to improve performance
const cache = {
  data: {},
  timeout: 3600000 // 1 hour in milliseconds
};

/**
 * Helper to retrieve data from cache
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null if not found/expired
 */
function getFromCache(key) {
  if (!cache.data[key]) return null;
  
  const now = Date.now();
  if (now - cache.data[key].timestamp > cache.timeout) {
    delete cache.data[key];
    return null;
  }
  
  return cache.data[key].data;
}

/**
 * Helper to store data in cache
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 */
function storeInCache(key, data) {
  cache.data[key] = {
    timestamp: Date.now(),
    data
  };
}

/**
 * @route   GET /api/provider-info/:providerCode
 * @desc    Get detailed provider information by provider code
 * @access  Public
 */
router.get('/:providerCode', async (req, res) => {
  try {
    const { providerCode } = req.params;
    
    if (!providerCode) {
      return res.status(400).json({
        success: false,
        message: 'Provider code is required'
      });
    }

    const normalizedCode = providerCode.toLowerCase().trim();
    
    // Check cache first
    const cachedInfo = getFromCache(normalizedCode);
    if (cachedInfo) {
      console.log(`Serving cached provider info for: ${normalizedCode}`);
      return res.json({
        success: true,
        data: cachedInfo,
        source: 'cache'
      });
    }
    
    // Use the scraper service to get provider information
    console.log(`Scraping provider info for: ${normalizedCode}`);
    const providerInfo = await providerScraperService.scrapeProviderInfo(normalizedCode);
    
    // Cache the result
    storeInCache(normalizedCode, providerInfo);
    
    return res.json({
      success: true,
      data: providerInfo,
      source: 'fresh'
    });
  } catch (error) {
    console.error('Error fetching provider info:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch provider information',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/provider-info/search/:query
 * @desc    Search for provider information by name or partial code
 * @access  Public
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    // In a real implementation, you might search a database
    // For this example, we'll just use the normalized query as a provider code
    const normalizedQuery = query.toLowerCase().trim();
    
    // Use the scraper service to get provider information
    const providerInfo = await providerScraperService.scrapeProviderInfo(normalizedQuery);
    
    return res.json({
      success: true,
      data: providerInfo
    });
  } catch (error) {
    console.error('Error searching provider info:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search provider information',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/provider-info/
 * @desc    Get list of supported providers
 * @access  Public
 */
router.get('/', (req, res) => {
  // For a complete solution, this would come from a database
  // For now, we'll return a static list of known providers
  const supportedProviders = [
    { code: 'wise', name: 'Wise' }
  ];
  
  res.json({
    success: true,
    data: supportedProviders
  });
});

/**
 * @route   DELETE /api/provider-info/cache/:providerCode
 * @desc    Clear cache for a specific provider (admin use)
 * @access  Private (should be protected in production)
 */
router.delete('/cache/:providerCode', (req, res) => {
  try {
    const { providerCode } = req.params;
    
    if (!providerCode) {
      return res.status(400).json({
        success: false,
        message: 'Provider code is required'
      });
    }

    const normalizedCode = providerCode.toLowerCase().trim();
    
    if (cache.data[normalizedCode]) {
      delete cache.data[normalizedCode];
      return res.json({
        success: true,
        message: `Cache cleared for ${normalizedCode}`
      });
    } else {
      return res.json({
        success: true,
        message: `No cache found for ${normalizedCode}`
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

module.exports = router; 