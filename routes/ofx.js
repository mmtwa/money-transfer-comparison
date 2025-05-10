const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const providerService = require('../services/providerService');
const ofxApiService = require('../services/ofxApiService');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { cacheApiResponse, createRateLimiter } = require('../middleware/apiMiddleware');
const wiseApiService = require('../services/wiseApiService');

// Apply rate limiting to all routes
const ratesLimiter = createRateLimiter(200, 15 * 60 * 1000); // 200 requests per 15 minutes
router.use(ratesLimiter);

/**
 * @route   GET /api/ofx/compare
 * @desc    Get comparison of exchange rates from all providers
 * @access  Public
 */
router.get('/compare', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(300), async (req, res) => {
  console.log('==== OFX COMPARE ENDPOINT CALLED ====');
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
    console.log(`[OFX Compare] Requesting rates for ${fromCurrency} to ${toCurrency}, amount: ${amount}`);
    
    // Ensure providerService is initialized
    if (!await providerService.isInitialized()) {
      console.log('[OFX Compare] Initializing provider service...');
      try {
        await providerService.initialize();
      } catch (initError) {
        console.error('[OFX Compare] Provider service initialization error:', initError);
        // Continue even if initialization fails
      }
    }
    
    // If DB connection has issues, make sure we have the standard providers
    const providerKeys = Object.keys(providerService.providers);
    console.log('[OFX Compare] Available providers:', providerKeys);
    
    if (providerKeys.length < 2) {
      console.log('[OFX Compare] Adding standard providers directly...');
      
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
      
      console.log('[OFX Compare] Providers after adding:', Object.keys(providerService.providers));
    }
    
    console.log('[OFX Compare] Getting exchange rates...');
    let results = [];
    
    try {
      // Force a fresh fetch from the API instead of using cached data
      await providerService.clearCache(fromCurrency.toUpperCase(), toCurrency.toUpperCase());
      
      // Also clear the API middleware cache directly
      const { clearApiCache } = require('../middleware/apiMiddleware');
      clearApiCache(`ofx/compare?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`);
      
      const rawResults = await providerService.getExchangeRates(
        fromCurrency.toUpperCase(),
        toCurrency.toUpperCase(),
        parseFloat(amount)
      );
      
      if (rawResults && rawResults.length > 0) {
        console.log(`[OFX Compare] Successfully received ${rawResults.length} provider results`);
        
        // Transform the results to match the frontend expected format
        results = rawResults.map(result => {
          // Calculate base rate by adding the provider's margin
          const effectiveRate = result.rate;
          const baseRate = effectiveRate * (1 + (result.provider.exchangeRateMargin || 0.005));
          const marginCost = parseFloat(amount) * (baseRate - effectiveRate);
          
          // Update logo path for OFX specifically
          let logoPath = result.provider.logo;
          if (result.provider.name === 'OFX' && !logoPath.includes('OFX_Logo.webp')) {
            logoPath = '/images/providers/OFX_Logo.webp';
          }
          
          // Fix OFX delivery time and transfer time hours if needed
          let deliveryTime = result.deliveryTime;
          let transferTimeHours = result.provider.transferTimeHours;
          
          if (result.provider.name === 'OFX') {
            // Set specific delivery times for OFX by currency pair
            const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD'];
            
            if (majorCurrencies.includes(fromCurrency.toUpperCase()) && 
                majorCurrencies.includes(toCurrency.toUpperCase())) {
              deliveryTime = '1-2 business days';
              transferTimeHours = { min: 24, max: 48 };
            } else {
              deliveryTime = '2-3 business days';
              transferTimeHours = { min: 48, max: 72 };
            }
            
            console.log(`[OFX Compare] Setting OFX delivery time to: ${deliveryTime}`);
          }
          
          return {
            providerId: result.provider.id,
            providerCode: result.provider.name.toLowerCase().replace(/\s+/g, ''),
            providerName: result.provider.name,
            providerLogo: logoPath,
            baseRate: baseRate,
            effectiveRate: effectiveRate,
            transferFee: result.transferFee,
            marginPercentage: (result.provider.exchangeRateMargin || 0.005) * 100,
            marginCost: marginCost,
            totalCost: result.totalCost,
            amountReceived: result.amountReceived,
            transferTimeHours: transferTimeHours,
            transferTime: deliveryTime,
            rating: result.provider.rating,
            methods: result.methods,
            realTimeApi: true,
            timestamp: new Date().toISOString()
          };
        });
        
        console.log(`[OFX Compare] Transformed ${results.length} provider results for frontend`);
        
      } else {
        console.warn('[OFX Compare] No results returned from providerService, will try direct Wise API fetch');
        
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
            console.log(`[OFX Compare] Successfully fetched Wise rate data: rate=${wiseRateData.rate}, fee=${wiseRateData.fee}`);
            
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
            
            console.log(`[OFX Compare] Using delivery time: ${deliveryTime}`);
            
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
          console.error('[OFX Compare] Direct Wise API fetch failed:', wiseError);
          throw new Error(`Could not fetch exchange rates: ${wiseError.message}`);
        }
      }
    } catch (ratesError) {
      console.error('[OFX Compare] Error fetching exchange rates from providers:', ratesError);
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
        console.error('[OFX Compare] Error saving to user history:', saveError.message);
      }
    }
    
    console.log('[OFX Compare] Sending response with', results.length, 'results');
    res.json({
      success: true,
      count: results.length,
      data: results
    });
    console.log('[OFX Compare] Response sent successfully');
    
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
 * GET /api/ofx/historical
 * @desc Get historical exchange rates
 * @access Public
 */
