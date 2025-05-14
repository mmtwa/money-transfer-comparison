const express = require('express');
const router = express.Router();
const ofxApiService = require('../services/ofxApiService');
const auth = require('../middleware/auth');

// GET /api/ofx/rate/:fromCurrency/:toCurrency/:amount
// Get OFX exchange rate for a specific currency pair and amount
router.get('/rate/:fromCurrency/:toCurrency/:amount', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.params;
    
    // Validate parameters
    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: fromCurrency, toCurrency, amount'
      });
    }
    
    // Attempt to get exchange rate from OFX
    const rateInfo = await ofxApiService.getExchangeRate(
      fromCurrency.toUpperCase(),
      toCurrency.toUpperCase(),
      parseFloat(amount)
    );
    
    return res.status(200).json({
      success: true,
      data: rateInfo
    });
  } catch (error) {
    console.error('Error in OFX rate endpoint:', error.message);
    return res.status(500).json({
      success: false,
      message: `Error getting OFX rate: ${error.message}`
    });
  }
});

// GET /api/ofx/test-credentials
// Test if OFX API credentials are valid
router.get('/test-credentials', auth, async (req, res) => {
  try {
    const result = await ofxApiService.testApiCredentials();
    
    return res.status(200).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Error testing OFX credentials:', error.message);
    return res.status(500).json({
      success: false,
      message: `Error testing OFX credentials: ${error.message}`
    });
  }
});

// Function to handle historical rates
// Note that this is a stub since OFX doesn't support historical rates
router.handle = async (req, res) => {
  try {
    const { from, to, source, target } = req.query;
    
    if (!from || !to || !source || !target) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Inform the client that this is not supported
    return res.status(400).json({
      success: false,
      message: 'Historical rates not supported through OFX API'
    });
  }
  catch (error) {
    console.error('Error in OFX historical rates:', error.message);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`
    });
  }
};

module.exports = router; 