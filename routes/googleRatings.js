const express = require('express');
const router = express.Router();
const ProviderRating = require('../models/ProviderRating');
const googleReviewService = require('../services/googleReviewService');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Rate limiting for the ratings API
const ratingsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});

// List of providers to use immediate fallbacks for
const FALLBACK_PROVIDERS = [
  'ofx', 'barclays', 'skrill', 'lloyds', 'halifax', 
  'nationwide', 'paypal', 'western-union', 'monese',
  'moneygram', 'natwest', 'rbs'
];

// Apply rate limiting to all routes in this router
router.use(ratingsLimiter);

/**
 * @route   GET /api/google-ratings/health
 * @desc    Check if the database is connected
 * @access  Public
 */
router.get('/health', (req, res) => {
  console.log('DB Connection state:', mongoose.connection.readyState);
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    success: true,
    database: {
      state: dbState[mongoose.connection.readyState],
      connected: mongoose.connection.readyState === 1
    },
    timestamp: new Date()
  });
});

/**
 * Create fallback rating data for a provider
 * @param {string} providerName - Provider name
 * @returns {Object} - Fallback rating object
 */
const createFallbackRating = (providerName) => {
  return {
    providerName,
    placeId: 'fallback',
    googleRating: 4.0,
    reviewCount: 100,
    lastUpdated: new Date(),
    isFallback: true
  };
};

/**
 * @route   GET /api/google-ratings
 * @desc    Get Google ratings for all providers
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/google-ratings - Fetching all ratings');
    
    // Try to get ratings from database
    let ratings = [];
    
    try {
      ratings = await ProviderRating.find().sort('providerName');
      console.log(`Found ${ratings.length} ratings in database`);
    } catch (dbError) {
      console.error('Database error getting ratings:', dbError);
      // Return a helpful message but don't fail the request
      return res.json({
        success: true,
        message: 'Unable to fetch ratings from database, using fallback data',
        count: 0,
        data: []
      });
    }
    
    res.json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    console.error('Error fetching Google ratings:', error);
    // Return a 200 with empty data instead of 500
    res.json({
      success: false,
      message: 'Could not fetch Google ratings',
      count: 0,
      data: []
    });
  }
});

/**
 * @route   GET /api/google-ratings/:providerName
 * @desc    Get Google rating for a specific provider
 * @access  Public
 */
router.get('/:providerName', async (req, res) => {
  try {
    const { providerName } = req.params;
    console.log(`GET /api/google-ratings/${providerName}`);
    
    if (!providerName) {
      return res.json({
        success: true,
        data: createFallbackRating('unknown')
      });
    }
    
    // Check if this is a provider we want to immediately return fallback data for
    if (FALLBACK_PROVIDERS.includes(providerName.toLowerCase())) {
      console.log(`Using immediate fallback for ${providerName}`);
      return res.json({
        success: true,
        data: createFallbackRating(providerName)
      });
    }
    
    // Format provider name for better matching
    const formattedName = providerName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log(`Formatted provider name: ${formattedName}`);
    
    // Use a try-catch immediately so we don't throw any errors
    let rating = null;
    
    try {
      // Try to find existing rating in database directly (not through service)
      if (mongoose.connection.readyState === 1) {
        try {
          rating = await ProviderRating.findOne({ 
            providerName: { $regex: new RegExp(`^${formattedName}$`, 'i') }
          });
          
          if (rating) {
            console.log(`Found rating in database for ${formattedName}`);
          } else {
            console.log(`No rating found in database for ${formattedName}`);
          }
        } catch (dbError) {
          console.error(`Database error for ${formattedName}:`, dbError);
          // Continue to fallback
        }
      } else {
        console.log('MongoDB not connected, using fallback');
      }
      
      // If no database result, use service
      if (!rating) {
        try {
          rating = await googleReviewService.getProviderRating(formattedName);
        } catch (serviceError) {
          console.error(`Service error for ${formattedName}:`, serviceError);
          // Continue to fallback
        }
      }
    } catch (error) {
      console.error(`General error for ${providerName}:`, error);
      // Continue to fallback
    }
    
    // If still no rating, return fallback
    if (!rating) {
      console.log(`No rating found for ${formattedName}, using fallback`);
      rating = createFallbackRating(formattedName);
    }
    
    // Return whatever data we got
    return res.json({
      success: true,
      data: rating
    });
  } catch (error) {
    console.error(`Error in rating route for ${req.params.providerName}:`, error);
    // Return fallback data instead of error
    return res.json({
      success: true,
      data: createFallbackRating(req.params.providerName)
    });
  }
});

module.exports = router; 