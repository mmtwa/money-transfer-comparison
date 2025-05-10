const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Import admin sub-routes
const providerRoutes = require('./providers');
const adPartnerRoutes = require('./adPartners');
const contentRoutes = require('./content');
const campaignRoutes = require('./campaigns');
const analyticsRoutes = require('./analytics');

// Mount admin sub-routes
router.use('/providers', auth, admin, providerRoutes);
router.use('/ad-partners', auth, admin, adPartnerRoutes);
router.use('/content', auth, admin, contentRoutes);
router.use('/campaigns', auth, admin, campaignRoutes);
router.use('/analytics', auth, admin, analyticsRoutes);

module.exports = router; 