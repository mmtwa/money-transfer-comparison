const mongoose = require('mongoose');
const TrustpilotRating = require('./models/TrustpilotRating');
require('dotenv').config();

// Default provider ratings
const DEFAULT_RATINGS = {
  'wise': 4.7,
  'ofx': 4.2,
  'westernunion': 3.9,
  'moneygram': 3.7,
  'worldremit': 4.1,
  'remitly': 4.3,
  'xe': 4.1,
  'torfx': 4.4,
  'currencyfair': 4.4,
  'revolut': 4.3,
  'skrill': 4.0,
  'transfergo': 4.3
};

// Provider name normalization map
const PROVIDER_ALIASES = {
  'transferwise': 'wise', 
  'wise': 'wise',
  'worldremit': 'worldremit',
  'regency fx': 'regencyfx',
  'regencyfx': 'regencyfx',
  'pandaremit': 'pandaremit',
  'westernunion': 'westernunion',
  'western union': 'westernunion',
  'western-union': 'westernunion',
  'moneygram': 'moneygram',
  'remitly': 'remitly',
  'xe': 'xe',
  'currencyfair': 'currencyfair',
  'paypal': 'paypal',
  'skrill': 'skrill',
  'skrillmoneytransfer': 'skrill',
  'skrill money transfer': 'skrill',
  'revolut': 'revolut',
  'torfx': 'torfx'
};

async function checkTrustpilotRatings() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Check if TrustpilotRating collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Collections:', collectionNames);
    
    // Get all existing trustpilot ratings
    const existingRatings = await TrustpilotRating.find({});
    console.log(`Found ${existingRatings.length} existing ratings`);
    
    // Log existing ratings
    existingRatings.forEach(rating => {
      console.log(`- ${rating.providerName}: ${rating.rating} (Last updated: ${rating.lastUpdated})`);
    });
    
    // Check for missing ratings
    const missingRatings = [];
    for (const [provider, rating] of Object.entries(DEFAULT_RATINGS)) {
      const normalizedName = provider.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
      
      const found = existingRatings.some(r => r.providerName === normalizedName);
      if (!found) {
        missingRatings.push({ providerName: normalizedName, rating });
      }
    }
    
    console.log(`\nMissing ${missingRatings.length} ratings`);
    
    // Insert missing ratings
    if (missingRatings.length > 0) {
      console.log('Adding missing ratings:');
      for (const ratingData of missingRatings) {
        console.log(`- Adding ${ratingData.providerName}: ${ratingData.rating}`);
        await TrustpilotRating.findOneAndUpdate(
          { providerName: ratingData.providerName },
          { 
            providerName: ratingData.providerName,
            rating: ratingData.rating,
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );
      }
      console.log('Done adding missing ratings');
    }
    
    // Get all ratings after updates
    const updatedRatings = await TrustpilotRating.find({});
    console.log(`\nNow have ${updatedRatings.length} ratings in database`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
checkTrustpilotRatings(); 