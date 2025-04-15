// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   GET /api/users/history
 * @desc    Get user's comparison history
 * @access  Private
 */
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      count: user.savedComparisons.length,
      data: user.savedComparisons
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch history',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/users/history/:id
 * @desc    Delete a comparison from history
 * @access  Private
 */
router.delete('/history/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Pull the comparison from the array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        savedComparisons: {
          _id: req.params.id
        }
      }
    });
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting comparison:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete comparison',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', [auth, admin], async (req, res) => {
  try {
    const users = await User.find();
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch users',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router;
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      data: provider
    });
    
    // Reinitialize the provider service to update the provider info
    await providerService.initialize();
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(400).json({
      success: false,
      message: 'Could not update provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/providers/:id
 * @desc    Delete provider
 * @access  Private/Admin
 */
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: provider._id,
        name: provider.name,
        code: provider.code,
        logo: provider.logo,
        description: provider.description,
        methods: provider.methods,
        transferTimeHours: provider.transferTimeHours,
        rating: provider.rating,
        supportedCurrencies: provider.supportedCurrencies
      }
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
 * @route   POST /api/providers
 * @desc    Create new provider
 * @access  Private/Admin
 */
router.post('/', [auth, admin], async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    
    res.status(201).json({
      success: true,
      data: provider
    });
    
    // Reinitialize the provider service to include the new provider
    await providerService.initialize();
  } catch (error) {
    console.error('Error creating provider:', error);
    res.status(400).json({
      success: false,
      message: 'Could not create provider',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/providers/:id
 * @desc    Update provider
 * @access  Private/Admin
 */
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!provider) {
      return res.status(404).json({