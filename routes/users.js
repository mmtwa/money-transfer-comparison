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
