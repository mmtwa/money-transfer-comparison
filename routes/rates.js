const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const providerService = require('../services/providerService');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');
const wiseApiService = require('../services/wiseApiService');

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
  console.log('==== RATES COMPARE ENDPOINT CALLED ====');
  console.log('Request query params:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  console.log(`Processing request for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
  
  try {
    console.log(`[Rates Compare] Requesting rates for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
    
    // Ensure providerService is initialized
    if (!await providerService.isInitialized()) {
      console.log('[Rates Compare] Initializing provider service...');
      try {
        await providerService.initialize();
      } catch (initError) {
        console.error('[Rates Compare] Provider service initialization error:', initError);
        // Continue even if initialization fails
      }
    }
    
    // If DB connection has issues, make sure we have the standard providers
    const providerKeys = Object.keys(providerService.providers);
    console.log('[Rates Compare] Available providers:', providerKeys);
    
    if (providerKeys.length < 2) {
      console.log('[Rates Compare] Adding standard providers directly...');
      
      // Add XE provider if not exists
      if (!providerService.providers['xe']) {
        providerService.providers['xe'] = {
          id: 'xe-test-id',
          name: 'XE',
          logo: '/images/providers/xe.png',
          apiKey: 'test-key',
          baseUrl: 'https://api.xe.com',
          transferFeeStructure: { type: 'flat', amount: 3.5 },
          exchangeRateMargin: 0.02,
          transferTimeHours: { min: 24, max: 48 },
          rating: 4.2,
          methods: ['bank_transfer'],
          apiEnabled: true,
          apiHandler: 'xe'
        };
      }
      
      // Add Western Union provider if not exists
      if (!providerService.providers['westernunion']) {
        providerService.providers['westernunion'] = {
          id: 'wu-test-id',
          name: 'Western Union',
          logo: '/images/providers/westernunion.png',
          apiKey: 'test-key',
          baseUrl: 'https://api.westernunion.com',
          transferFeeStructure: { type: 'percentage', percentage: 1, minimum: 5, maximum: 25 },
          exchangeRateMargin: 0.03,
          transferTimeHours: { min: 0, max: 1 },
          rating: 3.9,
          methods: ['bank_transfer', 'cash_pickup'],
          apiEnabled: true,
          apiHandler: 'westernunion'
        };
      }
      
      // Add Wise provider if not exists
      if (!providerService.providers['wise']) {
        providerService.providers['wise'] = {
          id: 'wise-test-id',
          name: 'Wise',
          logo: '/images/providers/wise.png',
          apiKey: process.env.WISE_CLIENT_ID || 'test-key',
          apiSecret: process.env.WISE_CLIENT_SECRET || 'test-secret',
          baseUrl: 'https://api.wise.com',
          transferFeeStructure: { type: 'percentage', percentage: 0.5, minimum: 2, maximum: 15 },
          exchangeRateMargin: 0.005,
          transferTimeHours: { min: 1, max: 24 },
          rating: 4.8,
          methods: ['bank_transfer', 'debit_card'],
          apiEnabled: true,
          apiHandler: 'wise'
        };
      }
      
      console.log('[Rates Compare] Providers after adding:', Object.keys(providerService.providers));
    }
    
    console.log('[Rates Compare] Getting exchange rates...');
    let results = [];
    
    try {
      // Force a fresh fetch from the API instead of using cached data
      await providerService.clearCache(fromCurrency.toUpperCase(), toCurrency.toUpperCase());
      
      results = await providerService.getExchangeRates(
        fromCurrency.toUpperCase(),
        toCurrency.toUpperCase(),
        parseFloat(amount)
      );
      
      if (results && results.length > 0) {
        console.log(`[Rates Compare] Successfully received ${results.length} provider results`);
      } else {
        console.warn('[Rates Compare] No results returned from providerService, will try direct Wise API fetch');
        
        // Try direct fetch from Wise API
        try {
          const wiseApiService = require('../services/wiseApiService');
          
          // Get both exchange rate and fee from the same API call
          const wiseRateData = await wiseApiService.getExchangeRate(
            fromCurrency.toUpperCase(),
            toCurrency.toUpperCase(),
            parseFloat(amount)
          );
          
          if (wiseRateData && wiseRateData.rate) {
            console.log(`[Rates Compare] Successfully fetched Wise rate data: rate=${wiseRateData.rate}, fee=${wiseRateData.fee}`);
            
            // Create a Wise result with the real rate and fee from the API
            const effectiveRate = wiseRateData.rate;
            const baseRate = effectiveRate * 1.005; // Add 0.5% margin
            const transferFee = wiseRateData.fee || 0; // Use the fee from the API or default to 0
            const marginCost = parseFloat(amount) * (baseRate - effectiveRate);
            
            // Get targetAmount from API or calculate
            const targetAmount = wiseRateData.targetAmount || (parseFloat(amount) * effectiveRate);
            
            // Based on our testing, the targetAmount from Wise API already accounts for the exchange rate
            // but does not subtract the fee. The fee is a separate value in source currency.
            const amountReceived = targetAmount;
            
            // Get the delivery time from the API response
            let deliveryTime = '1-24 hours'; // Default fallback
            if (wiseRateData.deliveryTime) {
              deliveryTime = wiseRateData.deliveryTime;
            } else if (wiseRateData.estimatedDelivery) {
              deliveryTime = wiseRateData.estimatedDelivery;
            }
            
            console.log(`[Rates Compare] Using delivery time: ${deliveryTime}`);
            
            results = [{
              providerId: 'wise-direct-id',
              providerCode: 'wise',
              providerName: 'Wise',
              providerLogo: '/images/providers/wise.png',
              baseRate: baseRate,
              effectiveRate: effectiveRate,
              transferFee: transferFee,
              marginPercentage: 0.5,
              marginCost: marginCost,
              totalCost: transferFee + marginCost,
              amountReceived: amountReceived,
              transferTimeHours: { min: 1, max: 24 },
              transferTime: deliveryTime,
              rating: 4.8,
              methods: ['bank_transfer', 'debit_card'],
              realTimeApi: true,
              timestamp: new Date().toISOString()
            }];
          } else {
            throw new Error('Could not get rate data from Wise API');
          }
        } catch (wiseError) {
          console.error('[Rates Compare] Direct Wise API fetch failed:', wiseError);
          throw new Error(`Could not fetch exchange rates: ${wiseError.message}`);
        }
      }
    } catch (ratesError) {
      console.error('[Rates Compare] Error fetching exchange rates from providers:', ratesError);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch exchange rates',
        error: ratesError.message
      });
    }
    
    // Save the comparison to user's history if authenticated
    if (req.user) {
      try {
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
      } catch (saveError) {
        console.error('[Rates Compare] Error saving to user history:', saveError.message);
      }
    }
    
    console.log('[Rates Compare] Sending response with', results.length, 'results');
    res.json({
      success: true,
      count: results.length,
      data: results
    });
    console.log('[Rates Compare] Response sent successfully');
    
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch exchange rates',
      error: error.message
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
  check('from', 'From date must be a valid ISO date string').optional(),
  check('to', 'To date must be a valid ISO date string').optional(),
  check('group', 'Group must be a valid interval (day, hour, etc.)').optional()
], cacheApiResponse(3600), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, from, to, group } = req.query;
  
  try {
    // Get historical rates from Wise API
    const historicalData = await wiseApiService.getHistoricalRates(
      fromCurrency.toUpperCase(), 
      toCurrency.toUpperCase(),
      from, 
      to,
      group || 'day'
    );
    
    return res.json({
      success: true,
      data: historicalData,
      sourceCurrency: fromCurrency.toUpperCase(),
      targetCurrency: toCurrency.toUpperCase(),
      fromDate: from,
      toDate: to,
      group: group || 'day'
    });
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch historical exchange rates',
      error: error.message
    });
  }
});

/**
 * Handle the /v1/rates endpoint for historical rates
 * This endpoint is compatible with the frontend historical rates page
 */
const handleHistoricalRates = async (req, res) => {
  try {
    const { source, target, from, to, group } = req.query;
    
    // Validate required parameters
    if (!source || !target) {
      return res.status(400).json({
        success: false,
        message: 'Source and target currencies are required'
      });
    }
    
    // Ensure 'to' date is not in the future
    let adjustedTo = to;
    if (to) {
      const toDate = new Date(to);
      const currentDate = new Date();
      
      if (toDate > currentDate) {
        console.log(`Adjusting future date ${to} to current date`);
        adjustedTo = currentDate.toISOString();
      }
    }
    
    // Get historical rates from Wise API
    const historicalData = await wiseApiService.getHistoricalRates(
      source.toUpperCase(), 
      target.toUpperCase(),
      from, 
      adjustedTo,
      group || 'day'
    );
    
    // Wrap the data in the format expected by the frontend
    return res.json({
      success: true, 
      data: historicalData
    });
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch historical exchange rates',
      error: error.message
    });
  }
};

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
      error: error.message
    });
  }
});

/**
 * @route   GET /api/rates/test
 * @desc    Simple test endpoint to verify API connectivity
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API connection successful',
    timestamp: new Date().toISOString()
  });
});

router.get('/historical', handleHistoricalRates);

// Add the handler method to the router exports
router.handle = handleHistoricalRates;

module.exports = router;