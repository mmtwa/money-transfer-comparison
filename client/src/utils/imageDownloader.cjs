const { downloadImage } = require('./unsplashService.cjs');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Ensure a directory exists, create it if it doesn't
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<void>}
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
};

/**
 * Download and save an image from Unsplash
 * @param {string} imageUrl - URL of the image to download
 * @param {string} outputPath - Path where the image should be saved
 * @param {Object} options - Image processing options
 * @returns {Promise<void>}
 */
const downloadAndSaveImage = async (imageUrl, outputPath, options = {}) => {
  try {
    // Create directory if it doesn't exist
    await ensureDirectoryExists(path.dirname(outputPath));

    // Download the image
    const imageBlob = await downloadImage(imageUrl);
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // Process the image with sharp
    let sharpImage = sharp(buffer);

    // Apply image processing options
    if (options.width) {
      sharpImage = sharpImage.resize(options.width);
    }
    if (options.quality) {
      sharpImage = sharpImage.jpeg({ quality: options.quality });
    }

    // Save the processed image
    await sharpImage.toFile(outputPath);
  } catch (error) {
    console.error('Error downloading and saving image:', error);
    throw error;
  }
};

/**
 * Convert an image to WebP format
 * @param {string} inputPath - Path to the input image
 * @param {string} outputPath - Path where the WebP image should be saved
 * @param {Object} options - WebP conversion options
 * @returns {Promise<void>}
 */
const convertToWebP = async (inputPath, outputPath, options = {}) => {
  try {
    // Create directory if it doesn't exist
    await ensureDirectoryExists(path.dirname(outputPath));

    // Convert to WebP
    await sharp(inputPath)
      .webp({
        quality: options.quality || 80,
        effort: options.effort || 4
      })
      .toFile(outputPath);
  } catch (error) {
    console.error('Error converting to WebP:', error);
    throw error;
  }
};

/**
 * Process and save both JPG and WebP versions of an image
 * @param {string} imageUrl - URL of the image to download
 * @param {string} jpgPath - Path where the JPG image should be saved
 * @param {string} webpPath - Path where the WebP image should be saved
 * @param {Object} options - Image processing options
 * @returns {Promise<void>}
 */
const processAndSaveImages = async (imageUrl, jpgPath, webpPath, options = {}) => {
  try {
    // Create directories if they don't exist
    await ensureDirectoryExists(path.dirname(jpgPath));
    await ensureDirectoryExists(path.dirname(webpPath));

    // Remove existing -hero suffix if present
    const baseJpgPath = jpgPath.replace('-hero.jpg', '.jpg');
    const baseWebpPath = webpPath.replace('-hero.webp', '.webp');

    // Download and save JPG with -hero-optimized suffix
    await downloadAndSaveImage(imageUrl, baseJpgPath.replace('.jpg', '-hero-optimized.jpg'), {
      width: options.width || 1920,
      quality: options.quality || 80
    });

    // Convert to WebP with -hero-new suffix
    await convertToWebP(baseJpgPath.replace('.jpg', '-hero-optimized.jpg'), baseWebpPath.replace('.webp', '-hero-new.webp'), {
      quality: options.webpQuality || 80
    });
  } catch (error) {
    console.error('Error processing and saving images:', error);
    throw error;
  }
};

module.exports = {
  downloadAndSaveImage,
  convertToWebP,
  processAndSaveImages
}; 