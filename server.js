const express = require('express');
// const cors = require('cors'); // Comment out default cors
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const corsMiddleware = require('./middleware/cors'); // Add our custom CORS middleware
const fs = require('fs');

// Load environment variables
dotenv.config();

// Log environment for debugging
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT}`);
console.log(`Using Wise ${process.env.WISE_CLIENT_ID ? 'Basic Auth' : 'API Key'} authentication`);

// Run the logo copying script to ensure logos are available
try {
  console.log('Running logo copying script...');
  require('./copyLogos');
} catch (err) {
  console.error('Error running logo copying script:', err);
}

// Import routes
const authRoutes = require('./routes/auth');
const providerRoutes = require('./routes/providers');
const rateRoutes = require('./routes/rates');
const userRoutes = require('./routes/users');
const wiseRoutes = require('./routes/wiseRates');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Continue running the app even if MongoDB fails - don't exit
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "img-src": ["'self'", "data:", "https://www.google-analytics.com", "https://stats.g.doubleclick.net", "https://dq8dwmysp7hk1.cloudfront.net", "https://*.wise.com", "https://wise.com"],
      "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
      "connect-src": ["'self'", "https://www.google-analytics.com", "https://*.google-analytics.com", "https://region1.google-analytics.com", "https://stats.g.doubleclick.net"]
    }
  },
  crossOriginEmbedderPolicy: false,  // Allow loading resources from different origins
  crossOriginResourcePolicy: false   // Allow resources to be shared cross-origin
})); // Security headers
// app.use(cors()); // Disable default CORS
app.use(corsMiddleware); // Use our custom CORS middleware
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(logger); // Request logging

// After middleware setup, add static middleware for images and logos
// Create directory structure for provider images if it doesn't exist
const providersDir = path.join(__dirname, 'client', 'public', 'images', 'providers');
if (!fs.existsSync(providersDir)) {
  fs.mkdirSync(providersDir, { recursive: true });
  console.log('Created providers directory');
}

// Always copy provider logos from client/public to client/public/images/providers to ensure they exist
const sourceDir = path.join(__dirname, 'client', 'public');
const logoFiles = [
  { source: 'wiselogo.png', dest: 'wise.png' },
  { source: 'XELogo.svg', dest: 'xe.png' },
  { source: 'Western-Union-Logo.png', dest: 'westernunion.png' }
];

logoFiles.forEach(logo => {
  const source = path.join(sourceDir, logo.source);
  const dest = path.join(providersDir, logo.dest);
  
  if (fs.existsSync(source)) {
    try {
      fs.copyFileSync(source, dest);
      console.log(`Copied ${logo.source} to ${dest}`);
    } catch (err) {
      console.error(`Error copying ${logo.source} to ${dest}:`, err);
    }
  } else {
    console.log(`Source file ${logo.source} does not exist at ${source}`);
  }
});

// Copy also the existing files in /client/public with logo names
if (fs.existsSync(path.join(sourceDir, 'wiselogo.png'))) {
  fs.copyFileSync(
    path.join(sourceDir, 'wiselogo.png'), 
    path.join(providersDir, 'wise.png')
  );
}

// Serve static assets - FOR DEVELOPMENT ONLY
if (process.env.NODE_ENV !== 'production') {
  app.use('/images', express.static(path.join(__dirname, 'client/public/images')));
  app.use(express.static(path.join(__dirname, 'client/public')));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});
app.use('/api/', apiLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wise', wiseRoutes);

// Define the v1/rates endpoint for historical rates
app.use('/v1/rates', (req, res, next) => {
  console.log('Historical rates API called');
  
  // Check for future dates and adjust them
  if (req.query.to) {
    const toDate = new Date(req.query.to);
    const now = new Date();
    
    if (toDate > now) {
      console.log(`Server adjusting future date ${req.query.to} to current date`);
      req.query.to = now.toISOString();
    }
  }
  
  rateRoutes.handle(req, res, next);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Make sure we have provider images in the build directory
  const buildProvidersDir = path.join(__dirname, 'client', 'build', 'images', 'providers');
  if (!fs.existsSync(buildProvidersDir)) {
    fs.mkdirSync(buildProvidersDir, { recursive: true });
    console.log('Created build providers directory');
    
    // Copy provider logos to build directory if needed
    const sourceProvidersDir = path.join(__dirname, 'client', 'public', 'images', 'providers');
    if (fs.existsSync(sourceProvidersDir)) {
      fs.readdirSync(sourceProvidersDir).forEach(file => {
        const source = path.join(sourceProvidersDir, file);
        const dest = path.join(buildProvidersDir, file);
        
        fs.copyFileSync(source, dest);
        console.log(`Copied ${file} to build directory`);
      });
    }
  }
  
  // Set static folder - Ensure the path is correct
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.use('/images', express.static(path.join(__dirname, 'client', 'build', 'images')));
  
  // Add explicit route for provider images to ensure they're properly served
  app.use('/images/providers', express.static(path.join(__dirname, 'client', 'build', 'images', 'providers')));
  
  // Health check endpoint for Render
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
  // Handle all routes not captured by API - Make sure non-API routes serve index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    } else {
      // Handle 404 for API routes that don't exist
      res.status(404).json({
        success: false,
        message: 'API endpoint not found'
      });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes