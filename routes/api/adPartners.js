const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { cacheApiResponse } = require('../../middleware/apiMiddleware');

// Use AdPartner model if it exists, or create it
let AdPartner;
try {
  AdPartner = mongoose.model('AdPartner');
} catch {
  // This will be defined in routes/admin/adPartners.js
  console.log('AdPartner model not found. Routes may not work until the model is defined.');
}

/**
 * @route   GET /api/ad-partners/active
 * @desc    Get all active ad partners
 * @access  Public
 */
router.get('/active', cacheApiResponse(1800), async (req, res) => {
  try {
    if (!AdPartner) {
      return res.status(500).json({
        success: false,
        message: 'AdPartner model not initialized'
      });
    }

    // Get active partners
    const activePartners = await AdPartner.find({ status: 'active' });
    
    // Format response to match config format expected by frontend
    const formattedPartners = {};
    
    // Add default partner as fallback
    formattedPartners.default = {
      name: 'Default Campaign',
      active: true,
      priority: 0,
      assets: {
        mobile: {
          src: '/mobile-ad.jpg',
          width: 640,
          height: 1200
        },
        tablet: {
          src: '/tablet-ad.jpg',
          width: 1024,
          height: 1200
        },
        desktop: {
          src: '/desktop-ad.jpg',
          width: 1920,
          height: 1080
        }
      },
      metadata: {
        altText: 'Money Transfer Services',
        trackingId: 'default-campaign'
      }
    };
    
    // Add each active partner
    activePartners.forEach(partner => {
      formattedPartners[partner.code] = {
        name: partner.name,
        active: partner.status === 'active',
        priority: 10, // Default priority
        assets: {
          mobile: {
            src: partner.logo.replace('desktop', 'mobile'),
            width: 640,
            height: 1200
          },
          tablet: {
            src: partner.logo.replace('desktop', 'tablet'),
            width: 1024,
            height: 1200
          },
          desktop: {
            src: partner.logo,
            width: 1920,
            height: 1080
          }
        },
        metadata: {
          altText: `${partner.name} Advertisement`,
          trackingId: `${partner.code}-${new Date().getFullYear()}`
        }
      };
    });
    
    res.json({
      success: true,
      data: formattedPartners
    });
  } catch (error) {
    console.error('Error fetching active ad partners:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch active ad partners',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 