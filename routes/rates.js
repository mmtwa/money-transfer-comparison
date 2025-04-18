const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const providerService = require('../services/providerService');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to all routes
const ratesLimiter = createRateLimiter(200, 15 * 60 * 1000); // 200 requests per 15 minutes
router.use(ratesLimiter);

/**
 * @route   GET /api/rates/compare
 * @desc    Get comparison of exchange rates from all providers
 * @access  Public
 */
router.get('/compare', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(300), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    const results = await providerService.getExchangeRates(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    // Save the comparison to user's history if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedComparisons: {
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            amount: parseFloat(amount),
            date: new Date()
          }
        }
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch exchange rates',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/rates/provider/:provider
 * @desc    Get exchange rates from a specific provider
 * @access  Public
 */
router.get('/provider/:provider', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(180), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  const { provider } = req.params;
  
  try {
    // Get all exchange rates first
    const allResults = await providerService.getExchangeRates(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    // Filter for the specific provider
    const providerResult = allResults.find(r => r.providerCode.toLowerCase() === provider.toLowerCase());
    
    if (!providerResult) {
      return res.status(404).json({
        success: false,
        message: `No data available for provider ${provider}`
      });
    }
    
    res.json({
      success: true,
      data: providerResult
    });
  } catch (error) {
    console.error(`Error fetching rates for provider ${provider}:`, error);
    res.status(500).json({
      success: false,
      message: `Could not fetch exchange rates for provider ${provider}`,
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/rates/history
 * @desc    Get historical exchange rates for a currency pair
 * @access  Public
 */
router.get('/history', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('days', 'Days must be a positive integer').optional().isInt({ min: 1, max: 365 })
], cacheApiResponse(3600), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency } = req.query;
  const days = parseInt(req.query.days || 30);
  
  try {
    // This would typically come from a historical rate service or database
    // For this example, we'll generate mock data
    const history = await generateHistoricalData(fromCurrency, toCurrency, days);
    
    res.json({
      success: true,
      fromCurrency,
      toCurrency,
      days,
      data: history
    });
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch historical exchange rates',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/rates/cache/clear
 * @desc    Clear rate cache
 * @access  Private/Admin
 */
router.post('/cache/clear', auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency } = req.body;
    
    // Clear specific cache or all cache
    await providerService.clearCache(fromCurrency, toCurrency);
    
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Could not clear cache',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

// Helper function to generate historical data for a currency pair
async function generateHistoricalData(fromCurrency, toCurrency, days) {
  // Try to get real historical data first
  try {
    // Using Wise API for historical data
    const wiseApiService = require('../services/wiseApiService');
    
    // If Wise API is available, use it
    if (process.env.WISE_API_KEY) {
      // Call Wise API historical data endpoint
      // Note: This is a placeholder - you'll need to implement this in wiseApiService.js
      // based on the actual Wise API capabilities
      return await wiseApiService.getHistoricalRates(fromCurrency, toCurrency, days);
    }
  } catch (error) {
    console.warn('Failed to get real historical data, falling back to generated data');
  }
  
  // Fall back to generated data
  const baseRate = getBaseMockRate(fromCurrency, toCurrency);
  const history = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate a rate with some random fluctuation
    const fluctuation = (Math.random() - 0.5) * 0.02; // +/- 1%
    const rate = baseRate * (1 + fluctuation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(rate.toFixed(6))
    });
  }
  
  return history;
}

// Helper function to get a base mock rate for a currency pair
function getBaseMockRate(fromCurrency, toCurrency) {
  const mockRates = {
    'USD': { 'EUR': 0.91, 'GBP': 0.78, 'JPY': 110.23, 'CAD': 1.35 },
    'EUR': { 'USD': 1.10, 'GBP': 0.86, 'JPY': 121.34, 'CAD': 1.48 },
    'GBP': { 'USD': 1.28, 'EUR': 1.16, 'JPY': 140.87, 'CAD': 1.72 },
    'JPY': { 'USD': 0.0091, 'EUR': 0.0082, 'GBP': 0.0071, 'CAD': 0.012 },
    'CAD': { 'USD': 0.74, 'EUR': 0.67, 'GBP': 0.58, 'JPY': 81.65 }
  };
  
  if (mockRates[fromCurrency] && mockRates[fromCurrency][toCurrency]) {
    return mockRates[fromCurrency][toCurrency];
  } else if (mockRates[toCurrency] && mockRates[toCurrency][fromCurrency]) {
    return 1 / mockRates[toCurrency][fromCurrency];
  } else {
    return 1; // Default fallback
  }
}

module.exports = router;