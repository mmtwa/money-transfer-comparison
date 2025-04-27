const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const wiseApiService = require('../services/wiseApiService');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to all routes
const rateLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes
router.use(rateLimiter);

/**
 * @route   GET /api/wise/rate
 * @desc    Get real-time exchange rate from Wise API
 * @access  Public
 */
router.get('/rate', [
  check('fromCurrency', 'Source currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'Target currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(300), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors: errors.array() 
    });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    const rateData = await wiseApiService.getExchangeRate(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    res.json({
      success: true,
      data: rateData
    });
  } catch (error) {
    console.error('Error fetching Wise rate:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch rate from Wise',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/wise/fee
 * @desc    Get transfer fee information from Wise API
 * @access  Public
 */
router.get('/fee', [
  check('fromCurrency', 'Source currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'Target currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(300), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors: errors.array() 
    });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    const feeData = await wiseApiService.getTransferPricing(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    res.json({
      success: true,
      data: feeData
    });
  } catch (error) {
    console.error('Error fetching Wise fees:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch transfer fees from Wise',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/wise/currencies
 * @desc    Get available currencies from Wise API
 * @access  Public
 */
router.get('/currencies', cacheApiResponse(86400), async (req, res) => {
  try {
    // Use the supportedCurrencyPairs array from wiseApiService
    const currencies = wiseApiService.supportedCurrencyPairs;
    
    // Extract unique currencies from the pairs
    const uniqueCurrencies = [...new Set([
      ...currencies.map(pair => pair.source),
      ...currencies.map(pair => pair.target)
    ])];
    
    res.json({
      success: true,
      count: uniqueCurrencies.length,
      data: uniqueCurrencies.map(code => ({ code }))
    });
  } catch (error) {
    console.error('Error fetching Wise currencies:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch available currencies from Wise',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/wise/test
 * @desc    Test Wise API credentials
 * @access  Public (but could be restricted to admin in production)
 */
router.get('/test', async (req, res) => {
  try {
    const testResult = await wiseApiService.testApiCredentials();
    
    res.json({
      success: testResult.success,
      message: testResult.message,
      data: testResult
    });
  } catch (error) {
    console.error('Error testing Wise API:', error);
    res.status(500).json({
      success: false,
      message: 'Could not test Wise API connection',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/wise/test-credentials
 * @desc    Test the Wise API credentials
 * @access  Public
 */
router.get('/test-credentials', async (req, res) => {
  try {
    console.log('Testing Wise API credentials...');
    const testResult = await wiseApiService.testApiCredentials();
    
    if (testResult.success) {
      console.log('Wise API credentials are valid');
      res.json({
        success: true,
        message: 'Wise API credentials are valid',
        details: testResult
      });
    } else {
      console.log('Wise API credentials are invalid', testResult.message);
      res.status(401).json({
        success: false,
        message: 'Wise API credentials are invalid',
        details: testResult
      });
    }
  } catch (error) {
    console.error('Error testing Wise API credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing Wise API credentials',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/wise/compare
 * @desc    Get price comparison data from Wise API showing all providers
 * @access  Public
 */
router.get('/compare', [
  check('fromCurrency', 'Source currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'Target currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
  check('sourceCountry', 'Source country must be a 2-letter code').optional().isLength({ min: 2, max: 2 }),
  check('targetCountry', 'Target country must be a 2-letter code').optional().isLength({ min: 2, max: 2 }),
  check('providerType', 'Provider type must be a string').optional().isString()
], cacheApiResponse(300), async (req, res) => {
  console.log('[API] /api/wise/compare endpoint called');
  
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('[API] Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    // Extract parameters
    const { fromCurrency, toCurrency, amount, sourceCountry, targetCountry, providerType } = req.query;
    
    // Validate required parameters (belt and suspenders approach)
    if (!fromCurrency || !toCurrency || !amount) {
      console.error('[API] Missing required parameters:', { fromCurrency, toCurrency, amount });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters. Please provide fromCurrency, toCurrency, and amount.' 
      });
    }
    
    // Validate amount is a number and positive
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('[API] Invalid amount parameter:', amount);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid amount. Please provide a positive number.' 
      });
    }
    
    // Log request details for debugging
    console.log('[API] Wise comparison request:', {
      fromCurrency,
      toCurrency,
      amount: numericAmount,
      sourceCountry: sourceCountry || 'not specified',
      targetCountry: targetCountry || 'not specified',
      providerType: providerType || 'all providers'
    });
    
    // Get comparison data from Wise API service
    const comparisonData = await wiseApiService.getPriceComparison(
      fromCurrency,
      toCurrency,
      numericAmount,
      sourceCountry || null,
      targetCountry || null,
      providerType || null
    );
    
    // Validate response data structure
    if (!comparisonData) {
      console.error('[API] No data returned from Wise API service');
      throw new Error('No data returned from Wise API service');
    }
    
    if (!comparisonData.providers) {
      console.error('[API] Invalid response structure from Wise API service - missing providers array');
      throw new Error('Invalid response structure from Wise API - missing providers array');
    }
    
    // Return successful response
    console.log(`[API] Successfully retrieved ${comparisonData.providers.length} providers for comparison`);
    return res.json({
      success: true,
      data: comparisonData
    });
    
  } catch (error) {
    console.error('[API] Error in /api/wise/compare endpoint:', error.message);
    console.error('[API] Error stack:', error.stack);
    
    // Handle specific error types with appropriate status codes
    if (error.message.includes('Invalid response') || error.message.includes('Received HTML')) {
      return res.status(502).json({
        success: false,
        error: 'Unable to process the request due to an issue with the Wise API service.',
        message: 'The Wise comparison API returned an invalid response format.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.message.includes('No data returned')) {
      return res.status(504).json({
        success: false,
        error: 'No data returned from the Wise API service.',
        message: 'The request to the Wise API timed out or returned empty data.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Fallback error handler
    const statusCode = error.statusCode || 500;
    const errorResponse = {
      success: false,
      error: 'Failed to get comparison data from Wise API',
      message: 'An unexpected error occurred while processing your request.'
    };
    
    // Only in development, include more error details
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error.message;
      errorResponse.stack = error.stack;
      
      // For development only: provide a fallback for testing
      if (process.env.NODE_ENV === 'development' && process.env.ENABLE_FALLBACK_RESPONSES === 'true') {
        console.log('[API] Development environment - returning fallback comparison data');
        return res.json({
          success: true,
          fallback: true,
          data: {
            sourceCurrency: fromCurrency,
            targetCurrency: toCurrency,
            sendAmount: numericAmount,
            providers: [],
            timestamp: new Date().toISOString()
          },
          message: 'Returning empty fallback data for development. Enable the real API in production.'
        });
      }
    }
    
    return res.status(statusCode).json(errorResponse);
  }
});

module.exports = router;