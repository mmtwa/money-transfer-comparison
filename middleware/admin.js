// middleware/admin.js
/**
 * Admin middleware - Verifies that the user is an admin
 * Must be used after the auth middleware
 */
module.exports = (req, res, next) => {
    // Check if user exists and is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    next();
  };