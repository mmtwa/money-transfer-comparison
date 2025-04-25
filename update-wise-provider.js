/**
 * One-time script to update the Wise provider in the database with proper credentials
 * Run with: node update-wise-provider.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Provider = require('./models/Provider');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async function() {
  console.log('Connected to database');
  
  try {
    // Find Wise provider by name or code
    let wiseProvider = await Provider.findOne({ 
      $or: [
        { name: "Wise" },
        { name: "TransferWise" },
        { code: "WISE" },
        { code: "TRANSFERWISE" }
      ] 
    });
    
    if (wiseProvider) {
      console.log(`Updating existing provider: ${wiseProvider.name} (${wiseProvider.code})...`);
      
      // Update Wise provider with proper credentials
      wiseProvider.name = 'Wise';
      wiseProvider.apiEnabled = true;
      wiseProvider.apiHandler = 'wise';
      wiseProvider.apiKey = process.env.WISE_CLIENT_KEY;
      wiseProvider.apiSecret = process.env.WISE_CLIENT_SECRET;
      wiseProvider.baseUrl = process.env.WISE_API_URL || 'https://api.wise.com/v1';
      wiseProvider.apiLastTested = new Date();
      
      await wiseProvider.save();
      console.log('✅ Wise provider updated successfully!');
    } else {
      console.log('Wise provider not found. Creating new provider...');
      
      // Create new Wise provider
      const newWiseProvider = new Provider({
        name: 'Wise',
        code: 'WISE',
        logo: '/images/providers/wise.svg',
        description: 'Wise (formerly TransferWise) is a money transfer service allowing private individuals and businesses to send money abroad without hidden charges.',
        baseUrl: process.env.WISE_API_URL || 'https://api.wise.com/v1',
        apiKey: process.env.WISE_CLIENT_KEY,
        apiSecret: process.env.WISE_CLIENT_SECRET,
        apiEnabled: true,
        apiHandler: 'wise',
        apiVersion: 'v1',
        apiLastTested: new Date(),
        transferFeeStructure: {
          type: 'percentage',
          percentage: 0.5,
          minimum: 3,
          maximum: 150
        },
        exchangeRateMargin: 0.005,
        transferTimeHours: {
          min: 12,
          max: 48
        },
        supportedCurrencies: [
          'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 
          'JPY', 'CHF', 'DKK', 'NOK', 'SEK', 'PLN'
        ],
        methods: ['bank_transfer', 'debit_card'],
        rating: 4.7,
        active: true
      });
      
      await newWiseProvider.save();
      console.log('✅ New Wise provider created successfully!');
    }
    
    // Verify the result
    const updatedProvider = await Provider.findOne({ name: 'Wise' });
    console.log('Wise provider configuration:');
    console.log('- Name:', updatedProvider.name);
    console.log('- Code:', updatedProvider.code);
    console.log('- API Enabled:', updatedProvider.apiEnabled);
    console.log('- API Handler:', updatedProvider.apiHandler);
    console.log('- Last Tested:', updatedProvider.apiLastTested);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}); 