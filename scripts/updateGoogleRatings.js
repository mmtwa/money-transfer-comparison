const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const googleReviewService = require('../services/googleReviewService');

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debugging - show environment
console.log('Environment variables loaded:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
console.log('GOOGLE_PLACES_API_KEY:', process.env.GOOGLE_PLACES_API_KEY ? 'API key is set' : 'API key is not set');

// If .env file doesn't exist or MongoDB URI is not set, create a local one
if (!process.env.MONGODB_URI) {
  console.log('MONGODB_URI not found in .env, creating a default one...');
  
  // Create a default .env file if it doesn't exist
  const envPath = path.resolve(__dirname, '../.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Add MongoDB URI if not present
  if (!envContent.includes('MONGODB_URI=')) {
    envContent += '\nMONGODB_URI=mongodb+srv://mercedesclkexj:eey6HPOhWY8xNV0H@cluster0.dbtnsfv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0\n';
    fs.writeFileSync(envPath, envContent);
    
    // Reload environment variables
    dotenv.config({ path: envPath });
    console.log('Added MONGODB_URI to .env file');
  }
}

// List of provider names from our system (based on the client file)
const providerNames = [
  'abn-amro-bank', 'anz', 'anz-nz', 'auckland-savings-bank-nz', 'azimo', 
  'bank-of-america', 'bank-of-new-zealand-nz', 'barclays', 'bbva', 'bea', 
  'bendigo-bank', 'bnc', 'bnp', 'ccb-hk', 'chase', 'citibank-singapore', 
  'commerzbank', 'commonwealth-bank-of-australia', 'currencyfair', 
  'deutsche-bank', 'halifax', 'hang-seng', 'hsbc-hk', 'ing-nl', 'instarem', 
  'kiwibank', 'knab', 'la-banque-postale', 'lacaixa', 'lloyds', 'migros', 
  'monese', 'moneygram', 'national-australia-bank', 'nationwide', 'natwest', 
  'ocbc', 'ocbc-whb', 'ofx', 'paypal', 'postfinance', 'qnb-finansbank', 
  'rbc', 'rbs', 'remitly', 'revolut', 'ria', 'sabadell', 'scotiabank', 
  'skrill', 'starling-bank', 'swedbank-ab', 'td-bank', 'transfergo', 
  'transferwise', 'unicredit', 'western-union', 'westernunion', 'westpac-nz', 
  'wise', 'world-remit', 'worldfirst', 'worldremit', 'xe', 'xoom', 'zkb'
];

// Format provider names to be more recognizable to Google
const formatProviderName = (providerCode) => {
  return providerCode
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('MongoDB connected successfully');
    
    // Test database by checking connection state
    const state = mongoose.connection.readyState;
    console.log('Connection state:', state); // 0 = disconnected, 1 = connected
    
    // List collections to verify connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Main function to update all provider ratings
const updateAllRatings = async () => {
  try {
    // Connect to database
    const connected = await connectDB();
    
    if (!connected) {
      console.log('Failed to connect to MongoDB, exiting...');
      process.exit(1);
    }
    
    console.log(`Updating Google ratings for ${providerNames.length} providers...`);
    
    // Format provider names for better matching in Google
    const formattedProviderNames = providerNames.map(name => formatProviderName(name));
    
    // Take a smaller batch for testing if needed
    const providersToUpdate = formattedProviderNames.slice(0, 5); // Only update 5 for testing
    console.log('Updating providers:', providersToUpdate);
    
    // Update all provider ratings
    const results = await googleReviewService.updateAllProviderRatings(providersToUpdate);
    
    console.log(`Successfully updated ${results.length} provider ratings`);
    
    // Close database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating provider ratings:', error);
    
    // Close database connection
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
};

// Run the script
updateAllRatings(); 