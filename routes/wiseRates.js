const express = require('express');
const router = express.Router();
const wiseRatesService = require('../services/wiseRatesService');
const { check, validationResult } = require('express-validator');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to rates route
const ratesLimiter = createRateLimiter(200, 15 * 60 * 1000); // 200 requests per 15 mins

/**
 * @route   GET /api/wise-rates
 * @desc    Get current exchange rate from Wise API
 * @access  Public
 */
router.get('/', [
  ratesLimiter, // Apply rate limiter
  cacheApiResponse(120), // Cache response for 2 minutes
  check('source', 'Source currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('target', 'Target currency is required').notEmpty().isLength({ min: 3, max: 3 })
], async (req, res) => {
  console.log('[API /wise-rates] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /wise-rates] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { source, target, time } = req.query;
  
  try {
    console.log(`[API /wise-rates] Requesting rate from Wise API for ${source} to ${target}${time ? `, at time: ${time}` : ''}`);
    
    // Get exchange rate from Wise API
    let rateData;
    if (time) {
      rateData = await wiseRatesService.getHistoricalRate(
        source.toUpperCase(),
        target.toUpperCase(),
        time
      );
    } else {
      rateData = await wiseRatesService.getCurrentRate(
        source.toUpperCase(),
        target.toUpperCase()
      );
    }
    
    if (!rateData) {
      return res.status(404).json({
        success: false,
        message: 'No rate data found for the specified currency pair and time'
      });
    }
    
    res.json({
      success: true,
      data: rateData
    });

  } catch (error) {
    console.error('[API /wise-rates] Error fetching rate from Wise API:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch rate data from Wise API',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/wise-rates/historical
 * @desc    Get historical exchange rates from Wise API
 * @access  Public
 */
router.get('/historical', [
  ratesLimiter, // Apply rate limiter
  cacheApiResponse(300), // Cache response for 5 minutes
  check('source', 'Source currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('target', 'Target currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('from', 'From date is required').notEmpty(),
  check('to', 'To date is required').notEmpty(),
  check('group', 'Group must be day, hour, or minute').optional().isIn(['day', 'hour', 'minute'])
], async (req, res) => {
  console.log('[API /wise-rates/historical] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /wise-rates/historical] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { source, target, from, to, group = 'day' } = req.query;
  
  try {
    console.log(`[API /wise-rates/historical] Requesting historical rates from ${from} to ${to} with group ${group}`);
    
    // Get historical exchange rates from Wise API
    const historicalRates = await wiseRatesService.getHistoricalRates(
      source.toUpperCase(),
      target.toUpperCase(),
      from,
      to,
      group
    );
    
    if (!historicalRates || historicalRates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No historical rate data found for the specified parameters'
      });
    }
    
    res.json({
      success: true,
      count: historicalRates.length,
      data: historicalRates
    });

  } catch (error) {
    console.error('[API /wise-rates/historical] Error fetching historical rates from Wise API:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch historical rate data from Wise API',
      error: error.message
    });
  }
});

module.exports = router; 