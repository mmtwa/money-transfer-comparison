import React, { useState, useEffect, useMemo } from 'react';
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
            
            console.log(`Looking up rating for provider: ${providerCode}`);
            
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
              console.log(`Found rating in local map: ${trustpilotRatingsMap[providerCode]}`);
              continue;
            }
            
            // If not in local map, try to fetch from API
            const response = await fetch(`/api/trustpilot-ratings/${providerCode}`);
            const data = await response.json();
            
            if (data.success && data.data && data.data.value) {
              localRatingsMap[providerId] = data;
            } else {
              // Fallback to default ratings if API fails
              console.log(`API failed for ${providerCode}, using fallback`);
              
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
                  console.log(`Found rating for variation ${variation}: ${trustpilotRatingsMap[variation]}`);
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
            console.error(`Error fetching rating for ${providerId}:`, error);
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
