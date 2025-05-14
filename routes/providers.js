const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const providerService = require('../services/providerService');
const { check, validationResult } = require('express-validator');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to comparison route
const compareLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 mins

/**
 * @route   GET /api/providers/compare
 * @desc    Get comparison of exchange rates from all active providers
 * @access  Public
 */
router.get('/compare', [
  compareLimiter, // Apply rate limiter
  cacheApiResponse(300), // Cache response for 5 minutes
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
  console.log('[API /compare] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /compare] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    console.log(`[API /compare] Requesting rates via providerService for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
    
    // Ensure providerService is initialized
    if (!await providerService.isInitialized()) {
      console.warn('[API /compare] Provider service not initialized, initializing now...');
      await providerService.initialize();
    }
    
    // Get rates from the service
    const results = await providerService.getExchangeRates(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    console.log(`[API /compare] Received ${results.length} results from providerService`);
    
    // Transform results for the frontend
    const frontendResults = results.map(result => ({
      providerId: result.provider.id,
      providerCode: result.provider.name.toLowerCase().replace(/\s+/g, ''), // Generate code from name
      providerName: result.provider.name,
      providerLogo: result.provider.logo,
      baseRate: result.rate, // Base rate (before margin/fees considered in effectiveRate)
      effectiveRate: result.effectiveRateWithFees, // Effective rate including fees
      transferFee: result.transferFee,
      marginPercentage: providerService.providers[result.provider.name.toLowerCase()]?.exchangeRateMargin ? providerService.providers[result.provider.name.toLowerCase()].exchangeRateMargin * 100 : null, // Get margin from provider config
      marginCost: result.totalCost - result.transferFee, // Estimate margin cost
      totalCost: result.totalCost,
      amountReceived: result.amountReceived,
      transferTimeHours: providerService.providers[result.provider.name.toLowerCase()]?.transferTimeHours, // Get hours object from provider config
      transferTime: result.deliveryTime, // Pass formatted time string
      rating: result.provider.rating,
      methods: result.methods,
      realTimeApi: true, // Assume all results from this endpoint are real-time
      isIndicative: false, // Mark as non-indicative
      timestamp: new Date().toISOString()
    }));
    
    console.log('[API /compare] Sending response to client');
    res.json({
      success: true,
      count: frontendResults.length,
      data: frontendResults
    });

  } catch (error) {
    console.error('[API /compare] Error fetching rates:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch exchange rates',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/providers
 * @desc    Get all active providers
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const providers = await providerService.getActiveProviders();
    
    res.json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch providers',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/providers/:id
 * @desc    Get single provider by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
    
    // Reinitialize the provider service to remove the deleted provider
    await providerService.initialize();
  } catch (error) {
    console.error('Error deleting provider:', error);
    res.status(400).json({
      success: false,
      message: 'Could not delete provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router;
