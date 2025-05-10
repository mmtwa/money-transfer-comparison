const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { validationResult, check } = require('express-validator');

// Get the AdPartner model
let AdPartner;
try {
  AdPartner = mongoose.model('AdPartner');
} catch (error) {
  console.error('AdPartner model not defined yet. This should be defined in adPartners.js');
  // Will be defined when adPartners.js route is loaded
}

/**
 * @route   GET /api/admin/campaigns
 * @desc    Get all campaigns across all ad partners
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    // Ensure AdPartner model is defined
    AdPartner = mongoose.model('AdPartner');
    
    // Get all ad partners
    const adPartners = await AdPartner.find();
    
    // Extract campaigns from all partners
    const campaigns = [];
    adPartners.forEach(partner => {
      if (partner.campaigns && partner.campaigns.length > 0) {
        partner.campaigns.forEach(campaign => {
          campaigns.push({
            id: campaign._id,
            name: campaign.name,
            partnerId: partner._id,
            partnerName: partner.name,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            budget: campaign.budget,
            status: campaign.status,
            targetCountries: campaign.targetCountries,
            targetCurrencies: campaign.targetCurrencies,
            performance: campaign.performance
          });
        });
      }
    });
    
    // Filter by status if provided in query
    let filteredCampaigns = campaigns;
    if (req.query.status) {
      filteredCampaigns = campaigns.filter(campaign => campaign.status === req.query.status);
    }
    
    // Sort by start date (newest first)
    filteredCampaigns.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    res.json({
      success: true,
      count: filteredCampaigns.length,
      data: filteredCampaigns
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch campaigns',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/campaigns/:id
 * @desc    Get a specific campaign by ID
 * @access  Admin
 */
router.get('/:id', async (req, res) => {
  try {
    // Ensure AdPartner model is defined
    AdPartner = mongoose.model('AdPartner');
    
    // Find the partner that contains the campaign
    const partner = await AdPartner.findOne({
      'campaigns._id': mongoose.Types.ObjectId(req.params.id)
    });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Find the campaign in the partner's campaigns array
    const campaign = partner.campaigns.find(
      c => c._id.toString() === req.params.id
    );
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Return campaign with partner info
    res.json({
      success: true,
      data: {
        id: campaign._id,
        name: campaign.name,
        partnerId: partner._id,
        partnerName: partner.name,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        budget: campaign.budget,
        status: campaign.status,
        targetCountries: campaign.targetCountries,
        targetCurrencies: campaign.targetCurrencies,
        performance: campaign.performance
      }
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch campaign',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/campaigns/:id
 * @desc    Update a campaign
 * @access  Admin
 */
router.put('/:id', [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('startDate', 'Start date must be valid').optional().isISO8601(),
  check('endDate', 'End date must be valid').optional().isISO8601(),
  check('budget', 'Budget must be a number').optional().isNumeric(),
  check('status', 'Status must be valid').optional().isIn(['active', 'paused', 'completed'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Ensure AdPartner model is defined
    AdPartner = mongoose.model('AdPartner');
    
    // Find the partner that contains the campaign
    const partner = await AdPartner.findOne({
      'campaigns._id': mongoose.Types.ObjectId(req.params.id)
    });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Find the campaign index in the partner's campaigns array
    const campaignIndex = partner.campaigns.findIndex(
      c => c._id.toString() === req.params.id
    );
    
    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Update campaign fields
    Object.keys(req.body).forEach(key => {
      partner.campaigns[campaignIndex][key] = req.body[key];
    });
    
    await partner.save();
    
    // Return updated campaign
    res.json({
      success: true,
      data: {
        id: partner.campaigns[campaignIndex]._id,
        name: partner.campaigns[campaignIndex].name,
        partnerId: partner._id,
        partnerName: partner.name,
        startDate: partner.campaigns[campaignIndex].startDate,
        endDate: partner.campaigns[campaignIndex].endDate,
        budget: partner.campaigns[campaignIndex].budget,
        status: partner.campaigns[campaignIndex].status,
        targetCountries: partner.campaigns[campaignIndex].targetCountries,
        targetCurrencies: partner.campaigns[campaignIndex].targetCurrencies,
        performance: partner.campaigns[campaignIndex].performance
      }
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
 * @route   POST /api/admin/campaigns/:id/performance
 * @desc    Update campaign performance metrics
 * @access  Admin
 */
router.post('/:id/performance', [
  check('impressions', 'Impressions must be a number').optional().isNumeric(),
  check('clicks', 'Clicks must be a number').optional().isNumeric(),
  check('conversions', 'Conversions must be a number').optional().isNumeric(),
  check('spend', 'Spend must be a number').optional().isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Ensure AdPartner model is defined
    AdPartner = mongoose.model('AdPartner');
    
    // Find the partner that contains the campaign
    const partner = await AdPartner.findOne({
      'campaigns._id': mongoose.Types.ObjectId(req.params.id)
    });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Find the campaign index in the partner's campaigns array
    const campaignIndex = partner.campaigns.findIndex(
      c => c._id.toString() === req.params.id
    );
    
    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Ensure performance object exists
    if (!partner.campaigns[campaignIndex].performance) {
      partner.campaigns[campaignIndex].performance = {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0
      };
    }
    
    // Update performance metrics
    if (req.body.impressions !== undefined) {
      partner.campaigns[campaignIndex].performance.impressions = req.body.impressions;
    }
    
    if (req.body.clicks !== undefined) {
      partner.campaigns[campaignIndex].performance.clicks = req.body.clicks;
    }
    
    if (req.body.conversions !== undefined) {
      partner.campaigns[campaignIndex].performance.conversions = req.body.conversions;
    }
    
    if (req.body.spend !== undefined) {
      partner.campaigns[campaignIndex].performance.spend = req.body.spend;
    }
    
    await partner.save();
    
    // Return updated campaign
    res.json({
      success: true,
      data: {
        id: partner.campaigns[campaignIndex]._id,
        name: partner.campaigns[campaignIndex].name,
        partnerId: partner._id,
        partnerName: partner.name,
        performance: partner.campaigns[campaignIndex].performance
      }
    });
  } catch (error) {
    console.error('Error updating campaign performance:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update campaign performance',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 