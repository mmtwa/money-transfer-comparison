
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
