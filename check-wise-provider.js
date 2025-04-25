require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    // Connect to MongoDB with updated options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get the Provider model
    const providerSchema = new mongoose.Schema({}, { strict: false });
    const Provider = mongoose.model('Provider', providerSchema, 'providers');

    // Find Wise provider by name or apiHandler
    const wiseProvider = await Provider.findOne({ 
      $or: [
        { name: "Wise" },
        { apiHandler: "wise" }
      ] 
    });
    
    if (wiseProvider) {
      console.log('Wise provider found:');
      
      // Display provider information (excluding sensitive fields)
      const providerInfo = { ...wiseProvider.toObject() };
      // Remove sensitive fields
      delete providerInfo.apiKey;
      delete providerInfo.apiSecret;
      
      console.log(JSON.stringify(providerInfo, null, 2));
    } else {
      console.log('Wise provider not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

run(); 