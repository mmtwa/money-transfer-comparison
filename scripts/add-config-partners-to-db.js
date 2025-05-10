const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Define AdPartner schema (must match what's in routes/admin/adPartners.js)
const AdPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  contractStartDate: {
    type: Date,
    required: true
  },
  contractEndDate: {
    type: Date,
    required: true
  },
  paymentTerms: {
    type: String,
    enum: ['monthly', 'quarterly', 'annually', 'cpc', 'cpa'],
    default: 'monthly'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Define the partner data directly
const partnersData = [
  {
    name: 'BA',
    code: 'ba',
    contactEmail: 'contact@ba.example.com',
    contractStartDate: new Date(),
    contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    paymentTerms: 'monthly',
    status: 'active',
    logo: '/partners/ba/desktop.webp',
    description: 'BA advertising partner',
  },
  {
    name: 'SE',
    code: 'se',
    contactEmail: 'contact@se.example.com',
    contractStartDate: new Date(),
    contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    paymentTerms: 'monthly',
    status: 'inactive', // SE is marked as inactive in the config
    logo: '/partners/se/desktop.webp',
    description: 'SE advertising partner',
  }
];

async function addPartnersToDb() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    
    console.log('Connected to MongoDB.');
    
    // Register the AdPartner model
    const AdPartner = mongoose.models.AdPartner || mongoose.model('AdPartner', AdPartnerSchema);
    
    // Add each partner to the database
    for (const partnerData of partnersData) {
      // Check if the partner already exists
      const existingPartner = await AdPartner.findOne({ code: partnerData.code });
      
      if (existingPartner) {
        console.log(`Partner ${partnerData.code} already exists in the database.`);
        continue;
      }
      
      // Create new partner
      const newPartner = new AdPartner(partnerData);
      
      // Save to database
      await newPartner.save();
      console.log(`Added partner ${partnerData.code} to the database.`);
    }
    
    console.log('Process completed.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the process
addPartnersToDb(); 