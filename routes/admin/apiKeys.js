const express = require('express');
const router = express.Router();
const Provider = require('../../models/Provider');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const apiKeyManager = require('../../utils/apiKeyManager');
const { clearApiCache } = require('../../middleware/apiMiddleware');

// Apply auth and admin middleware to all routes
router.use([auth, admin]);

/**
 * @route   GET /api/admin/apikeys
 * @desc    Get all provider API keys
 * @access  Private/Admin
 */
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find()
      .select('+apiKey +apiSecret')
      .exec();
    
    // Map providers to only include necessary information
    const providerApiInfo = providers.map(provider => ({
      id: provider._id,
      name: provider.name,
      code: provider.code,
      apiEnabled: provider.apiEnabled,
      apiHandler: provider.apiHandler,
      apiKey: provider.apiKey ? '********' : null,
      apiSecret: provider.apiSecret ? '********' : null,
      apiLastTested: provider.apiLastTested,
      apiCredentialsExpiry: provider.apiCredentialsExpiry,
      apiUsage: provider.apiUsage,
      apiQuota: provider.apiQuota
    }));
    
    res.json({
      success: true,
      count: providerApiInfo.length,
      data: providerApiInfo
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch API keys',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/apikeys/:provider
 * @desc    Get API key for a specific provider
 * @access  Private/Admin
 */
router.get('/:provider', async (req, res) => {
  try {
    const provider = await Provider.findOne({ code: req.params.provider })
      .select('+apiKey +apiSecret')
      .exec();
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider ${req.params.provider} not found`
      });
    }
    
    res.json({
      success: true,
      data: {
        id: provider._id,
        name: provider.name,
        code: provider.code,
        apiEnabled: provider.apiEnabled,
        apiHandler: provider.apiHandler,
        apiKey: provider.apiKey || null,
        apiSecret: provider.apiSecret || null,
        apiLastTested: provider.apiLastTested,
        apiCredentialsExpiry: provider.apiCredentialsExpiry,
        apiUsage: provider.apiUsage,
        apiQuota: provider.apiQuota
      }
    });
  } catch (error) {
    console.error(`Error fetching API key for ${req.params.provider}:`, error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch API key',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/apikeys/:provider
 * @desc    Update API key for a provider
 * @access  Private/Admin
 */
router.put('/:provider', async (req, res) => {
  try {
    const { apiKey, apiSecret, apiEnabled, apiQuota } = req.body;
    
    // Find the provider
    const provider = await Provider.findOne({ code: req.params.provider });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider ${req.params.provider} not found`
      });
    }
    
    // Update provider details
    if (apiKey !== undefined) {
      provider.apiKey = apiKey;
    }
    
    if (apiSecret !== undefined) {
      provider.apiSecret = apiSecret;
    }
    
    if (apiEnabled !== undefined) {
      provider.apiEnabled = apiEnabled;
    }
    
    if (apiQuota) {
      if (apiQuota.daily) {
        provider.apiQuota.daily = apiQuota.daily;
      }
      
      if (apiQuota.monthly) {
        provider.apiQuota.monthly = apiQuota.monthly;
      }
    }
    
    // Update last tested date
    provider.apiLastTested = new Date();
    
    await provider.save();
    
    // Clear cache for updated provider
    clearApiCache(`rates:*`);
    
    res.json({
      success: true,
      message: `API details for ${provider.name} updated successfully`,
      data: {
        id: provider._id,
        name: provider.name,
        code: provider.code,
        apiEnabled: provider.apiEnabled,
        apiLastTested: provider.apiLastTested
      }
    });
  } catch (error) {
    console.error(`Error updating API key for ${req.params.provider}:`, error);
    res.status(500).json({
      success: false,
      message: 'Could not update API key',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/apikeys/:provider/test
 * @desc    Test API key for a provider
 * @access  Private/Admin
 */
router.post('/:provider/test', async (req, res) => {
  try {
    const provider = await Provider.findOne({ code: req.params.provider })
      .select('+apiKey +apiSecret')
      .exec();
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider ${req.params.provider} not found`
      });
    }
    
    if (!provider.apiKey) {
      return res.status(400).json({
        success: false,
        message: 'No API key configured for this provider'
      });
    }
    
    // Test the API key based on provider type
    let testResult;
    
    switch (provider.apiHandler.toLowerCase()) {
      case 'wise':
      case 'transferwise':
        const wiseApiService = require('../../services/wiseApiService');
        testResult = await wiseApiService.testApiCredentials();
        break;
        
      // Add other provider test implementations here
        
      default:
        return res.status(400).json({
          success: false,
          message: `No test implementation for provider type ${provider.apiHandler}`
        });
    }
    
    // Update the last tested date
    provider.apiLastTested = new Date();
    await provider.save();
    
    res.json({
      success: true,
      message: `API credentials for ${provider.name} tested successfully`,
      data: testResult
    });
  } catch (error) {
    console.error(`Error testing API key for ${req.params.provider}:`, error);
    res.status(500).json({
      success: false,
      message: 'API test failed',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/apikeys/:provider/reset-usage
 * @desc    Reset API usage counters for a provider
 * @access  Private/Admin
 */
router.post('/:provider/reset-usage', async (req, res) => {
  try {
    const provider = await Provider.findOne({ code: req.params.provider });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider ${req.params.provider} not found`
      });
    }
    
    // Reset usage counters
    provider.apiUsage = {
      today: 0,
      thisMonth: 0,
      lastReset: new Date()
    };
    
    await provider.save();
    
    res.json({
      success: true,
      message: `API usage counters for ${provider.name} reset successfully`
    });
  } catch (error) {
    console.error(`Error resetting API usage for ${req.params.provider}:`, error);
    res.status(500).json({
      success: false,
      message: 'Could not reset API usage',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router;