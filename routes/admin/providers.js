const express = require('express');
const router = express.Router();
const Provider = require('../../models/Provider');
const { validationResult, check } = require('express-validator');
const axios = require('axios');

/**
 * @route   GET /api/admin/providers
 * @desc    Get all providers (including inactive)
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ name: 1 });
    
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
 * @route   GET /api/admin/providers/:id
 * @desc    Get single provider by ID with sensitive data
 * @access  Admin
 */
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).select('+apiKey +apiSecret');
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/providers
 * @desc    Create a new provider
 * @access  Admin
 */
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('code', 'Code is required').not().isEmpty(),
  check('logo', 'Logo URL is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('baseUrl', 'Base URL is required').not().isEmpty(),
  check('apiKey', 'API key is required').not().isEmpty(),
  check('exchangeRateMargin', 'Exchange rate margin is required').isNumeric(),
  check('transferTimeHours.min', 'Minimum transfer time is required').isNumeric(),
  check('transferTimeHours.max', 'Maximum transfer time is required').isNumeric(),
  check('supportedCurrencies', 'Supported currencies are required').isArray(),
  check('methods', 'Payment methods are required').isArray()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newProvider = new Provider(req.body);
    await newProvider.save();
    
    res.status(201).json({
      success: true,
      data: newProvider
    });
  } catch (error) {
    console.error('Error creating provider:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Provider with that name or code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Could not create provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/providers/:id
 * @desc    Update a provider
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    // Update provider with new data
    Object.keys(req.body).forEach(key => {
      provider[key] = req.body[key];
    });
    
    await provider.save();
    
    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/providers/:id
 * @desc    Delete a provider
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    await provider.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting provider:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/providers/:id/toggle-status
 * @desc    Toggle provider active status
 * @access  Admin
 */
router.post('/:id/toggle-status', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    provider.active = !provider.active;
    await provider.save();
    
    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Error toggling provider status:', error);
    res.status(500).json({
      success: false,
      message: 'Could not toggle provider status',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/providers/:id/test-api
 * @desc    Test provider API connection
 * @access  Admin
 */
router.post('/:id/test-api', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).select('+apiKey +apiSecret');
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    // Basic test - try to connect to the API
    // In a real implementation, you'd use the provider's specific API handler
    try {
      const response = await axios.get(`${provider.baseUrl}`, {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`
        },
        timeout: 5000
      });
      
      provider.apiLastTested = Date.now();
      await provider.save();
      
      res.json({
        success: true,
        message: 'API connection successful',
        status: response.status
      });
    } catch (apiError) {
      res.status(400).json({
        success: false,
        message: 'API connection failed',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('Error testing provider API:', error);
    res.status(500).json({
      success: false,
      message: 'Could not test provider API',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 