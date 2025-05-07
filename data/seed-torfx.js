const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TrustpilotRating = require('../models/TrustpilotRating');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// TorFX ratings data
const torfxTrustpilotData = {
  providerName: 'torfx',
  rating: 4.3,
  lastUpdated: new Date()
};

// Function to seed TorFX ratings
async function seedTorFXRatings() {
  try {
    console.log('Seeding TorFX ratings...');

    // Add or update TorFX Trustpilot rating
    const trustpilotResult = await TrustpilotRating.findOneAndUpdate(
      { providerName: torfxTrustpilotData.providerName },
      torfxTrustpilotData,
      { upsert: true, new: true }
    );
    
    console.log('TorFX Trustpilot rating seeded:', trustpilotResult);

    console.log('TorFX ratings seeded successfully!');
    
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error seeding TorFX ratings:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedTorFXRatings(); 