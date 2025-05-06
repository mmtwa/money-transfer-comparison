const { searchImages, downloadImage, isPlaceholderImage } = require('./unsplashService.cjs');

/**
 * Generate a search query from page title and subtitle
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle
 * @returns {string} - Search query
 */
const generateSearchQuery = (title, subtitle) => {
  // Extract country name for country-specific guides
  if (title.toLowerCase().includes('send money to')) {
    const country = title.toLowerCase().split('send money to ')[1];
    return `${country} landmark cityscape architecture culture`;
  }

  // Handle corridor-specific guides
  if (title.includes('Corridor')) {
    const corridorParts = title.replace(' Corridor', '').split(' ');
    return `${corridorParts.join(' ')} international business finance cityscape`;
  }

  // Handle value-based guides
  if (title.includes('Value')) {
    return 'international money transfer finance business professional office';
  }

  // Handle specific guide types
  const titleLower = title.toLowerCase();
  if (titleLower.includes('business')) {
    return 'international business finance office professional corporate';
  }
  if (titleLower.includes('property') || titleLower.includes('real estate')) {
    return 'international real estate property luxury home apartment';
  }
  if (titleLower.includes('digital nomad')) {
    return 'digital nomad laptop travel work remote beach cafe';
  }
  if (titleLower.includes('exchange rate')) {
    return 'currency exchange finance global market stock trading';
  }
  if (titleLower.includes('family') || titleLower.includes('remittance')) {
    return 'family together multicultural international happy home';
  }
  if (titleLower.includes('security') || titleLower.includes('secure')) {
    return 'cybersecurity finance technology protection secure data';
  }
  if (titleLower.includes('study') || titleLower.includes('student')) {
    return 'international student university campus education library';
  }
  if (titleLower.includes('convenience')) {
    return 'mobile payment smartphone easy digital wallet';
  }
  if (titleLower.includes('cost') || titleLower.includes('fee')) {
    return 'money saving finance calculator budget planning';
  }
  if (titleLower.includes('service')) {
    return 'customer service support help desk professional office';
  }
  if (titleLower.includes('transfer')) {
    if (titleLower.includes('regular') || titleLower.includes('periodic')) {
      return 'recurring payment schedule calendar finance planning';
    }
    if (titleLower.includes('occasional') || titleLower.includes('one time')) {
      return 'single payment transfer finance digital banking';
    }
  }

  // Default to a professional finance-related image if no specific category matches
  return 'international money transfer finance professional modern';
};

/**
 * Get a hero image for a page
 * @param {Object} page - Page object with title and subtitle
 * @returns {Promise<Object>} - Image object with URL and other metadata
 */
const getHeroImage = async (page) => {
  try {
    const query = generateSearchQuery(page.title, page.subtitle);
    const images = await searchImages(query, {
      perPage: 1,
      orientation: 'landscape'
    });

    if (!images || images.length === 0) {
      throw new Error(`No images found for query: ${query}`);
    }

    return images[0];
  } catch (error) {
    console.error('Error getting hero image:', error);
    throw error;
  }
};

/**
 * Check if a page needs a new hero image
 * @param {Object} page - Page object with image path
 * @returns {Promise<boolean>} - True if a new image is needed
 */
const needsNewHeroImage = async (page) => {
  try {
    return await isPlaceholderImage(page.imagePath);
  } catch (error) {
    console.error('Error checking if page needs new hero image:', error);
    return false;
  }
};

module.exports = {
  getHeroImage,
  needsNewHeroImage
}; 