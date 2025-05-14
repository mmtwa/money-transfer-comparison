const mongoose = require('mongoose');
const TrustpilotRating = require('./models/TrustpilotRating');
const fs = require('fs');
require('dotenv').config();

// This script will create a frontend ratings mapper file for the client
async function createFrontendRatingsMapper() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Get all ratings
    const allRatings = await TrustpilotRating.find({});
    console.log(`Found ${allRatings.length} ratings in database`);
    
    // Create a mapper object that will be used in the frontend
    const ratingsMapper = {};
    allRatings.forEach(rating => {
      // Store the rating with different key formats the frontend might use
      ratingsMapper[rating.providerName] = rating.rating;
      ratingsMapper[`provider-${rating.providerName}`] = rating.rating;
      
      // Add some common variations
      if (rating.providerName === 'xe') {
        ratingsMapper['xemoney'] = rating.rating;
        ratingsMapper['xe-money'] = rating.rating;
      }
      if (rating.providerName === 'regencyfx') {
        ratingsMapper['regency'] = rating.rating;
        ratingsMapper['regency-fx'] = rating.rating;
        ratingsMapper['regency fx'] = rating.rating;
      }
      if (rating.providerName === 'pandaremit') {
        ratingsMapper['panda'] = rating.rating;
        ratingsMapper['panda-remit'] = rating.rating;
        ratingsMapper['panda remit'] = rating.rating;
      }
      if (rating.providerName === 'torfx') {
        ratingsMapper['tor'] = rating.rating;
        ratingsMapper['tor-fx'] = rating.rating;
        ratingsMapper['tor fx'] = rating.rating;
      }
    });
    
    // Create a JavaScript file with the ratings mapper
    const jsContent = `// Auto-generated ratings mapper
// Created on ${new Date().toISOString()}
// This file helps the frontend map provider names to their ratings

export const trustpilotRatingsMap = ${JSON.stringify(ratingsMapper, null, 2)};
`;

    // Write to the client directory
    const outputPath = './client/src/utils/trustpilotRatingsMap.js';
    fs.writeFileSync(outputPath, jsContent);
    console.log(`Ratings mapper written to ${outputPath}`);
    
    // Create a patch for ResultsView.js to use the ratings mapper
    console.log('Creating patch for ResultsView.js...');
    
    const patchContent = `import React, { useState, useEffect, useMemo } from 'react';
import { trustpilotRatingsMap } from '../utils/trustpilotRatingsMap';

// ... existing imports ...

const ResultsView = ({ searchData, onBackToSearch }) => {
  // ... existing code ...

  // Load trustpilot ratings
  useEffect(() => {
    if (providerResults?.length > 0) {
      setRatingsLoading(true);
      
      // Function to fetch ratings from API
      const fetchRatings = async () => {
        const localRatingsMap = {};
        
        // Loop through all providers
        for (const provider of providerResults) {
          const providerId = provider.providerId;
          
          if (!providerId) continue;
          
          try {
            // Get provider code or ID for rating lookup
            const providerCode = (
              provider.providerCode || 
              provider.code || 
              providerId.replace('provider-', '')
            ).toLowerCase();
            
            console.log(\`Looking up rating for provider: \${providerCode}\`);
            
            // First check our local ratings map
            if (trustpilotRatingsMap[providerCode]) {
              localRatingsMap[providerId] = {
                success: true,
                data: {
                  value: trustpilotRatingsMap[providerCode],
                  source: 'Local ratings map',
                  lastUpdated: new Date(),
                  isFallback: false
                }
              };
              console.log(\`Found rating in local map: \${trustpilotRatingsMap[providerCode]}\`);
              continue;
            }
            
            // If not in local map, try to fetch from API
            const response = await fetch(\`/api/trustpilot-ratings/\${providerCode}\`);
            const data = await response.json();
            
            if (data.success && data.data && data.data.value) {
              localRatingsMap[providerId] = data;
            } else {
              // Fallback to default ratings if API fails
              console.log(\`API failed for \${providerCode}, using fallback\`);
              
              // Attempt to find in our map using variations
              const variations = [
                providerCode,
                providerId,
                providerId.replace('provider-', ''),
                providerId.toLowerCase()
              ];
              
              let found = false;
              for (const variation of variations) {
                if (trustpilotRatingsMap[variation]) {
                  localRatingsMap[providerId] = {
                    success: true,
                    data: {
                      value: trustpilotRatingsMap[variation],
                      source: 'Local variation map',
                      lastUpdated: new Date(),
                      isFallback: false
                    }
                  };
                  console.log(\`Found rating for variation \${variation}: \${trustpilotRatingsMap[variation]}\`);
                  found = true;
                  break;
                }
              }
              
              // Final fallback to a reasonable default
              if (!found) {
                localRatingsMap[providerId] = {
                  success: true,
                  data: {
                    value: 4.0,
                    source: 'Default rating',
                    lastUpdated: new Date(),
                    isFallback: true
                  }
                };
              }
            }
          } catch (error) {
            console.error(\`Error fetching rating for \${providerId}:\`, error);
            // Use a default rating for errors
            localRatingsMap[providerId] = {
              success: true,
              data: {
                value: 4.0,
                source: 'Default on error',
                lastUpdated: new Date(),
                isFallback: true
              }
            };
          }
        }
        
        setTrustpilotRatings(localRatingsMap);
        setRatingsLoading(false);
      };

      fetchRatings();
    }
  }, [providerResults]);
  
  // ... rest of the component ...
};

export default ResultsView;
`;

    // Write the example patch
    const patchPath = './ResultsView.patch.js';
    fs.writeFileSync(patchPath, patchContent);
    console.log(`Example patch written to ${patchPath}`);
    
    console.log('\nInstructions:');
    console.log('1. Copy the generated trustpilotRatingsMap.js file to client/src/utils/');
    console.log('2. Update ResultsView.js to use the map similar to the example patch');
    console.log('3. Restart the server to apply changes');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createFrontendRatingsMapper(); 