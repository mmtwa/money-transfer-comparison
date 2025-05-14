const express = require('express');
const router = express.Router();
const remitlyService = require('../services/remitlyService');
const { check, validationResult } = require('express-validator');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to the Remitly route
const remitlyLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 mins

/**
 * @route   GET /api/remitly/rate
 * @desc    Get Remitly exchange rate for a specific currency pair and amount
 * @access  Public
 */
router.get('/rate', [
  remitlyLimiter, // Apply rate limiter
  // No need for cache middleware since we handle caching in the service
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
  console.log('[API /remitly/rate] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /remitly/rate] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { fromCurrency, toCurrency, amount, sourceCountry, destCountry } = req.query;
    
    // Get exchange rate from Remitly
    const rateInfo = await remitlyService.getExchangeRate(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount),
      sourceCountry,
      destCountry
    );
    
    if (!rateInfo.success) {
      // Check for specific error types to return appropriate status codes
      if (rateInfo.error && (
        rateInfo.error.includes('not supported') || 
        rateInfo.error.includes('rejected the request')
      )) {
        // Return 400 Bad Request for unsupported currency pairs
        return res.status(400).json({
          success: false,
          message: 'This currency pair is not supported by Remitly',
          error: rateInfo.error
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error getting Remitly exchange rate',
        error: rateInfo.error
      });
    }
    
    return res.status(200).json({
      success: true,
      cached: rateInfo.cached,
      data: rateInfo.data
    });
  } catch (error) {
    console.error('[API /remitly/rate] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error getting Remitly exchange rate',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/remitly/compare
 * @desc    Get Remitly formatted for provider comparison
 * @access  Public
 */
router.get('/compare', [
  remitlyLimiter, // Apply rate limiter
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
  console.log('[API /remitly/compare] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /remitly/compare] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { fromCurrency, toCurrency, amount, sourceCountry, destCountry } = req.query;
    
    // Get exchange rate from Remitly
    const rateInfo = await remitlyService.getExchangeRate(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount),
      sourceCountry,
      destCountry
    );
    
    if (!rateInfo.success) {
      // Check for specific error types to return appropriate status codes
      if (rateInfo.error && (
        rateInfo.error.includes('not supported') || 
        rateInfo.error.includes('rejected the request')
      )) {
        // Return 400 Bad Request for unsupported currency pairs
        return res.status(400).json({
          success: false,
          message: 'This currency pair is not supported by Remitly',
          error: rateInfo.error
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error getting Remitly exchange rate',
        error: rateInfo.error
      });
    }
    
    // Format for provider card
    const providerData = remitlyService.formatForProviderCard(
      rateInfo.data,
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    return res.status(200).json({
      success: true,
      cached: rateInfo.cached,
      data: [providerData] // Return as array for consistency with other provider APIs
    });
  } catch (error) {
    console.error('[API /remitly/compare] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error getting Remitly comparison data',
      error: error.message
    });
  }
});

module.exports = router; 