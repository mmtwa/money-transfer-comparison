const mongoose = require('mongoose');
const TrustpilotRating = require('./models/TrustpilotRating');
require('dotenv').config();

// List of providers to test
const providersToTest = [
  'regencyfx',
  'torfx',
  'pandaremit',
  'xe',
  'profee',
  'regency',
  'regency-fx',
  'regency fx',
  'panda remit',
  'panda-remit'
];

// Provider name normalization map
const PROVIDER_ALIASES = {
  'transferwise': 'wise',
  'wise': 'wise',
  'worldremit': 'worldremit',
  'regency fx': 'regencyfx',
  'regency-fx': 'regencyfx',
  'regency': 'regencyfx',
  'regencyfx': 'regencyfx',
  'pandaremit': 'pandaremit',
  'panda remit': 'pandaremit',
  'panda-remit': 'pandaremit',
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
  'torfx': 'torfx',
  'profee': 'profee'
};

async function testTrustpilotRatings() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Check if trustpilotratings collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('trustpilotratings')) {
      console.error('ERROR: trustpilotratings collection does not exist in the database');
      console.log('Available collections:', collectionNames);
      return;
    }

    console.log('Testing providers:', providersToTest);
    console.log('---------------------------------------');

    for (const provider of providersToTest) {
      console.log(`\nTesting provider: "${provider}"`);
      
      // Normalize provider name (the same way the API does it)
      const normalizedName = provider.toLowerCase()
        .replace(/^provider-/, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
      
      // Apply aliases
      const standardizedName = PROVIDER_ALIASES[normalizedName] || normalizedName;
      
      console.log(`Normalization: "${provider}" → "${normalizedName}" → "${standardizedName}"`);
      
      // Query MongoDB directly
      const rating = await TrustpilotRating.findOne({ providerName: standardizedName });
      
      if (rating) {
        console.log(`  ✅ SUCCESS: Found in database with rating = ${rating.rating}`);
        console.log(`  Last updated: ${rating.lastUpdated}`);
      } else {
        console.log(`  ❌ FAILURE: Not found in database with name "${standardizedName}"`);
        
        // Try to find any similar ratings
        const similarRatings = await TrustpilotRating.find({
          providerName: { $regex: new RegExp(normalizedName.substring(0, 4), 'i') }
        });
        
        if (similarRatings.length > 0) {
          console.log(`  Found ${similarRatings.length} similar ratings:`);
          similarRatings.forEach(r => {
            console.log(`    - ${r.providerName}: ${r.rating}`);
          });
        }
      }
      
      console.log('---------------------------------------');
    }
    
    // Get all ratings in the database
    const allRatings = await TrustpilotRating.find({});
    console.log(`\nAll ratings in database (${allRatings.length} total):`);
    allRatings.forEach(r => {
      console.log(`  - ${r.providerName}: ${r.rating}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testTrustpilotRatings(); 