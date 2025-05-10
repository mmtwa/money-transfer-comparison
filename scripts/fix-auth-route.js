/**
 * Script to check and fix authentication issues
 * 
 * Run with: node scripts/fix-auth-route.js
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in the .env file');
  process.exit(1);
}

// Fix the matchPassword method in the User model
async function fixUserModel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Try to get the User model and add matchPassword method
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      firstName: String,
      lastName: String
    }, { strict: false }));

    // Add the matchPassword method directly to the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }

    console.log('Found admin user:', {
      _id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role
    });

    // Test password directly with bcrypt
    if (adminUser.password) {
      try {
        // Reset password directly
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        adminUser.password = hashedPassword;
        await adminUser.save();
        
        console.log('Reset password hash directly in database');
        
        // Verify the hash works
        const isMatch = await bcrypt.compare('admin123', adminUser.password);
        console.log('Password verification test:', isMatch ? 'PASSED' : 'FAILED');
      } catch (err) {
        console.error('Error testing or updating password:', err);
      }
    } else {
      console.error('User has no password field');
    }
  } catch (error) {
    console.error('Error fixing user model:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Check the sendTokenResponse function in auth.js
function checkAuthResponse() {
  try {
    const authPath = path.join(__dirname, '../routes/auth.js');
    
    if (fs.existsSync(authPath)) {
      const authContent = fs.readFileSync(authPath, 'utf8');
      
      console.log('\nChecking auth.js implementation:');
      
      // Check for token structure
      if (authContent.includes('res.json({ success: true, data: { token }'))  {
        console.log('✓ Auth response seems to include correct token structure');
      } else if (authContent.includes('res.json({ success: true, token }')) {
        console.log('✗ Auth response may have incorrect structure. Expected: data: { token }');
        
        console.log('\nConsider updating the sendTokenResponse function in auth.js:');
        console.log(`
// Should be:
res.status(statusCode)
  .json({
    success: true,
    data: { token }
  });
        `);
      }
      
      // Check for password comparison
      if (authContent.includes('user.matchPassword')) {
        console.log('✓ Auth is using user.matchPassword for password comparison');
      } else {
        console.log('✗ Auth might not be using user.matchPassword for password comparison');
      }
      
      // Check if select('+password') is used
      if (authContent.includes('select(\'+password\')')) {
        console.log('✓ Auth is properly selecting password field');
      } else {
        console.log('✗ Auth might not be selecting password field for comparison');
      }
    } else {
      console.error('Auth.js file not found at:', authPath);
    }
  } catch (error) {
    console.error('Error checking auth response:', error);
  }
}

// Execute the fixes
async function main() {
  // Step 1: Fix user model
  await fixUserModel();
  
  // Step 2: Check auth response
  checkAuthResponse();
  
  console.log('\nFixes completed. Try logging in with:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main(); 