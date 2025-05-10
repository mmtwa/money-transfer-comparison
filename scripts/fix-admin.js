/**
 * Script to fix admin user permissions
 * 
 * Run with: node scripts/fix-admin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in the .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get User model without schema validation (to access any user document)
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user with email admin@example.com not found');
      process.exit(0);
    }
    
    console.log('Found admin user:');
    console.log(adminUser);
    
    // Update the user with the correct role
    adminUser.role = 'admin';
    
    // Remove isAdmin field if it exists
    if (adminUser.isAdmin !== undefined) {
      console.log('Removing isAdmin field and setting role=admin');
      adminUser.isAdmin = undefined;
    }
    
    await adminUser.save();
    
    console.log('Admin user updated successfully with role=admin');
  } catch (err) {
    console.error('Error updating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 