/**
 * Ad Service - Manages ad partners, rotation, and tracking
 * 
 * This service:
 * - Selects which ad partner to display
 * - Handles ad rotation schedule
 * - Manages impression tracking
 * - Provides a clean API for ad-related operations
 */

import axios from 'axios';
import adPartnerConfig from '../config/adPartners';

// Cache for partners data
let partnersCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Fetches ad partners from the API
 * @returns {Promise<Object>} The ad partners data
 */
export const fetchAdPartners = async () => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (partnersCache && now - lastFetchTime < CACHE_DURATION) {
    return partnersCache;
  }
  
  try {
    // Fetch from API
    const response = await axios.get('/api/ad-partners/active');
    
    if (response.data.success) {
      // Cache the results
      partnersCache = response.data.data;
      lastFetchTime = now;
      return partnersCache;
    } else {
      console.error('Error fetching ad partners:', response.data.message);
      // Fall back to static config
      return adPartnerConfig;
    }
  } catch (error) {
    console.error('Failed to fetch ad partners:', error);
    // Fall back to static config in case of error
    return adPartnerConfig;
  }
};

/**
 * Selects an appropriate ad partner based on scheduling and priority
 * @returns {string} The key of the selected ad partner
 */
export const selectAdPartner = async () => {
  const now = new Date();
  
  // Get partners data from API or cache
  const partners = await fetchAdPartners();
  const activePartners = [];
  
  // Filter for active partners based on date
  Object.entries(partners).forEach(([key, partner]) => {
    // Skip default in this first pass
    if (key === 'default') return;
    
    // Only include active partners
    if (!partner.active) return;
    
    // Check if partner campaign is active based on dates
    const startDate = partner.startDate ? new Date(partner.startDate) : null;
    const endDate = partner.endDate ? new Date(partner.endDate) : null;
    
    if (
      (!startDate || now >= startDate) &&
      (!endDate || now <= endDate)
    ) {
      activePartners.push({ key, ...partner });
    }
  });
  
  // Sort by priority (higher number = higher priority)
  activePartners.sort((a, b) => b.priority - a.priority);
  
  // Return highest priority partner or default if none are active
  return activePartners.length > 0 ? activePartners[0].key : 'default';
};

/**
 * Gets all ad partners (non-async for compatibility)
 * @returns {Object} The cached ad partners or static config
 */
export const getAdPartners = () => {
  return partnersCache || adPartnerConfig;
};

/**
 * Tracks an impression for analytics purposes
 * @param {string} partnerId The partner ID to track
 */
export const trackImpression = (partnerId) => {
  // Implement tracking logic - could be Google Analytics, custom API, etc.
  if (window.gtag) {
    window.gtag('event', 'ad_impression', {
      ad_partner: partnerId,
      page: 'homepage',
    });
  }
  
  // Could also log to your own backend
  console.log(`Ad impression: ${partnerId}`);
};

/**
 * Preloads ad assets for a specific partner to improve performance
 * @param {string} partnerId The partner ID to preload
 */
export const preloadAdAssets = async (partnerId) => {
  const partners = await fetchAdPartners();
  const partner = partners[partnerId];
  if (!partner) return;
  
  // Preload all assets for the partner
  Object.values(partner.assets || {}).forEach(asset => {
    if (asset && asset.src) {
      const img = new Image();
      img.src = asset.src;
    }
  });
  
  console.log(`Preloading assets for: ${partnerId}`);
};

export default {
  selectAdPartner,
  trackImpression,
  preloadAdAssets,
  fetchAdPartners,
  getAdPartners
}; 