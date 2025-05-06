const { getHeroImage, needsNewHeroImage } = require('./imageManager.cjs');
const { processAndSaveImages } = require('./imageDownloader.cjs');
const path = require('path');

// Add delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Process pages in batches with delays
 * @param {Array} pages - Array of pages to process
 * @param {number} batchSize - Number of pages to process in each batch
 * @returns {Promise<void>}
 */
const processPagesInBatches = async (pages, batchSize = 3) => {
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(pages.length / batchSize)}`);
    
    for (const page of batch) {
      try {
        const needsUpdate = await needsNewHeroImage(page);
        if (!needsUpdate) {
          skippedCount++;
          continue;
        }
        
        await managePageHeroImages(page);
        updatedCount++;
        
        // Add delay between pages in the same batch
        await delay(5000);
      } catch (error) {
        console.error(`Error managing hero images for page ${page.title}:`, error);
      }
    }

    // Add a longer delay between batches
    if (i + batchSize < pages.length) {
      console.log(`\nWaiting 60 seconds before processing next batch...`);
      await delay(60000);
    }
  }
  
  console.log(`\nImage management complete:`);
  console.log(`- ${updatedCount} pages updated`);
  console.log(`- ${skippedCount} pages skipped (already have valid images)`);
};

/**
 * Manage hero images for a single page
 * @param {Object} page - Page object with title, subtitle, and image paths
 * @returns {Promise<void>}
 */
const managePageHeroImages = async (page) => {
  try {
    console.log(`\nChecking hero images for page: ${page.title}`);
    
    const needsUpdate = await needsNewHeroImage(page);
    if (!needsUpdate) {
      console.log(`✓ Page already has valid hero images`);
      return;
    }
    
    console.log('Getting new hero image...');
    const image = await getHeroImage(page);
    
    if (!image) {
      throw new Error('No image found');
    }
    
    console.log('Processing and saving images...');
    await processAndSaveImages(image.urls.regular, page.imagePath, page.imagePath.replace('.jpg', '.webp'));
    console.log('✓ Hero images updated successfully');
  } catch (error) {
    console.error(`Error managing hero images for page ${page.title}:`, error);
    throw error;
  }
};

/**
 * Manage hero images for all pages
 * @param {Array} pages - Array of pages
 * @returns {Promise<void>}
 */
const manageAllPageHeroImages = async (pages) => {
  try {
    console.log('Starting hero image management for all pages...');
    await processPagesInBatches(pages);
    console.log('All hero images have been managed successfully');
  } catch (error) {
    console.error('Error managing all hero images:', error);
    throw error;
  }
};

module.exports = {
  manageAllPageHeroImages
}; 