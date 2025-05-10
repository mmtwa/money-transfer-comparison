/**
 * Script to check the JWT token and user model structure
 * 
 * Run with: node scripts/check-auth-structure.js
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check for MongoDB URI and JWT secret
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in the .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in the .env file');
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
    // Get User model without schema validation
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user with email admin@example.com not found');
      process.exit(0);
    }
    
    console.log('Found admin user:');
    console.log({
      _id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName
    });

    // Generate a JWT token for testing
    const payload = {
      id: adminUser._id,
      role: adminUser.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    console.log('\nGenerated test JWT token:');
    console.log(token);
    
    console.log('\nDecoded token payload:');
    console.log(jwt.decode(token));
    
    console.log('\n-----------------------------------');
    console.log('Auth check setup looks good!');
    console.log(`Login with: admin@example.com / admin123`);
    console.log('Make sure your frontend is checking for user.role === "admin"');
    console.log('-----------------------------------');
    
  } catch (err) {
    console.error('Error checking auth structure:', err);
  } finally {
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 