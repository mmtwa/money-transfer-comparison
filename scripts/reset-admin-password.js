/**
 * Script to reset admin user password
 * 
 * Run with: node scripts/reset-admin-password.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    // Get User model (with password field accessible - normally it's excluded)
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user with email admin@example.com not found');
      process.exit(0);
    }
    
    // Generate new password hash
    const salt = await bcrypt.genSalt(10);
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    adminUser.password = hashedPassword;
    
    await adminUser.save();
    
    console.log(`Admin password reset successfully to: ${newPassword}`);
    console.log('You can now log in with these credentials');
  } catch (err) {
    console.error('Error resetting admin password:', err);
  } finally {
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 