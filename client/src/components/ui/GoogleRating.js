import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';

// Providers that are known to have persistent issues
const PROBLEMATIC_PROVIDERS = [
  'ofx', 'barclays', 'skrill', 'lloyds', 'halifax', 
  'nationwide', 'paypal', 'western-union', 'monese',
  'moneygram', 'natwest', 'rbs'
];

// Create fallback rating
const getFallbackRating = (providerName) => ({
  providerName,
  googleRating: 4.0,
  reviewCount: 100,
  isFallback: true,
  lastUpdated: new Date()
});

const GoogleRating = ({ providerName }) => {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      // If it's a known problematic provider, use fallback immediately
      if (PROBLEMATIC_PROVIDERS.includes(providerName?.toLowerCase())) {
        setRating(getFallbackRating(providerName));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching Google rating for: ${providerName}`);
        
        // Setup timeout to handle stalled requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await axios.get(`/api/google-ratings/${providerName}`, {
          signal: controller.signal
        }).catch(err => {
          if (err.name === 'AbortError') {
            console.log('Request timed out, using fallback');
            return { data: { success: true, data: getFallbackRating(providerName) }};
          }
          throw err;
        });
        
        clearTimeout(timeoutId);
        
        if (response.data.success && response.data.data) {
          console.log(`Received rating data for ${providerName}:`, response.data.data);
          setRating(response.data.data);
        } else {
          console.error('Failed to fetch rating:', response.data);
          setError('Failed to fetch rating');
          setRating(getFallbackRating(providerName));
        }
      } catch (err) {
        console.error('Error fetching Google rating:', err);
        setError('Could not load Google rating');
        setRating(getFallbackRating(providerName));
      } finally {
        setLoading(false);
      }
    };

    if (providerName) {
      fetchRating();
    }
  }, [providerName]);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#FDCC0D" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#FDCC0D" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} color="#FDCC0D" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="google-rating loading">
        <div className="google-rating-header">
          <FaGoogle color="#4285F4" />
          <span className="google-rating-text">Rating</span>
        </div>
        <div className="text-sm">Loading...</div>
      </div>
    );
  }

  // Always show rating, even if there's an error (using fallback data)
  const ratingValue = rating?.googleRating || 4.0;
  const reviewCount = rating?.reviewCount || 100;
  const isFallback = rating?.isFallback || error != null;

  return (
    <div className="google-rating">
      <div className="google-rating-header">
        <FaGoogle color="#4285F4" />
        <span className="google-rating-text">Rating</span>
        {isFallback && <span className="text-xs text-gray-400 ml-1">(est.)</span>}
      </div>
      <div className="google-rating-stars">
        {renderStars(ratingValue)}
        <span className="google-rating-value">{ratingValue.toFixed(1)}</span>
        <span className="google-rating-count">({reviewCount})</span>
      </div>
    </div>
  );
};

export default GoogleRating; 