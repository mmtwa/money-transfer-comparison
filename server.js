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
console.log(`WISE_CLIENT_SECRET is ${process.env.WISE_CLIENT_SECRET ? 'set' : 'not set'}`);
if (process.env.WISE_CLIENT_SECRET) {
  const token = process.env.WISE_CLIENT_SECRET;
  console.log(`WISE_CLIENT_SECRET length: ${token.length}, first/last chars: ${token.substring(0, 4)}...${token.substring(token.length - 4)}`);
}
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
const ofxRoutes = require('./routes/ofx');
const userRoutes = require('./routes/users');
const providerInfoRoutes = require('./routes/providerInfo');
const trustpilotRatingsRoutes = require('./routes/trustpilotRatings');
const wiseCompareRoutes = require('./routes/wiseCompare'); // Import Wise compare routes
const wiseRatesRoutes = require('./routes/wiseRates'); // Import Wise rates routes
const instaremRoutes = require('./routes/instarem'); // Import InstaReM routes
const remitlyRoutes = require('./routes/remitly'); // Import Remitly routes
const revolutRoutes = require('./routes/revolut'); // Import Revolut routes
const adminRoutes = require('./routes/admin/index'); // Import admin routes
const adPartnerRoutes = require('./routes/api/adPartners'); // Import ad partners API

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 10000; // Use environment variable or default to 10000

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in .env file');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Test database connection by checking the collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('MongoDB collections:', collections.map(c => c.name).join(', '));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Continue running the app even if MongoDB fails - don't exit
  }
};

// Call the connectDB function
connectDB();

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
      "connect-src": ["'self'", "https://www.google-analytics.com", "https://*.google-analytics.com", "https://region1.google-analytics.com", "https://stats.g.doubleclick.net", "https://cdn.jsdelivr.net"]
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
app.use(require('prerender-node').set('prerenderToken', '7bhaoyM3pgdGdwgPTM7f')); // Prerender.io for SEO

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
  { source: 'Western-Union-Logo.png', dest: 'westernunion.png' },
  { source: 'InstaReM-Logo.png', dest: 'instarem.png' },
  { source: 'remitlylogo.svg', dest: 'remitly.png' },
  { source: 'revolutlogo.png', dest: 'revolut.png' },
  // Add a fallback for instarem.png in case the logo file doesn't exist
  { source: 'default-logo.png', dest: 'instarem.png', fallback: true },
  // Add a fallback for revolut.png
  { source: 'default-logo.png', dest: 'revolut.png', fallback: true }
];

logoFiles.forEach(logo => {
  const source = path.join(sourceDir, logo.source);
  const dest = path.join(providersDir, logo.dest);
  
  // Check if the destination file already exists (to avoid overwriting actual image files)
  if (fs.existsSync(dest)) {
    // Get file stats to check if it's a real image or just a placeholder
    try {
      const stats = fs.statSync(dest);
      // If file is larger than a placeholder text file (> 100 bytes), assume it's a valid image
      if (stats.size > 100) {
        console.log(`Skipping ${logo.dest} as it already exists and appears to be a valid image file (${stats.size} bytes)`);
        return;
      }
    } catch (err) {
      console.error(`Error checking file ${dest}:`, err);
    }
  }

  if (fs.existsSync(source)) {
    try {
      fs.copyFileSync(source, dest);
      console.log(`Copied ${logo.source} to ${dest}`);
    } catch (err) {
      console.error(`Error copying ${logo.source} to ${dest}:`, err);
    }
  } else {
    console.log(`Source file ${logo.source} does not exist at ${source}`);
    
    // If this is a fallback logo and the destination doesn't already exist, create a placeholder
    if (logo.fallback && !fs.existsSync(dest)) {
      try {
        // Create a minimal text file as a placeholder if real logo is missing
        fs.writeFileSync(dest, '// Placeholder logo');
        console.log(`Created placeholder for ${logo.dest}`);
      } catch (err) {
        console.error(`Error creating placeholder for ${logo.dest}:`, err);
      }
    }
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
  app.use('/images/guides', express.static(path.join(__dirname, 'client/src/assets/images/guides')));
  app.use(express.static(path.join(__dirname, 'client/public')));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});
app.use('/api/', apiLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/ofx', ofxRoutes);
app.use('/api/users', userRoutes);
app.use('/api/provider-info', providerInfoRoutes);
app.use('/api/wise/compare', wiseCompareRoutes); // Update Wise compare route path
app.use('/api/wise-rates', wiseRatesRoutes); // Add Wise rates routes
app.use('/api/instarem', instaremRoutes); // Add InstaReM routes
app.use('/api/remitly', remitlyRoutes); // Add Remitly routes
app.use('/api/revolut', revolutRoutes); // Add Revolut routes
app.use('/api/trustpilot-ratings', (req, res, next) => {
  console.log('Trustpilot ratings API called:', req.method, req.url);
  next();
}, trustpilotRatingsRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes
app.use('/api/ad-partners', adPartnerRoutes); // Add ad partners routes

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
  
  ofxRoutes.handle(req, res, next);
});

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'client', 'build', 'images')));
app.use('/images/guides', express.static(path.join(__dirname, 'client', 'src', 'assets', 'images', 'guides')));
app.use('/images/providers', express.static(path.join(__dirname, 'client', 'build', 'images', 'providers')));
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve sitemap.xml with correct content type
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/sitemap.xml'), {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
});

// Serve robots.txt with correct content type
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/robots.txt'), {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
});

// Serve Google verification file
app.get('/google-site-verification.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/google-site-verification.html'), {
    headers: {
      'Content-Type': 'text/html'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle all other routes
app.get('*', (req, res, next) => {
  // If it's an API route that doesn't exist, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  }
  
  // For non-API routes, serve the React app
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

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
const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free up the port or use a different port.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Start server
startServer();

module.exports = app; // For testing purposes