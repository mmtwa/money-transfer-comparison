/**
 * CORS middleware to allow cross-origin requests
 */
const corsMiddleware = (req, res, next) => {
  // In production, we only need to handle CORS for external API calls (if any)
  // For serving the React app from the same domain, CORS is not needed
  if (process.env.NODE_ENV === 'production') {
    // If needed, add specific production origins here
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    // Allow specific origins in development
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      // For any other origin in development
      res.header('Access-Control-Allow-Origin', '*');
    }
  }
  
  // Allow credentials
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Allow necessary headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  // Allow methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};

module.exports = corsMiddleware; 