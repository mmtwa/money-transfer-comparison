const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const TrustpilotRating = require('../models/TrustpilotRating');

// Rate limiting for GET requests
const getLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // Allow 500 requests per minute for cached data
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});

// Provider name normalization map - helps map different versions of provider names to consistent values
const PROVIDER_ALIASES = {
  'transferwise': 'wise', // TransferWise is now Wise
  'wise': 'wise',
  'worldremit': 'worldremit',
  'regency fx': 'regencyfx',
  'regencyfx': 'regencyfx',
  'pandaremit': 'pandaremit',
  'westernunion': 'westernunion',
  'western union': 'westernunion',
  'western-union': 'westernunion',
  'moneygram': 'moneygram',
  'remitly': 'remitly',
  'xe': 'xe',
  'currencyfair': 'currencyfair',
  'paypal': 'paypal',
  'skrill': 'skrill',
  'skrillmoneytransfer': 'skrill',
  'skrill money transfer': 'skrill',
  'revolut': 'revolut',
  'torfx': 'torfx',
  'profee': 'profee'
};

// In-memory request cache to prevent duplicate simultaneous requests
const requestCache = {
  results: new Map(),  // Map of cached results by normalizedName
  timestamps: new Map() // Map of timestamps by normalizedName
};

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  
  // Clear entries older than 5 minutes
  for (const [key, timestamp] of requestCache.timestamps.entries()) {
    if (now - timestamp > 5 * 60 * 1000) {
      requestCache.results.delete(key);
      requestCache.timestamps.delete(key);
      console.log(`Cleared cache entry for ${key}`);
    }
  }
}, 10 * 60 * 1000); // Run every 10 minutes

// Apply rate limiting
router.get('/:providerName', getLimiter);

/**
 * @route   GET /api/trustpilot-ratings/:providerName
 * @desc    Get Trustpilot rating for a specific provider from MongoDB
 * @access  Public
 */
router.get('/:providerName', async (req, res) => {
  try {
    const { providerName } = req.params;
    console.log(`GET /api/trustpilot-ratings/${providerName}`);
    
    if (!providerName) {
      console.log('No provider name provided');
      return res.json({
        success: false,
        message: 'Provider name is required'
      });
    }

    // Log the raw provider name
    console.log(`Raw provider name: "${providerName}"`);

    // Clean and normalize the provider name
    const normalizedName = providerName.toLowerCase()
      .replace(/^provider-/, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();

    // Apply any known aliases
    const standardizedName = PROVIDER_ALIASES[normalizedName] || normalizedName;
    
    console.log(`Normalization process: "${providerName}" → "${normalizedName}" → "${standardizedName}"`);
    
    // Check in-memory cache first
    if (requestCache.results.has(standardizedName)) {
      console.log(`Returning in-memory cached result for ${standardizedName}`);
      return res.json(requestCache.results.get(standardizedName));
    }
    
    // Check MongoDB
    console.log(`Querying MongoDB for provider name: "${standardizedName}"`);
    const rating = await TrustpilotRating.findOne({ providerName: standardizedName });
    
    if (rating) {
      console.log(`Found rating for ${standardizedName} in MongoDB:`, rating.rating);
      
      const result = {
        success: true,
        data: {
          value: rating.rating,
          source: 'Trustpilot',
          lastUpdated: rating.lastUpdated
        }
      };
      
      // Cache the result
      requestCache.results.set(standardizedName, result);
      requestCache.timestamps.set(standardizedName, Date.now());
      
      return res.json(result);
    }
    
    // If we get here, no rating found in MongoDB
    console.log(`No rating found for ${standardizedName} in MongoDB`);
    console.log(`Checking for any ratings with similar names...`);
    
    // Try to find a rating with a similar name
    const allRatings = await TrustpilotRating.find({});
    console.log(`Found ${allRatings.length} total ratings in database.`);
    console.log(`Available provider names in database: ${allRatings.map(r => r.providerName).join(', ')}`);
    
    // Use default fallback ratings for common providers
    const fallbackRatings = {
      'wise': 4.7,
      'ofx': 4.2,
      'westernunion': 3.9,
      'moneygram': 3.7,
      'worldremit': 4.1,
      'remitly': 4.3,
      'xe': 4.1,
      'torfx': 4.4,
      'regencyfx': 4.9,
      'pandaremit': 4.1,
      'profee': 4.4
    };
    
    if (fallbackRatings[standardizedName]) {
      console.log(`Using fallback rating for ${standardizedName}: ${fallbackRatings[standardizedName]}`);
      
      const fallbackResult = {
        success: true,
        data: {
          value: fallbackRatings[standardizedName],
          source: 'Default rating',
          lastUpdated: new Date(),
          isFallback: true
        }
      };
      
      // Cache the fallback result
      requestCache.results.set(standardizedName, fallbackResult);
      requestCache.timestamps.set(standardizedName, Date.now());
      
      return res.json(fallbackResult);
    }
    
    // No rating found, return error
    const notFoundResult = {
      success: false,
      message: 'Provider rating not found'
    };
    
    // Cache the not found result
    requestCache.results.set(standardizedName, notFoundResult);
    requestCache.timestamps.set(standardizedName, Date.now());
    
    return res.json(notFoundResult);
  } catch (error) {
    console.error('Error retrieving provider rating:', error);
    return res.status(500).json({
      success: false,
      message: `Error retrieving provider rating: ${error.message}`
    });
  }
});

/**
 * @route   POST /api/trustpilot-ratings/update
 * @desc    Admin route to manually update a provider rating
 * @access  Admin
 */
router.post('/update', async (req, res) => {
  try {
    const { providerName, rating, authKey } = req.body;
    
    // Basic authorization check using an auth key (should use proper auth in production)
    if (!authKey || authKey !== process.env.ADMIN_AUTH_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update ratings'
      });
    }
    
    if (!providerName || !rating || isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid provider name and rating (0-5) are required'
      });
    }
    
    // Normalize the provider name
    const normalizedName = providerName.toLowerCase()
      .replace(/^provider-/, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
    
    // Apply any known aliases
    const standardizedName = PROVIDER_ALIASES[normalizedName] || normalizedName;
    
    // Update or create the rating in MongoDB
    const updatedRating = await TrustpilotRating.findOneAndUpdate(
      { providerName: standardizedName },
      { 
        providerName: standardizedName,
        rating: parseFloat(rating),
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    
    // Clear any cached results for this provider
    requestCache.results.delete(standardizedName);
    requestCache.timestamps.delete(standardizedName);
    
    return res.json({
      success: true,
      data: {
        provider: standardizedName,
        rating: updatedRating.rating,
        lastUpdated: updatedRating.lastUpdated
      },
      message: 'Rating updated successfully'
    });
  } catch (error) {
    console.error('Error updating provider rating:', error);
    return res.status(500).json({
      success: false,
      message: `Error updating provider rating: ${error.message}`
    });
  }
});

module.exports = router; 