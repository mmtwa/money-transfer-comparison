const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { validationResult, check } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Define AdPartner schema if it doesn't already exist
let AdPartner;
try {
  AdPartner = mongoose.model('AdPartner');
} catch {
  const AdPartnerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true
    },
    contractStartDate: {
      type: Date,
      required: true
    },
    contractEndDate: {
      type: Date,
      required: true
    },
    paymentTerms: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually', 'cpc', 'cpa'],
      default: 'monthly'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending'
    },
    logo: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    adAssets: {
      desktop: [{
        url: String,
        width: Number,
        height: Number,
        format: String,
        fileSize: Number,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      mobile: [{
        url: String,
        width: Number,
        height: Number,
        format: String,
        fileSize: Number,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      tablet: [{
        url: String,
        width: Number,
        height: Number,
        format: String,
        fileSize: Number,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
    },
    campaigns: [{
      name: String,
      startDate: Date,
      endDate: Date,
      budget: Number,
      status: {
        type: String,
        enum: ['active', 'paused', 'completed'],
        default: 'active'
      },
      targetCountries: [String],
      targetCurrencies: [String],
      performance: {
        impressions: {
          type: Number,
          default: 0
        },
        clicks: {
          type: Number,
          default: 0
        },
        conversions: {
          type: Number,
          default: 0
        },
        spend: {
          type: Number,
          default: 0
        }
      }
    }],
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  AdPartnerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  AdPartner = mongoose.model('AdPartner', AdPartnerSchema);
}

/**
 * @route   GET /api/admin/ad-partners
 * @desc    Get all ad partners
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    // Filter by status if provided in query
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const adPartners = await AdPartner.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      count: adPartners.length,
      data: adPartners
    });
  } catch (error) {
    console.error('Error fetching ad partners:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch ad partners',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/ad-partners/:id
 * @desc    Get single ad partner by ID
 * @access  Admin
 */
router.get('/:id', async (req, res) => {
  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    res.json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error fetching ad partner:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch ad partner',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/ad-partners
 * @desc    Create a new ad partner
 * @access  Admin
 */
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('code', 'Code is required').not().isEmpty(),
  check('contactEmail', 'Valid contact email is required').isEmail(),
  check('contractStartDate', 'Contract start date is required').isISO8601(),
  check('contractEndDate', 'Contract end date is required').isISO8601(),
  check('logo', 'Logo URL is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newAdPartner = new AdPartner(req.body);
    await newAdPartner.save();
    
    res.status(201).json({
      success: true,
      data: newAdPartner
    });
  } catch (error) {
    console.error('Error creating ad partner:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ad partner with that name or code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Could not create ad partner',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/ad-partners/:id
 * @desc    Update an ad partner
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    let adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    // Update ad partner with new data
    Object.keys(req.body).forEach(key => {
      adPartner[key] = req.body[key];
    });
    
    await adPartner.save();
    
    res.json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error updating ad partner:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ad partner with that name or code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Could not update ad partner',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/ad-partners/:id
 * @desc    Delete an ad partner
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    await adPartner.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting ad partner:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete ad partner',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/ad-partners/:id/campaigns
 * @desc    Add a campaign to an ad partner
 * @access  Admin
 */
router.post('/:id/campaigns', [
  check('name', 'Campaign name is required').not().isEmpty(),
  check('startDate', 'Start date is required').isISO8601(),
  check('endDate', 'End date is required').isISO8601(),
  check('budget', 'Budget is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    adPartner.campaigns.push(req.body);
    await adPartner.save();
    
    res.status(201).json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error adding campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Could not add campaign',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/ad-partners/:id/campaigns/:campaignId
 * @desc    Update a campaign
 * @access  Admin
 */
router.put('/:id/campaigns/:campaignId', async (req, res) => {
  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    const campaignIndex = adPartner.campaigns.findIndex(
      campaign => campaign._id.toString() === req.params.campaignId
    );
    
    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Update campaign with new data
    Object.keys(req.body).forEach(key => {
      adPartner.campaigns[campaignIndex][key] = req.body[key];
    });
    
    await adPartner.save();
    
    res.json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update campaign',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/ad-partners/:id/campaigns/:campaignId
 * @desc    Delete a campaign
 * @access  Admin
 */
router.delete('/:id/campaigns/:campaignId', async (req, res) => {
  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    adPartner.campaigns = adPartner.campaigns.filter(
      campaign => campaign._id.toString() !== req.params.campaignId
    );
    
    await adPartner.save();
    
    res.json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete campaign',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   POST /api/admin/ad-partners/:id/assets/:type
 * @desc    Add ad assets for a specific device type (desktop, mobile, tablet)
 * @access  Admin
 */
router.post('/:id/assets/:type', [
  check('url', 'Asset URL is required').not().isEmpty(),
  check('width', 'Width is required').isNumeric(),
  check('height', 'Height is required').isNumeric(),
  check('format', 'Format is required').isIn(['jpg', 'png', 'gif', 'webp'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    const deviceType = req.params.type;
    if (!['desktop', 'mobile', 'tablet'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device type. Must be desktop, mobile, or tablet'
      });
    }
    
    if (!adPartner.adAssets) {
      adPartner.adAssets = { desktop: [], mobile: [], tablet: [] };
    }
    
    adPartner.adAssets[deviceType].push(req.body);
    await adPartner.save();
    
    res.status(201).json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error adding ad asset:', error);
    res.status(500).json({
      success: false,
      message: 'Could not add ad asset',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/ad-partners/:id/assets/:type/:assetId
 * @desc    Delete an ad asset
 * @access  Admin
 */
router.delete('/:id/assets/:type/:assetId', async (req, res) => {
  try {
    const adPartner = await AdPartner.findById(req.params.id);
    
    if (!adPartner) {
      return res.status(404).json({
        success: false,
        message: 'Ad partner not found'
      });
    }
    
    const deviceType = req.params.type;
    if (!['desktop', 'mobile', 'tablet'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device type. Must be desktop, mobile, or tablet'
      });
    }
    
    if (!adPartner.adAssets || !adPartner.adAssets[deviceType]) {
      return res.status(404).json({
        success: false,
        message: 'No assets found for this device type'
      });
    }
    
    adPartner.adAssets[deviceType] = adPartner.adAssets[deviceType].filter(
      asset => asset._id.toString() !== req.params.assetId
    );
    
    await adPartner.save();
    
    res.json({
      success: true,
      data: adPartner
    });
  } catch (error) {
    console.error('Error deleting ad asset:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete ad asset',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 