router.get('/historical', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 })
], async (req, res) => {
  console.log('==== HISTORICAL RATES ENDPOINT CALLED ====');
  
  // Handle historical rates logic
  await handleHistoricalRates(req, res);
});

/**
 * Handle historical rates request
 */
const handleHistoricalRates = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency } = req.query;
  
  try {
    // Get historical rates from the provider service
    const historicalRates = await providerService.getHistoricalRates(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase()
    );
    
    if (!historicalRates || historicalRates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No historical rate data found'
      });
    }
    
    res.json({
      success: true,
      count: historicalRates.length,
      data: historicalRates
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
 * @route   GET /api/ofx/provider/:providerId
 * @desc    Get exchange rates from a specific provider
 * @access  Public
 */
router.get('/provider/:providerId', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(60), async (req, res) => {
  console.log('==== PROVIDER RATES ENDPOINT CALLED ====');
  console.log('Request params:', req.params);
  console.log('Request query:', req.query);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { providerId } = req.params;
  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    // Ensure provider service is initialized
    if (!await providerService.isInitialized()) {
      await providerService.initialize();
    }
    
    // Get the specific provider
    const provider = providerService.providers[providerId.toLowerCase()];
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider "${providerId}" not found`
      });
    }
    
    // Get rate from the specific provider
    const result = await providerService.getExchangeRateFromProvider(
      provider,
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Could not get rate from provider "${provider.name}"`
      });
    }
    
    // Format the result
    const effectiveRate = result.rate;
    const baseRate = effectiveRate * (1 + (provider.exchangeRateMargin || 0.005));
    const marginCost = parseFloat(amount) * (baseRate - effectiveRate);
    
    // Update logo path for OFX specifically
    let logoPath = provider.logo;
    if (provider.name === 'OFX' && !logoPath.includes('OFX_Logo.webp')) {
      logoPath = '/images/providers/OFX_Logo.webp';
    }
    
    // Fix OFX delivery time if needed
    let deliveryTime = result.deliveryTime;
    let transferTimeHours = provider.transferTimeHours;
    
    if (provider.name === 'OFX') {
      const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD'];
      
      if (majorCurrencies.includes(fromCurrency.toUpperCase()) && 
          majorCurrencies.includes(toCurrency.toUpperCase())) {
        deliveryTime = '1-2 business days';
        transferTimeHours = { min: 24, max: 48 };
      } else {
        deliveryTime = '2-3 business days';
        transferTimeHours = { min: 48, max: 72 };
      }
    }
    
    const response = {
      providerId: provider.id,
      providerCode: provider.name.toLowerCase().replace(/\s+/g, ''),
      providerName: provider.name,
      providerLogo: logoPath,
      baseRate: baseRate,
      effectiveRate: effectiveRate,
      transferFee: result.transferFee,
      marginPercentage: (provider.exchangeRateMargin || 0.005) * 100,
      marginCost: marginCost,
      totalCost: result.totalCost,
      amountReceived: result.amountReceived,
      transferTimeHours: transferTimeHours,
      transferTime: deliveryTime,
      rating: provider.rating,
      methods: result.methods || provider.methods,
      realTimeApi: true,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: response
    });
    
  } catch (error) {
    console.error(`Error fetching rates from provider ${providerId}:`, error);
    res.status(500).json({
      success: false,
      message: `Could not fetch rates from provider "${providerId}"`,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ofx/providers
 * @desc    Get all available providers
 * @access  Public
 */
router.get('/providers', cacheApiResponse(3600), async (req, res) => {
  console.log('==== PROVIDERS LIST ENDPOINT CALLED ====');
  
  try {
    // Ensure provider service is initialized
    if (!await providerService.isInitialized()) {
      await providerService.initialize();
    }
    
    // Get all providers
    const providers = Object.values(providerService.providers).map(provider => ({
      id: provider.id,
      name: provider.name,
      logo: provider.logo,
      rating: provider.rating,
      methods: provider.methods,
      transferTimeHours: provider.transferTimeHours,
      apiEnabled: provider.apiEnabled
    }));
    
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
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ofx/direct-rate
 * @desc    Get exchange rate directly from OFX API
 * @access  Public
 */
router.get('/direct-rate', [
  check('fromCurrency', 'From currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('toCurrency', 'To currency is required').notEmpty().isLength({ min: 3, max: 3 }),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 })
], cacheApiResponse(120), async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fromCurrency, toCurrency, amount } = req.query;
  
  try {
    console.log(`[OFX Direct] Getting direct rate for ${fromCurrency} to ${toCurrency}, amount ${amount}`);
    
    // Clear cache to ensure fresh rate
    ofxApiService.clearCache(`ofx_rate_${fromCurrency}_${toCurrency}_${amount}`);
    
    // Get rate directly from OFX API
    const rateInfo = await ofxApiService.getExchangeRate(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    if (!rateInfo || !rateInfo.rate) {
      throw new Error('Failed to get rate from OFX API');
    }
    
    // Format response
    const response = {
      success: true,
      provider: 'OFX',
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      amount: parseFloat(amount),
      rate: rateInfo.rate,
      fee: rateInfo.fee || 0,
      amountReceived: rateInfo.targetAmount,
      deliveryTime: rateInfo.deliveryTime,
      timestamp: new Date().toISOString()
    };
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('[OFX Direct] Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: `Failed to get exchange rate from OFX: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/ofx/test-connection
 * @desc    Test the OFX API connection
 * @access  Private (Admin only)
 */
router.get('/test-connection', auth, async (req, res) => {
  try {
    // Check if user has admin role
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin role required'
      });
    }
    
    console.log('[OFX Test] Testing OFX API connection');
    
    // Test the API connection
    const testResult = await ofxApiService.testApiCredentials();
    
    return res.status(testResult.success ? 200 : 400).json({
      success: testResult.success,
      message: testResult.message,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[OFX Test] Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: `Failed to test OFX API connection: ${error.message}`
    });
  }
});

module.exports = router; 