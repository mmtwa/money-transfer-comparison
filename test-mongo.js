const mongoose = require('mongoose');
const TrustpilotRating = require('./models/TrustpilotRating');
require('dotenv').config();

async function testMongoConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Delete the test rating
    const result = await TrustpilotRating.deleteOne({ providerName: 'regency fx' });
    console.log('Delete result:', result);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

testMongoConnection(); 