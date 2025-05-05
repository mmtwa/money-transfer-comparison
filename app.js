const googleRatingsRouter = require('./routes/googleRatings');
const trustpilotRatingsRouter = require('./routes/trustpilotRatings');

// Add the routes
app.use('/api/google-ratings', googleRatingsRouter);
app.use('/api/trustpilot-ratings', trustpilotRatingsRouter); 