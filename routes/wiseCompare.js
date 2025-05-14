const express = require('express');
const router = express.Router();
const wiseApiService = require('../services/wiseApiService');
const { check, validationResult } = require('express-validator');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');

// Apply rate limiting to comparison route
const compareLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 mins

/**
 * @route   GET /api/wise-compare
 * @desc    Get comparison data from Wise API
 * @access  Public
 */
router.get('/', [
  compareLimiter, // Apply rate limiter
  cacheApiResponse(120), // Cache response for 2 minutes
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], async (req, res) => {
  console.log('[API /wise-compare] Endpoint called with query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[API /wise-compare] Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    console.log(`[API /wise-compare] Requesting comparison from Wise API for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
    
    // Initialize the Wise API service if needed
    await wiseApiService.initialize();
    
    // Get comparison data from Wise API
    const wiseProviders = await wiseApiService.getComparison(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    console.log(`[API /wise-compare] Received ${wiseProviders?.length || 0} providers from Wise API`);
    
    // Debug: Log delivery time and fee information
    if (wiseProviders && wiseProviders.length > 0) {
      wiseProviders.forEach(provider => {
        const firstQuote = provider.quotes && provider.quotes.length > 0 ? provider.quotes[0] : null;
        if (firstQuote) {
          console.log(`[API /wise-compare] Provider: ${provider.name || 'Unknown'}`);
          console.log(`[API /wise-compare] Fee: ${firstQuote.fee || 'N/A'}`);
          
          if (firstQuote.deliveryEstimation && firstQuote.deliveryEstimation.duration) {
            console.log(`[API /wise-compare] Delivery Time Min: ${firstQuote.deliveryEstimation.duration.min || 'N/A'}`);
            console.log(`[API /wise-compare] Delivery Time Max: ${firstQuote.deliveryEstimation.duration.max || 'N/A'}`);
          } else {
            console.log(`[API /wise-compare] No delivery time information available`);
          }
        }
      });
    }
    
    // Format providers for frontend
    const formattedProviders = wiseApiService.formatProvidersForFrontend(
      wiseProviders,
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    console.log(`[API /wise-compare] Formatted ${formattedProviders.length} providers for frontend`);
    
    // Debug: Log the formatted transfer times
    if (formattedProviders && formattedProviders.length > 0) {
      formattedProviders.forEach(provider => {
        console.log(`[API /wise-compare] Formatted Provider: ${provider.providerName}`);
        console.log(`[API /wise-compare] Formatted Transfer Time: ${provider.transferTime}`);
        console.log(`[API /wise-compare] Formatted Transfer Fee: ${provider.transferFee}`);
      });
    }
    
    res.json({
      success: true,
      count: formattedProviders.length,
      data: formattedProviders
    });

  } catch (error) {
    console.error('[API /wise-compare] Error fetching comparison from Wise API:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch comparison data from Wise API',
      error: error.message
    });
  }
});

module.exports = router; 