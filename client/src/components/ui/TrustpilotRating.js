import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { trustpilotRatingsMap } from '../../utils/trustpilotRatingsMap';

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

// Set a fallback rating for providers to ensure we can display something
const fallbackRatings = {
  'xe': 4.2,
  'instarem': 4.3,
  'wise': 4.1,
  'westernunion': 3.9,
  'ofx': 4.1,
  'torfx': 4.4,
  'pandaremit': 4.1,
  'profee': 4.4,
  'remitly': 4.5,
  'regencyfx': 4.9
};

const TrustpilotRating = ({ providerName, preloadedRating, onRatingDetermined, compact = false }) => {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debug logging - original provider name
    console.log(`TrustpilotRating component for provider: ${providerName}`);

    // If we have a preloaded rating, use it directly
    if (preloadedRating) {
      console.log(`Preloaded rating for ${providerName}:`, preloadedRating);
      
      let ratingValue = null;
      
      // Check if preloadedRating has a data property with value
      if (preloadedRating.data && typeof preloadedRating.data.value === 'number') {
        ratingValue = preloadedRating.data;
      } 
      // Check if preloadedRating has a value property directly
      else if (typeof preloadedRating.value === 'number') {
        ratingValue = preloadedRating;
      }
      
      // Only use the preloaded rating if it's valid (has a value and preferably not a fallback)
      if (ratingValue && typeof ratingValue.value === 'number') {
        setRating(ratingValue);
        setLoading(false);
        
        // Report the rating value back to parent component for sorting purposes
        if (typeof onRatingDetermined === 'function') {
          onRatingDetermined(ratingValue.value);
        }
        
        // Also update the component cache
        if (providerName) {
          const normalizedName = providerName.toLowerCase()
            .replace(/^provider-/, '')
            .replace(/[^a-z0-9]/g, '')
            .trim();
          
          console.log(`Normalized provider name: ${providerName} → ${normalizedName}`);
          
          ratingCache.set(normalizedName, {
            rating: ratingValue,
            timestamp: Date.now()
          });
        }
        
        return; // Skip the API call
      } else {
        console.log(`Preloaded rating for ${providerName} is invalid:`, preloadedRating);
      }
    }
    
    // Check if we can use our local trustpilotRatingsMap
    if (providerName) {
      const normalizedName = providerName.toLowerCase()
        .replace(/^provider-/, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
      
      console.log(`Checking trustpilotRatingsMap for ${normalizedName}`);
      
      if (trustpilotRatingsMap[normalizedName]) {
        const mapRating = {
          value: trustpilotRatingsMap[normalizedName],
          source: 'trustpilotRatingsMap',
          lastUpdated: new Date(),
          isFallback: false
        };
        
        console.log(`Found rating in trustpilotRatingsMap: ${mapRating.value}`);
        setRating(mapRating);
        setLoading(false);
        
        if (typeof onRatingDetermined === 'function') {
          onRatingDetermined(mapRating.value);
        }
        
        return; // Skip the API call
      }
      
      // Try providerId format
      const providerIdFormat = `provider-${normalizedName}`;
      if (trustpilotRatingsMap[providerIdFormat]) {
        const mapRating = {
          value: trustpilotRatingsMap[providerIdFormat],
          source: 'trustpilotRatingsMap (provider-format)',
          lastUpdated: new Date(),
          isFallback: false
        };
        
        console.log(`Found rating in trustpilotRatingsMap with provider- prefix: ${mapRating.value}`);
        setRating(mapRating);
        setLoading(false);
        
        if (typeof onRatingDetermined === 'function') {
          onRatingDetermined(mapRating.value);
        }
        
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
        
        console.log(`Normalized provider name: ${providerName} → ${normalizedName}`);
        
        // Check for hardcoded rating first
        if (HARDCODED_RATINGS[normalizedName]) {
          console.log(`Using hardcoded rating for ${normalizedName}`);
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
          console.log(`Using cached rating for ${normalizedName}:`, rating);
          
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
            console.log(`Cache for ${normalizedName} is too old, removing`);
            ratingCache.delete(normalizedName);
          }
        }
        
        // As a last resort, use trustpilotRatingsMap again with more variations
        if (trustpilotRatingsMap[normalizedName]) {
          const mapRating = {
            value: trustpilotRatingsMap[normalizedName],
            source: 'trustpilotRatingsMap (fallback)',
            lastUpdated: new Date(),
            isFallback: false
          };
          
          console.log(`Found rating in trustpilotRatingsMap (fallback): ${mapRating.value}`);
          setRating(mapRating);
          setLoading(false);
          
          if (typeof onRatingDetermined === 'function') {
            onRatingDetermined(mapRating.value);
          }
          
          return;
        }
        
        // If we reach here, set error - we couldn't find a rating
        setError('Rating not available');
        setLoading(false);
      } catch (error) {
        console.error(`Error in TrustpilotRating for ${providerName}:`, error);
        setError('Error loading rating');
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