const express = require('express');
const router = express.Router();
const revolutService = require('../services/revolutService');
const { check, validationResult } = require('express-validator');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to the Revolut route
const revolutLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 mins

/**
 * @route   GET /api/revolut/rate
 * @desc    Get Revolut exchange rate for a specific currency pair and amount
 * @access  Public
 */
router.get('/rate', [
  revolutLimiter, // Apply rate limiter
  // No need for cache middleware since we handle caching in the service
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
  console.log('[API /revolut/rate] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /revolut/rate] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { fromCurrency, toCurrency, amount, sourceCountry, destCountry } = req.query;
    
    // Get exchange rate from Revolut
    const rateInfo = await revolutService.getExchangeRate(
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
        rateInfo.error.includes('No payment plans found')
      )) {
        // Return 400 Bad Request for unsupported currency pairs
        return res.status(400).json({
          success: false,
          message: 'This currency pair is not supported by Revolut',
          error: rateInfo.error
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error getting Revolut exchange rate',
        error: rateInfo.error
      });
    }
    
    return res.status(200).json({
      success: true,
      cached: rateInfo.cached,
      data: rateInfo.data
    });
  } catch (error) {
    console.error('[API /revolut/rate] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error getting Revolut exchange rate',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/revolut/compare
 * @desc    Get Revolut formatted for provider comparison
 * @access  Public
 */
router.get('/compare', [
  revolutLimiter, // Apply rate limiter
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
  console.log('[API /revolut/compare] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /revolut/compare] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { fromCurrency, toCurrency, amount, sourceCountry, destCountry } = req.query;
    
    // Parse amount as float
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }
    
    // Get exchange rate from Revolut - explicitly requesting BANK transfers with STANDARD plan
    const rateInfo = await revolutService.getExchangeRate(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parsedAmount,
      sourceCountry,
      destCountry
    );
    
    if (!rateInfo.success) {
      // Check for specific error types to return appropriate status codes
      if (rateInfo.error && (
        rateInfo.error.includes('not supported') || 
        rateInfo.error.includes('No payment plans found') ||
        rateInfo.error.includes('No BANK transfer routes') ||
        rateInfo.error.includes('No STANDARD plans')
      )) {
        // Return 400 Bad Request for unsupported currency pairs
        return res.status(400).json({
          success: false,
          message: 'This currency pair is not supported by Revolut for BANK transfers with STANDARD plan',
          error: rateInfo.error
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error getting Revolut exchange rate',
        error: rateInfo.error
      });
    }
    
    // Verify that we have the required data
    if (!rateInfo.data || !rateInfo.data.exchange_rate || !rateInfo.data.route || rateInfo.data.route !== 'BANK' || 
        !rateInfo.data.plan || rateInfo.data.plan !== 'STANDARD') {
      console.error('[API /revolut/compare] Invalid data received from Revolut service:', rateInfo.data);
      return res.status(500).json({
        success: false,
        message: 'Invalid data received from Revolut API - missing BANK transfer or STANDARD plan information',
        data: null
      });
    }
    
    // Format for provider card
    const providerData = revolutService.formatForProviderCard(
      rateInfo.data,
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parsedAmount
    );
    
    return res.status(200).json({
      success: true,
      cached: rateInfo.cached,
      data: [providerData] // Return as array for consistency with other provider APIs
    });
  } catch (error) {
    console.error('[API /revolut/compare] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error getting Revolut comparison data',
      error: error.message
    });
  }
});

module.exports = router; 