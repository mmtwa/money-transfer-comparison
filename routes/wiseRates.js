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

module.exports = router;