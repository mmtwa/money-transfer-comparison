const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const cheerio = require('cheerio');
const TrustpilotRating = require('../models/TrustpilotRating');

// Rate limiting for GET requests (MongoDB cache) - very lenient
const getLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // Allow 500 requests per minute for cached data (increased from 100)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});

// Rate limiting for POST requests (Trustpilot updates) - very strict
const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Only 50 updates per hour (increased from 5)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many update requests from this IP, please try again later'
  }
});

// Provider name to Trustpilot URL mapping
const PROVIDER_URLS = {
  'torfx': 'www.torfx.com',
  'regency fx': 'regencyfx.com',
  'pandaremit': 'pandaremit.com',
  'wise': 'wise.com',
  'westernunion': 'westernunion.com',
  'moneygram': 'moneygram.com',
  'worldremit': 'worldremit.com',
  'remitly': 'remitly.com',
  'xe': 'xe.com',
  'currencyfair': 'currencyfair.com',
  'transferwise': 'wise.com', // TransferWise is now Wise
  'paypal': 'paypal.com',
  // Updated Skrill URLs to point to the correct Trustpilot review page (TrustScore 4.5)
  'skrill': 'transfers.skrill.com', 
  'skrillmoneytransfer': 'transfers.skrill.com',
  'skrill money transfer': 'transfers.skrill.com',
  'revolut': 'revolut.com',
  'monzo': 'monzo.com',
  'starling': 'starlingbank.com',
  'hsbc': 'hsbc.co.uk',
  'barclays': 'barclays.co.uk',
  'lloyds': 'lloydsbank.com',
  'halifax': 'halifax.co.uk',
  'natwest': 'natwest.com',
  'rbs': 'rbs.co.uk',
  'santander': 'santander.co.uk',
  'nationwide': 'nationwide.co.uk',
  'ofx': 'ofx.com',
  'profee': 'profee.com',
  'chase': 'chase.co.uk',
  'firstdirect': 'firstdirect.com',
  'metrobank': 'metrobank.co.uk',
  'virginmoney': 'virginmoney.co.uk',
  'tsb': 'tsb.co.uk',
  'coopbank': 'co-operativebank.co.uk',
  'yorkshirebank': 'yorkshirebank.co.uk',
  'clydesdalebank': 'clydesdalebank.co.uk',
  'bankofscotland': 'bankofscotland.co.uk',
  'ulsterbank': 'ulsterbank.co.uk',
  'bankofireland': 'bankofireland.co.uk',
  'aib': 'aib.ie',
  'permanenttsb': 'permanenttsb.ie',
  'kbc': 'kbc.ie',
  'boi': 'bankofireland.co.uk',
  'ptsb': 'permanenttsb.ie',
  'ulster': 'ulsterbank.co.uk'
};

// Cache duration in milliseconds (7 days)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

// In-memory request cache to prevent duplicate simultaneous requests
const requestCache = {
  ongoing: new Map(), // Map of ongoing requests by normalizedName
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

// Apply rate limiting to specific routes
router.get('/:providerName', getLimiter);
router.post('/update/:providerName', postLimiter);

// Helper function to fetch and save a Trustpilot rating
async function fetchAndSaveTrustpilotRating(normalizedName) {
  // Get the provider's Trustpilot URL
  const providerUrl = PROVIDER_URLS[normalizedName];
  if (!providerUrl) {
    throw new Error('Provider not found in Trustpilot mapping');
  }

  // Construct Trustpilot URL
  const trustpilotUrl = `https://uk.trustpilot.com/review/${providerUrl}`;
  console.log(`Fetching Trustpilot rating from: ${trustpilotUrl}`);

  // Fetch the Trustpilot page
  const response = await axios.get(trustpilotUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 10000
  });

  // Load the HTML into cheerio
  const $ = cheerio.load(response.data);
  
  // Debug: Log the page title and content
  console.log('Page title:', $('title').text());
  console.log('TrustScore text:', $('.trustscore').text());
  console.log('Headline trustscore:', $('.headline__trustscore').text());
  
  const rating = extractRating($);
  console.log('Extracted rating:', rating);

  if (!rating) {
    throw new Error('Could not find rating');
  }

  // Cache the rating in MongoDB
  console.log(`Attempting to save rating ${rating} to MongoDB for provider ${normalizedName}`);
  const updatedRating = await TrustpilotRating.findOneAndUpdate(
    { providerName: normalizedName },
    { 
      providerName: normalizedName,
      rating: rating,
      lastUpdated: new Date()
    },
    { upsert: true, new: true }
  );
  console.log('MongoDB save result:', updatedRating);

  return updatedRating;
}

