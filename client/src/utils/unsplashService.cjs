const fetch = require('node-fetch');
const fs = require('fs').promises;

const UNSPLASH_ACCESS_KEY = 'eDgN5YhUk4L2jBGYPlPdKLq7stQOq8IlFc7qd8vlwCQ';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Add delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Rate limit tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

/**
 * Wait for rate limit cooldown
 * @returns {Promise<void>}
 */
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
};

/**
 * Search for images on Unsplash with improved retry logic
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of image objects
 */
const searchImages = async (query, options = {}, retryCount = 0) => {
  try {
    // Wait for rate limit cooldown
    await waitForRateLimit();

    const params = new URLSearchParams({
      query,
      per_page: options.perPage || 1,
      orientation: options.orientation || 'landscape'
    });

    const response = await fetch(`${UNSPLASH_API_URL}/search/photos?${params}`, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    // Handle rate limiting with exponential backoff
    if (response.status === 403) {
      if (retryCount >= 5) {
        throw new Error('Maximum retry attempts reached for rate limiting');
      }
      
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
      console.log(`Rate limited, waiting ${backoffTime/1000} seconds before retry ${retryCount + 1}/5...`);
      await delay(backoffTime);
      return searchImages(query, options, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    throw error;
  }
};

/**
 * Download an image from a URL with rate limit handling
 * @param {string} imageUrl - URL of the image to download
 * @returns {Promise<Blob>} - Image blob
 */
const downloadImage = async (imageUrl) => {
  try {
    await waitForRateLimit();
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    return response.blob();
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

/**
 * Check if an image is a placeholder or doesn't exist
 * @param {string} imagePath - Path to the image
 * @returns {Promise<boolean>} - True if the image is a placeholder or doesn't exist
 */
const isPlaceholderImage = async (imagePath) => {
  try {
    // Check if the file exists
    await fs.access(imagePath);
    
    // Get file stats
    const stats = await fs.stat(imagePath);
    
    // Check if file is too small (less than 10KB) or empty
    if (stats.size < 10240 || stats.size === 0) {
      console.log(`Image ${imagePath} is too small (${stats.size} bytes)`);
      return true;
    }
    
    // Check if file is too old (more than 7 days)
    const fileAge = Date.now() - stats.mtime.getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (fileAge > sevenDays) {
      console.log(`Image ${imagePath} is too old (${Math.floor(fileAge / (24 * 60 * 60 * 1000))} days)`);
      return true;
    }
    
    console.log(`Image ${imagePath} exists and is valid`);
    return false;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Image ${imagePath} does not exist`);
    } else {
      console.error(`Error checking image ${imagePath}:`, error);
    }
    return true;
  }
};

module.exports = {
  searchImages,
  downloadImage,
  isPlaceholderImage
}; 