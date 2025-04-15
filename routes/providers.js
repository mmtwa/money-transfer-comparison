const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const providerService = require('../services/providerService');

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
