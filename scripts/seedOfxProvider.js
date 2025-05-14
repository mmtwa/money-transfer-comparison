const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Provider = require('../models/Provider'); // Adjust path if needed

// Load environment variables
dotenv.config({ path: './.env' }); // Load .env from the current directory (project root)

const seedOFXProvider = async () => {
  console.log('Attempting to connect to MongoDB...');
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully for seeding.');

    const ofxProviderData = {
      name: "OFX",
      code: "ofx", // Unique code
      logo: "/images/providers/OFX_Logo.webp",
      description: "OFX provides international money transfers for personal and business customers.",
      // Use production URL by default, adjust if needed or use env var like in ofxApiService
      baseUrl: process.env.ENABLE_SANDBOX_MODE === 'true' ? 'https://sandbox.api.ofx.com' : 'https://api.ofx.com',
      // API keys are read from .env by the service, BUT the schema requires apiKey.
      // Add them here from process.env to satisfy the schema requirement.
      apiKey: process.env.OFX_CLIENT_ID, 
      apiSecret: process.env.OFX_CLIENT_SECRET, // Add secret too, though not required by schema
      apiEnabled: true,
      apiHandler: "ofx",
      transferFeeStructure: {
        type: "flat",
        amount: 0, // Required for flat type
        // Explicitly provide other fields even if not used by 'flat' to help validator
        percentage: null, 
        minimum: null,
        maximum: null // Optional, can be null
      },
      exchangeRateMargin: 0.01, // Estimated margin (1%)
      transferTimeHours: {
        min: 24,
        max: 48 // 1-2 business days
      },
      supportedCurrencies: ["USD", "EUR", "GBP", "AUD", "CAD", "NZD", "JPY", "CHF", "HKD", "SGD", "SEK", "NOK", "DKK", "PLN", "ZAR", "INR", "THB", "MXN"], // Example list
      methods: ["bank_transfer"],
      rating: 4.6, // Example rating
      active: true
    };

    console.log(`Attempting to find provider with code: ${ofxProviderData.code}`);
    let provider = await Provider.findOne({ code: ofxProviderData.code });

    if (provider) {
      console.log('OFX provider found, updating...');
      // Update existing provider - merge new data
      Object.assign(provider, ofxProviderData);
      // Mark fields as modified if necessary, Mongoose usually detects changes
      provider.markModified('transferFeeStructure');
      provider.markModified('transferTimeHours');
      provider.markModified('supportedCurrencies');
      provider.markModified('methods');
      provider = await provider.save({ validateBeforeSave: true }); // Ensure validation on save
      console.log('OFX provider updated successfully:');
    } else {
      console.log('OFX provider not found, creating new one...');
      // Create new provider using the data
      provider = await Provider.create(ofxProviderData); // Create handles validation
      console.log('OFX provider created successfully:');
    }

    // console.log('OFX provider seeded/updated successfully:'); // Moved logging
    console.log(provider); // Log the final created/updated document

  } catch (error) {
    console.error('Error seeding OFX provider:', error);
    process.exit(1);
  } finally {
    // Ensure disconnection
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedOFXProvider(); 