const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const ProviderRating = require('../models/ProviderRating');

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Check if API key is available and log warning if not
if (!GOOGLE_PLACES_API_KEY) {
  console.warn('GOOGLE_PLACES_API_KEY is not set in .env file. Google Places API will not work.');
}

/**
 * Service to fetch and manage Google review ratings for providers
 */
class GoogleReviewService {
  /**
   * Find a place ID using the provider name
   * @param {string} providerName - The name of the provider
   * @returns {Promise<string|null>} - The place ID or null if not found
   */
  async findPlaceId(providerName) {
    try {
      // Check if API key is available
      if (!GOOGLE_PLACES_API_KEY) {
        console.error('Google Places API key is not set');
        return null;
      }

      // Clean the provider name for search - Use a simpler query for Torfx
      let searchQuery;
      if (providerName.toLowerCase() === 'torfx') {
        searchQuery = 'Torfx'; // Simpler query for Torfx
      } else {
        searchQuery = `${providerName} money transfer`;
      }
      console.log(`Searching for place ID for: "${searchQuery}"`);
      
      const response = await axios.get(`${API_BASE_URL}/findplacefromtext/json`, {
        params: {
          input: searchQuery,
          inputtype: 'textquery',
          fields: 'place_id,name',
          key: GOOGLE_PLACES_API_KEY
        }
      });
      
      if (response.data.status === 'OK' && response.data.candidates.length > 0) {
        console.log(`Found place ID for ${providerName}: ${response.data.candidates[0].place_id}`);
        return response.data.candidates[0].place_id;
      }
      
      console.log(`No place found for provider: ${providerName}`);
      return null;
    } catch (error) {
      console.error(`Error finding place ID for ${providerName}:`, error.message);
      if (error.response) {
        console.error('Google API response:', error.response.data);
      }
      return null;
    }
  }
  
  /**
   * Get place details including rating and review count
   * @param {string} placeId - The Google Place ID
   * @returns {Promise<Object|null>} - Place details or null if error
   */
  async getPlaceDetails(placeId) {
    try {
      // Check if API key is available
      if (!GOOGLE_PLACES_API_KEY) {
        console.error('Google Places API key is not set');
        return null;
      }

      console.log(`Getting details for place ID: ${placeId}`);
      
      const response = await axios.get(`${API_BASE_URL}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,rating,user_ratings_total',
          key: GOOGLE_PLACES_API_KEY
        }
      });
      
      if (response.data.status === 'OK') {
        const { name, rating, user_ratings_total } = response.data.result;
        console.log(`Found details for ${name}: Rating ${rating}, Reviews ${user_ratings_total}`);
        return {
          name,
          rating: rating || 0,
          reviewCount: user_ratings_total || 0
        };
      }
      
      console.log(`No details found for place ID: ${placeId}`);
      return null;
    } catch (error) {
      console.error(`Error getting place details for ${placeId}:`, error.message);
      if (error.response) {
        console.error('Google API response:', error.response.data);
      }
      return null;
    }
  }
  
  /**
   * Update or create a provider rating record
   * @param {string} providerName - The name of the provider
   * @returns {Promise<Object|null>} - Updated provider rating or null if error
   */
  async updateProviderRating(providerName) {
    try {
      // Step 1: Find the place ID
      const placeId = await this.findPlaceId(providerName);
      if (!placeId) {
        console.log(`Could not find place ID for provider: ${providerName}`);
        // Create a mock rating with fallback data
        return this.createFallbackRating(providerName);
      }
      
      // Step 2: Get place details
      const details = await this.getPlaceDetails(placeId);
      if (!details) {
        console.log(`Could not get details for place ID: ${placeId}`);
        // Create a mock rating with fallback data
        return this.createFallbackRating(providerName, placeId);
      }
      
      // Step 3: Update or create the rating record
      const ratingData = {
        providerName,
        placeId,
        googleRating: details.rating,
        reviewCount: details.reviewCount,
        lastUpdated: new Date()
      };
      
      // Update if exists, create if not
      const rating = await ProviderRating.findOneAndUpdate(
        { providerName },
        ratingData,
        { new: true, upsert: true }
      );
      
      console.log(`Updated rating for ${providerName}: ${details.rating} (${details.reviewCount} reviews)`);
      return rating;
    } catch (error) {
      console.error(`Error updating rating for ${providerName}:`, error.message);
      // Create a mock rating with fallback data if there's a database error
      return this.createFallbackRating(providerName);
    }
  }
  
  /**
   * Create fallback rating when API or database fails
   * @param {string} providerName - The name of the provider 
   * @param {string} placeId - Optional place ID if already retrieved
   * @returns {Object} - Fallback rating object
   */
  createFallbackRating(providerName, placeId = 'mock') {
    console.log(`Creating fallback rating for ${providerName}`);
    return {
      providerName,
      placeId,
      googleRating: 4.0, // Default fallback rating
      reviewCount: 100,  // Default fallback review count
      lastUpdated: new Date(),
      isFallback: true
    };
  }
  
  /**
   * Get Google rating for a provider
   * @param {string} providerName - The name of the provider
   * @returns {Promise<Object|null>} - Provider rating or null if not found
   */
  async getProviderRating(providerName) {
    try {
      console.log(`Getting rating for provider: ${providerName}`);
      
      // Try to find existing rating in database
      let rating = await ProviderRating.findOne({ providerName });
      
      // If rating is older than 7 days, update it
      if (!rating || (Date.now() - rating.lastUpdated) > 7 * 24 * 60 * 60 * 1000) {
        console.log(`Rating for ${providerName} is outdated or missing, fetching new one`);
        rating = await this.updateProviderRating(providerName);
      }
      
      return rating;
    } catch (error) {
      console.error(`Error getting rating for ${providerName}:`, error.message);
      // Return fallback rating if database query fails
      return this.createFallbackRating(providerName);
    }
  }
  
  /**
   * Update all provider ratings
   * @param {Array<string>} providerNames - Array of provider names
   * @returns {Promise<Array>} - Array of updated provider ratings
   */
  async updateAllProviderRatings(providerNames) {
    const results = [];
    
    // Process providers sequentially to avoid rate limits
    for (const name of providerNames) {
      try {
        const result = await this.updateProviderRating(name);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Error updating rating for ${name}:`, error.message);
        // Continue with next provider even if one fails
      }
      
      // Add a delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}

module.exports = new GoogleReviewService(); 