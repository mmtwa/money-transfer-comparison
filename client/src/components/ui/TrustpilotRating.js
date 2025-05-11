import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// In-memory component cache to reduce API calls
const ratingCache = new Map();

// Special treatment for providers that have hard-coded ratings
const HARDCODED_RATINGS = {
  // TorFX should use hardcoded rating to avoid duplicate requests
  'torfx': {
    value: 4.4,
    source: 'Money Transfer Comparison',
    lastUpdated: new Date().toISOString(),
    isFallback: false
  }
};

const TrustpilotRating = ({ providerName, preloadedRating, onRatingDetermined, compact = false }) => {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have a preloaded rating, use it directly
    if (preloadedRating) {
      // Only use the preloaded rating if it's valid (has a value and not a fallback)
      if (preloadedRating.value && !preloadedRating.isFallback) {
        setRating(preloadedRating);
        setLoading(false);
        
        // Report the rating value back to parent component for sorting purposes
        if (typeof onRatingDetermined === 'function') {
          onRatingDetermined(preloadedRating.value);
        }
        
        // Also update the component cache
        if (providerName) {
          const normalizedName = providerName.toLowerCase()
            .replace(/^provider-/, '')
            .replace(/[^a-z0-9]/g, '')
            .trim();
          
          ratingCache.set(normalizedName, {
            rating: preloadedRating,
            timestamp: Date.now()
          });
        }
        
        return; // Skip the API call
      } else {
        // If preloaded rating is a fallback, treat it as no rating
        setError('No official rating available');
        setLoading(false);
        return; // Skip the API call
      }
    }

    const fetchRating = async () => {
      if (!providerName) {
        setError('No provider name provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Clean and normalize the provider name
        const normalizedName = providerName.toLowerCase()
          .replace(/^provider-/, '') // Remove 'provider-' prefix if present
          .replace(/[^a-z0-9]/g, '') // Remove special characters
          .trim();
        
        // Check for hardcoded rating first
        if (HARDCODED_RATINGS[normalizedName]) {
          const hardcodedRating = HARDCODED_RATINGS[normalizedName];
          setRating(hardcodedRating);
          setLoading(false);
          
          // Report the hardcoded rating value back to parent component for sorting purposes
          if (typeof onRatingDetermined === 'function' && hardcodedRating.value) {
            onRatingDetermined(hardcodedRating.value);
          }
          return;
        }
        
        // Check component cache first
        if (ratingCache.has(normalizedName)) {
          const { rating, timestamp } = ratingCache.get(normalizedName);
          
          // If the cache is not too old (less than 1 hour)
          if (Date.now() - timestamp < 60 * 60 * 1000) {
            setRating(rating);
            setLoading(false);
            
            // Report cached rating value to parent component
            if (typeof onRatingDetermined === 'function' && rating.value) {
              onRatingDetermined(rating.value);
            }
            return;
          } else {
            // Cache is too old, remove it
            ratingCache.delete(normalizedName);
          }
        }
        
        // Max retries and initial retry count
        const maxRetries = 2; // Reduced from 3 to 2
        let retryCount = 0;
        let fetchSuccessful = false;
        
        // Helper function for delay with exponential backoff
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        // Try to fetch with retries
        while (retryCount <= maxRetries && !fetchSuccessful) {
          try {
            // Add delay for retries
            if (retryCount > 0) {
              const backoffTime = Math.pow(2, retryCount) * 1000; // 2s, 4s
              await delay(backoffTime);
            }
            
            // Setup timeout to handle stalled requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced to 8 seconds
            
            const response = await axios.get(`/api/trustpilot-ratings/${normalizedName}`, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }).catch(err => {
              if (err.name === 'AbortError') {
                throw new Error('Request timed out');
              }
              if (err.response && err.response.status === 429) {
                // Handle rate limit errors
                throw new Error('Rate limited');
              }
              if (err.response) {
                throw new Error(err.response.data.message || 'Failed to fetch rating');
              }
              throw err;
            });
            
            clearTimeout(timeoutId);
            
            if (response.data.success && response.data.data && response.data.data.value) {
              const ratingData = response.data.data;
              
              // Update component cache
              ratingCache.set(normalizedName, {
                rating: ratingData,
                timestamp: Date.now()
              });
              
              setRating(ratingData);
              fetchSuccessful = true;
              
              // Report the fetched rating value back to parent component
              if (typeof onRatingDetermined === 'function' && ratingData.value) {
                onRatingDetermined(ratingData.value);
              };
            } else {
              if (response.data.message) {
                setError(response.data.message);
              } else {
                setError('No rating available');
              }
              fetchSuccessful = true; // Consider this a successful response that just has no rating
            }
          } catch (err) {
            // Handle rate limit errors specially
            if (err.response && err.response.status === 429) {
              // On rate limit, stop retrying and set error
              setError('Rating temporarily unavailable');
              fetchSuccessful = true; // Stop retries
            } else {
              // On last retry, set the error
              if (retryCount === maxRetries) {
                setError(err.message || 'No rating available');
              }
              
              retryCount++;
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [providerName, preloadedRating]);

  // Render star rating
  const renderStars = (rating) => {
    if (!rating || typeof rating !== 'number') {
      console.error('Invalid rating value:', rating);
      return null;
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#00b67a" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#00b67a" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} color="#00b67a" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className={`trustpilot-rating loading ${compact ? 'text-xs' : ''}`}>
        <div className="trustpilot-rating-header">
          <FaStar color="#00b67a" size={compact ? 10 : 14} />
          <span className="trustpilot-rating-text">Rating</span>
        </div>
        <div className={compact ? "text-xs" : "text-sm"}>Loading...</div>
      </div>
    );
  }

  if (error || !rating) {
    return (
      <div className={`trustpilot-rating error ${compact ? 'text-xs' : ''}`}>
        <div className="trustpilot-rating-header">
          <FaStar color="#00b67a" size={compact ? 10 : 14} />
          <span className="trustpilot-rating-text">Rating</span>
        </div>
        <div className={compact ? "text-xs text-gray-400" : "text-sm text-gray-400"}>N/A</div>
      </div>
    );
  }

  return (
    <div className={`trustpilot-rating ${compact ? 'text-xs' : ''}`}>
      {!compact && (
        <div className="trustpilot-rating-header">
          <FaStar color="#00b67a" />
          <span className="trustpilot-rating-text">Rating</span>
        </div>
      )}
      <div className="trustpilot-rating-stars">
        {renderStars(rating.value)}
        <span className="trustpilot-rating-value">{rating.value.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default TrustpilotRating; 