/**
 * @route   GET /api/trustpilot-ratings/:providerName
 * @desc    Get Trustpilot rating for a specific provider from MongoDB cache
 * @access  Public
 */
router.get('/:providerName', async (req, res) => {
  try {
    const { providerName } = req.params;
    console.log(`GET /api/trustpilot-ratings/${providerName}`);
    console.log('Request headers:', req.headers);
    
    if (!providerName) {
      console.log('No provider name provided');
      return res.json({
        success: false,
        message: 'Provider name is required'
      });
    }

    // Clean and normalize the provider name
    const normalizedName = providerName.toLowerCase()
      .replace(/^provider-/, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    console.log(`Normalized provider name: ${normalizedName}`);
    console.log('Provider URL mapping:', PROVIDER_URLS[normalizedName]);

    // Check in-memory cache first
    if (requestCache.results.has(normalizedName)) {
      console.log(`Returning in-memory cached result for ${normalizedName}`);
      return res.json(requestCache.results.get(normalizedName));
    }
    
    // Check MongoDB cache
    const cachedRating = await TrustpilotRating.findOne({ providerName: normalizedName });
    console.log('MongoDB cached rating:', cachedRating);
    
    if (cachedRating) {
      console.log(`Returning cached rating for ${normalizedName} from MongoDB`);
      const result = {
        success: true,
        data: {
          value: cachedRating.rating,
          source: 'Trustpilot (cached)',
          lastUpdated: cachedRating.lastUpdated
        }
      };
      
      // Cache the result
      requestCache.results.set(normalizedName, result);
      requestCache.timestamps.set(normalizedName, Date.now());
      
      return res.json(result);
    }

    console.log(`No cached rating found for ${normalizedName}, checking if we can fetch from Trustpilot`);
    
    // Check if this provider is in our mapping
    if (!PROVIDER_URLS[normalizedName]) {
      console.log(`Provider ${normalizedName} not found in URL mapping`);
      
      const notFoundResult = {
        success: false,
        message: 'Provider not found in Trustpilot mapping'
      };
      
      // Cache the not found result
      requestCache.results.set(normalizedName, notFoundResult);
      requestCache.timestamps.set(normalizedName, Date.now());
      
      return res.json(notFoundResult);
    }
    
    // Try to fetch from Trustpilot
    try {
      const newRating = await fetchAndSaveTrustpilotRating(normalizedName);
      
      console.log(`Created new rating for ${normalizedName}:`, newRating);
      
      const result = {
        success: true,
        data: {
          value: newRating.rating,
          source: 'Trustpilot (new)',
          lastUpdated: newRating.lastUpdated
        }
      };
      
      // Cache the result
      requestCache.results.set(normalizedName, result);
      requestCache.timestamps.set(normalizedName, Date.now());
      
      return res.json(result);
    } catch (fetchError) {
      console.error(`Error fetching Trustpilot rating for ${normalizedName}:`, fetchError.message);
      
      const errorResult = {
        success: false,
        message: `Could not fetch Trustpilot rating: ${fetchError.message}`
      };
      
      // Cache the error
      requestCache.results.set(normalizedName, errorResult);
      requestCache.timestamps.set(normalizedName, Date.now());
      
      return res.json(errorResult);
    }
  } catch (error) {
    console.error(`Error in rating route for ${req.params.providerName}:`, error);
    return res.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/trustpilot-ratings/update/:providerName
 * @desc    Manually update Trustpilot rating for a specific provider
 * @access  Private (should be protected in production)
 */
router.post('/update/:providerName', async (req, res) => {
  try {
    const { providerName } = req.params;
    console.log(`POST /api/trustpilot-ratings/update/${providerName}`);
    
    if (!providerName) {
      return res.json({
        success: false,
        message: 'Provider name is required'
      });
    }

    // Clean and normalize the provider name
    const normalizedName = providerName.toLowerCase()
      .replace(/^provider-/, '')
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters but keep spaces
      .trim();

    console.log(`Updating rating for provider: ${normalizedName}`);

    // Check if this provider is in our mapping
    if (!PROVIDER_URLS[normalizedName]) {
      console.log(`Provider ${normalizedName} not found in URL mapping`);
      return res.json({
        success: false,
        message: 'Provider not found in Trustpilot mapping'
      });
    }

    try {
      const updatedRating = await fetchAndSaveTrustpilotRating(normalizedName);
      
      const result = {
        success: true,
        data: {
          value: updatedRating.rating,
          source: 'Trustpilot (updated)',
          lastUpdated: updatedRating.lastUpdated
        }
      };
      
      // Update the in-memory cache
      requestCache.results.set(normalizedName, result);
      requestCache.timestamps.set(normalizedName, Date.now());
      
      // Set cache headers
      res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      
      return res.json(result);
    } catch (error) {
      console.error(`Error fetching Trustpilot rating for ${providerName}:`, error);
      return res.json({
        success: false,
        message: 'Could not fetch Trustpilot rating',
        error: error.message
      });
    }
  } catch (error) {
    console.error(`Error in update route for ${req.params.providerName}:`, error);
    return res.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Helper function to extract rating from cheerio object
function extractRating($) {
  // Log the title to help with debugging
  console.log('Page title:', $('title').text());
  
  // Additional logging to help with debugging
  console.log('Page content snippet:', $('body').text().slice(0, 500) + '...');
  
  // Try multiple selectors for the rating
  const selectors = [
    // Look for TrustScore x.x out of 5 text pattern (common on newer Trustpilot pages)
    () => {
      const trustScoreText = $('body').text().match(/TrustScore\s+([\d\.]+)\s+out of\s+5/i);
      if (trustScoreText && trustScoreText[1]) {
        console.log('Found TrustScore from text pattern:', trustScoreText[1]);
        return parseFloat(trustScoreText[1]);
      }
      return null;
    },
    // Look for the exact rating text in the page
    () => {
      const ratingText = $('body').text().match(/TrustScore\s+([\d\.]+)/i);
      if (ratingText && ratingText[1]) {
        console.log('Found rating from TrustScore text:', ratingText[1]);
        return parseFloat(ratingText[1]);
      }
      return null;
    },
    // Look for the rating in the headline section
    () => {
      const headlineRating = $('.headline__trustscore').text().trim();
      console.log('Found headline rating:', headlineRating);
      const ratingMatch = headlineRating.match(/([\d\.]+)/);
      if (ratingMatch) {
        return parseFloat(ratingMatch[1]);
      }
      return null;
    },
    // Look for the rating in the trustscore section
    () => {
      const trustScore = $('.trustscore').text().trim();
      console.log('Found trustscore:', trustScore);
      const ratingMatch = trustScore.match(/([\d\.]+)/);
      if (ratingMatch) {
        return parseFloat(ratingMatch[1]);
      }
      return null;
    },
    // Look for meta tags with rating information
    () => {
      const metaRating = $('meta[itemprop="ratingValue"]').attr('content');
      if (metaRating) {
        console.log('Found rating from meta tag:', metaRating);
        return parseFloat(metaRating);
      }
      return null;
    }
  ];

  // Try each selector until we find a rating
  for (const selector of selectors) {
    const rating = selector();
    if (rating !== null) {
      console.log('Found rating:', rating);
      // Ensure we return the exact decimal rating
      return parseFloat(rating.toFixed(1));
    }
  }

  console.log('No rating found with any selector');
  return null;
}

module.exports = router; 