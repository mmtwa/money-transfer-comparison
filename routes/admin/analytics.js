const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route   GET /api/admin/analytics/content
 * @desc    Get analytics for all content items
 * @access  Admin
 */
router.get('/content', async (req, res) => {
  try {
    // Get Content model if it exists
    let Content;
    try {
      Content = mongoose.model('Content');
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Content model not defined yet'
      });
    }
    
    // Get content analytics grouped by type
    const analytics = {
      guides: [],
      faqs: [],
      pages: []
    };
    
    // Get all content items
    const contentItems = await Content.find().sort({ 'analytics.views': -1 });
    
    // Group by type and extract analytics
    contentItems.forEach(item => {
      const contentAnalytics = {
        id: item._id,
        title: item.title,
        slug: item.slug,
        status: item.status,
        analytics: item.analytics || { views: 0, averageTimeOnPage: 0, bounceRate: 0 }
      };
      
      switch (item.type) {
        case 'guide':
          analytics.guides.push(contentAnalytics);
          break;
        case 'faq':
          analytics.faqs.push(contentAnalytics);
          break;
        case 'page':
          analytics.pages.push(contentAnalytics);
          break;
      }
    });
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching content analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch content analytics',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/analytics/campaigns
 * @desc    Get analytics for all campaigns
 * @access  Admin
 */
router.get('/campaigns', async (req, res) => {
  try {
    // Get AdPartner model if it exists
    let AdPartner;
    try {
      AdPartner = mongoose.model('AdPartner');
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'AdPartner model not defined yet'
      });
    }
    
    // Get all ad partners
    const adPartners = await AdPartner.find();
    
    // Extract campaign analytics
    const campaignAnalytics = [];
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalSpend = 0;
    
    adPartners.forEach(partner => {
      if (partner.campaigns && partner.campaigns.length > 0) {
        partner.campaigns.forEach(campaign => {
          // Skip campaigns without performance data
          if (!campaign.performance) return;
          
          const analytics = {
            id: campaign._id,
            name: campaign.name,
            partnerId: partner._id,
            partnerName: partner.name,
            status: campaign.status,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            budget: campaign.budget,
            performance: campaign.performance,
            ctr: campaign.performance.impressions > 0 ? 
              (campaign.performance.clicks / campaign.performance.impressions) * 100 : 0,
            conversionRate: campaign.performance.clicks > 0 ? 
              (campaign.performance.conversions / campaign.performance.clicks) * 100 : 0,
            cpa: campaign.performance.conversions > 0 ? 
              campaign.performance.spend / campaign.performance.conversions : 0
          };
          
          campaignAnalytics.push(analytics);
          
          // Add to totals
          totalImpressions += campaign.performance.impressions || 0;
          totalClicks += campaign.performance.clicks || 0;
          totalConversions += campaign.performance.conversions || 0;
          totalSpend += campaign.performance.spend || 0;
        });
      }
    });
    
    // Sort by impressions (highest first)
    campaignAnalytics.sort((a, b) => 
      (b.performance?.impressions || 0) - (a.performance?.impressions || 0)
    );
    
    res.json({
      success: true,
      data: {
        campaigns: campaignAnalytics,
        summary: {
          totalCampaigns: campaignAnalytics.length,
          totalImpressions,
          totalClicks,
          totalConversions,
          totalSpend,
          avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
          avgConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
          avgCPA: totalConversions > 0 ? totalSpend / totalConversions : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch campaign analytics',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   GET /api/admin/analytics/providers
 * @desc    Get analytics for all providers
 * @access  Admin
 */
router.get('/providers', async (req, res) => {
  try {
    // Get Provider model
    const Provider = mongoose.model('Provider');
    
    // Get transaction model if it exists
    let Transaction;
    try {
      Transaction = mongoose.model('Transaction');
    } catch (error) {
      // If Transaction model doesn't exist yet, return providers without transaction data
      const providers = await Provider.find().sort({ name: 1 });
      
      return res.json({
        success: true,
        data: {
          providers: providers.map(p => ({
            id: p._id,
            name: p.name,
            code: p.code,
            active: p.active,
            apiEnabled: p.apiEnabled,
            apiUsage: p.apiUsage || { today: 0, thisMonth: 0 },
            transactions: 0
          })),
          summary: {
            totalProviders: providers.length,
            activeProviders: providers.filter(p => p.active).length,
            apiEnabledProviders: providers.filter(p => p.apiEnabled).length
          }
        }
      });
    }
    
    // Get all providers and transactions
    const [providers, transactions] = await Promise.all([
      Provider.find().sort({ name: 1 }),
      Transaction.aggregate([
        { $group: { _id: '$provider', count: { $sum: 1 } } }
      ])
    ]);
    
    // Create a map of provider ID to transaction count
    const transactionCountMap = {};
    transactions.forEach(t => {
      transactionCountMap[t._id] = t.count;
    });
    
    // Prepare provider analytics
    const providerAnalytics = providers.map(p => ({
      id: p._id,
      name: p.name,
      code: p.code,
      active: p.active,
      apiEnabled: p.apiEnabled,
      apiUsage: p.apiUsage || { today: 0, thisMonth: 0 },
      transactions: transactionCountMap[p._id.toString()] || 0
    }));
    
    res.json({
      success: true,
      data: {
        providers: providerAnalytics,
        summary: {
          totalProviders: providers.length,
          activeProviders: providers.filter(p => p.active).length,
          apiEnabledProviders: providers.filter(p => p.apiEnabled).length,
          totalTransactions: transactions.reduce((sum, t) => sum + t.count, 0)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching provider analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch provider analytics',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

/**
 * @route   PUT /api/admin/analytics/content/:id
 * @desc    Update analytics for a specific content item
 * @access  Admin
 */
router.put('/content/:id', async (req, res) => {
  try {
    // Get Content model if it exists
    let Content;
    try {
      Content = mongoose.model('Content');
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Content model not defined yet'
      });
    }
    
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Create analytics object if it doesn't exist
    if (!content.analytics) {
      content.analytics = {
        views: 0,
        averageTimeOnPage: 0,
        bounceRate: 0
      };
    }
    
    // Update analytics fields
    if (req.body.views !== undefined) {
      content.analytics.views = req.body.views;
    }
    
    if (req.body.averageTimeOnPage !== undefined) {
      content.analytics.averageTimeOnPage = req.body.averageTimeOnPage;
    }
    
    if (req.body.bounceRate !== undefined) {
      content.analytics.bounceRate = req.body.bounceRate;
    }
    
    await content.save();
    
    res.json({
      success: true,
      data: {
        id: content._id,
        title: content.title,
        analytics: content.analytics
      }
    });
  } catch (error) {
    console.error('Error updating content analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update content analytics',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 