/**
 * Script to create an admin user
 * 
 * Run with: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in the .env file');
  process.exit(1);
}

// Check for JWT configuration
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in the .env file');
  console.log('Setting a default value for testing purposes only');
  process.env.JWT_SECRET = 'testsecret';
}

if (!process.env.JWT_EXPIRE) {
  console.log('JWT_EXPIRE is not set, using default value');
  process.env.JWT_EXPIRE = '30d';
}

if (!process.env.JWT_COOKIE_EXPIRE) {
  console.log('JWT_COOKIE_EXPIRE is not set, using default value');
  process.env.JWT_COOKIE_EXPIRE = '30';
}

// Define User schema if it doesn't already exist
let User;
try {
  User = mongoose.model('User');
} catch {
  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    firstName: {
      type: String,
      required: [true, 'Please provide your first name']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  // Encrypt password using bcrypt
  UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  // Match user entered password to hashed password in database
  UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Sign JWT and return
  UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  };

  User = mongoose.model('User', UserSchema);
}

// Admin user details - change these as needed
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'admin123', // You should use a strong password in production
  role: 'admin'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log(`Admin user with email ${adminUser.email} already exists`);
      process.exit(0);
    }
    
    // Create admin user
    const user = new User(adminUser);
    await user.save();
    
    console.log(`Admin user created with email: ${adminUser.email}`);
    console.log('You can now log in with these credentials');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 