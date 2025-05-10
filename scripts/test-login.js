/**
 * Script to directly test login against the backend API
 * 
 * Run with: node scripts/test-login.js
 */

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create a server to run locally
const express = require('express');
const app = express();
const PORT = 3001; // Use a different port than your main app

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in the .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Attempt to directly check the User model
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find user
    const user = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!user) {
      console.error('User not found in database');
      process.exit(1);
    }
    
    console.log('Found user:', {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password ? '[HASHED]' : '[NOT FOUND]'
    });
    
    // Test login - make a direct request to your API
    console.log('\nTesting login with the API directly...');
    
    try {
      const response = await axios.post('http://localhost:10000/api/auth/login', {
        email: 'admin@example.com',
        password: 'admin123'
      });
      
      console.log('\nLogin successful!');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      
      // Now try to use this token to access /api/auth/me
      if (response.data && response.data.token) {
        try {
          const userResponse = await axios.get('http://localhost:10000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            }
          });
          
          console.log('\nUser data retrieved successfully:');
          console.log(userResponse.data);
        } catch (userError) {
          console.error('\nFailed to get user data with token:');
          console.error('Status:', userError.response?.status);
          console.error('Error:', userError.response?.data || userError.message);
        }
      }
    } catch (loginError) {
      console.error('\nLogin request failed:');
      console.error('Status:', loginError.response?.status);
      console.error('Error:', loginError.response?.data || loginError.message);
      
      // Try to diagnose what's wrong
      if (loginError.response?.status === 401) {
        console.log('\nDiagnosing 401 Unauthorized error:');
        console.log('1. Make sure the server is running (npm start)');
        console.log('2. The password might not be hashed correctly');
        console.log('3. Check the login route in routes/auth.js');
        
        // Try direct password match check if available
        if (user && user.password && typeof user.matchPassword === 'function') {
          try {
            const passwordMatches = await user.matchPassword('admin123');
            console.log('\nDirect password check result:', passwordMatches);
          } catch (err) {
            console.log('\nCould not directly check password:', err.message);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}); 