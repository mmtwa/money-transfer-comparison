# Google Ratings Integration

This document outlines the Google Ratings integration for Money Transfer Comparison, which fetches and displays Google review ratings for money transfer providers.

## Overview

The system fetches Google review ratings for providers using the Google Places API. The ratings are stored in a MongoDB database and updated every 3 days via a scheduled task.

## Components

1. **Server-Side**:
   - `models/ProviderRating.js`: MongoDB schema for storing provider ratings
   - `services/googleReviewService.js`: Service for fetching ratings from Google Places API
   - `routes/googleRatings.js`: API endpoints for accessing rating data
   - `scripts/updateGoogleRatings.js`: Script to update all provider ratings

2. **Client-Side**:
   - `client/src/components/ui/GoogleRating.js`: React component to display Google ratings
   - `client/src/components/ui/GoogleRating.css`: Styling for the Google Rating component
   - Integration with `ProviderCard.js` to display ratings

## Setup

1. Obtain a Google Places API key from the [Google Cloud Console](https://console.cloud.google.com)
2. Add the API key to your `.env` file:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```
3. Install the scheduled task by running the batch script as administrator:
   ```
   scripts/schedule-google-ratings.bat
   ```

## API Endpoints

- `GET /api/google-ratings`: Get ratings for all providers
- `GET /api/google-ratings/:providerName`: Get rating for a specific provider

## Scheduled Updates

The ratings are updated every 3 days via a Windows scheduled task. The task runs at 3:00 AM to minimize impact on other services.

To view or modify the task:
1. Open Task Scheduler (`taskschd.msc`)
2. Look for "MoneyTransferComparison_GoogleRatings" task

## Manual Update

To manually update all provider ratings, run:

```
node scripts/updateGoogleRatings.js
```

## Troubleshooting

Common issues:

1. **API Key Not Working**: Ensure your Google Places API key has the Places API enabled and has proper billing set up.

2. **Rate Limits**: Google Places API has a rate limit. If you hit it, the script will log an error.

3. **No Results Found**: Some providers may not have a Google Business listing. The system will log these cases.

## Terms of Service Compliance

Ensure compliance with Google's Terms of Service:

1. Only cache reviews for a maximum of 7 days
2. Display "Google" attribution with the rating
3. Link to Google Maps when displaying the rating 