require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    // Connect to MongoDB with updated options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'money-transfer-comparison'
    });
    console.log('Connected to MongoDB');

    // Define Provider schema
    const providerSchema = new mongoose.Schema({
      name: String,
      apiHandler: String
      // Not including sensitive fields
    });

    // Create Provider model
    const Provider = mongoose.model('Provider', providerSchema, 'providers');

    // Find all providers
    const providers = await Provider.find({});
    
    if (providers && providers.length > 0) {
      console.log(`Found ${providers.length} providers:`);
      providers.forEach(provider => {
        console.log(`- Name: ${provider.name}, API Handler: ${provider.apiHandler}`);
      });
    } else {
      console.log('No providers found in the database');
    }

    // Check all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in the database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

run(); 