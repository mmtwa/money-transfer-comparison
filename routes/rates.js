// routes/rates.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const providerService = require('../services/providerService');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/rates/compare
 * @desc    Get comparison of exchange rates from all providers
 * @access  Public
 */
router.get('/compare', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
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
 * @route   GET /api/rates/history
 * @desc    Get historical exchange rates for a currency pair
 * @access  Public
 */
router.get('/history', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('days', 'Days must be a positive integer').optional().isInt({ min: 1, max: 365 })
], async (req, res) => {
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
    const history = generateMockHistoricalData(fromCurrency, toCurrency, days);
    
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

// Helper function to generate mock historical data
function generateMockHistoricalData(fromCurrency, toCurrency, days) {
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