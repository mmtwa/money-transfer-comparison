const mongoose = require('mongoose');
const TrustpilotRating = require('./models/TrustpilotRating');
require('dotenv').config();

// Target providers with specific ratings
const TARGET_PROVIDERS = {
  'regencyfx': 4.9,
  'torfx': 4.4,
  'pandaremit': 4.1,
  'xe': 4.2,
  'profee': 4.4
};

async function fixSpecificRatings() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Check if trustpilotratings collection exists explicitly
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('trustpilotratings')) {
      console.log('ERROR: trustpilotratings collection does not exist in the database');
      console.log('Available collections:', collectionNames);
      
      // Create the collection if it doesn't exist
      console.log('Creating trustpilotratings collection...');
      await mongoose.connection.createCollection('trustpilotratings');
      console.log('Collection created');
    } else {
      console.log('trustpilotratings collection exists');
    }
    
    // Force update ratings for the target providers
    for (const [provider, rating] of Object.entries(TARGET_PROVIDERS)) {
      console.log(`Updating ${provider} rating to ${rating}`);
      
      const result = await TrustpilotRating.findOneAndUpdate(
        { providerName: provider },
        { 
          providerName: provider,
          rating: rating,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
      
      console.log(`- Result: ${result}`);
    }
    
    // Double-check that the ratings are in the database
    const updatedRatings = await TrustpilotRating.find({
      providerName: { $in: Object.keys(TARGET_PROVIDERS) }
    });
    
    console.log(`\nFound ${updatedRatings.length} ratings for target providers`);
    updatedRatings.forEach(rating => {
      console.log(`- ${rating.providerName}: ${rating.rating} (Last updated: ${rating.lastUpdated})`);
    });
    
    // List all collections again to confirm
    const updatedCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCurrent collections:', updatedCollections.map(c => c.name));
    
    // Count total documents in the collection
    const count = await TrustpilotRating.countDocuments();
    console.log(`Total documents in TrustpilotRating collection: ${count}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
fixSpecificRatings(); 