const mongoose = require('mongoose');
const Provider = require('../models/Provider');
require('dotenv').config();

async function addOFXProvider() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Check if OFX provider already exists
    const existingProvider = await Provider.findOne({ code: 'ofx' });
    
    if (existingProvider) {
      console.log('OFX provider already exists, updating...');
      
      // Update the provider with new details
      existingProvider.apiKey = process.env.OFX_API_KEY || 'xV8bnITZIspGkGMplzy3DtNgSRZQA3YO';
      existingProvider.apiSecret = process.env.OFX_API_SECRET || '6guqggHIXPRnk02q';
      existingProvider.baseUrl = 'https://sandbox.api.ofx.com';
      existingProvider.apiEnabled = true;
      existingProvider.apiHandler = 'ofx';
      
      await existingProvider.save();
      console.log('OFX provider updated successfully');
    } else {
      console.log('Creating new OFX provider...');
      
      // Create a new OFX provider
      const ofxProvider = new Provider({
        name: 'OFX',
        code: 'ofx',
        logo: '/images/providers/OFX_Logo.webp',
        description: 'OFX is a global money transfer specialist helping individuals and businesses move money worldwide.',
        baseUrl: 'https://sandbox.api.ofx.com',
        apiKey: process.env.OFX_API_KEY || 'xV8bnITZIspGkGMplzy3DtNgSRZQA3YO',
        apiSecret: process.env.OFX_API_SECRET || '6guqggHIXPRnk02q',
        apiEnabled: true,
        apiHandler: 'ofx',
        apiVersion: 'v1',
        transferFeeStructure: {
          type: 'percentage',
          percentage: 0.4,
          minimum: 0,
          maximum: 15
        },
        exchangeRateMargin: 0.004,
        transferTimeHours: {
          min: 1,
          max: 48
        },
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'JPY', 'CHF', 'SGD', 'HKD'],
        methods: ['bank_transfer'],
        rating: 4.7,
        active: true
      });
      
      await ofxProvider.save();
      console.log('OFX provider added successfully');
    }
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addOFXProvider(); 