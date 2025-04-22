/**
 * Ad Asset Optimization Script
 * 
 * This script optimizes ad images for better web performance by:
 * - Converting images to WebP format for better compression
 * - Resizing images to appropriate dimensions for each breakpoint
 * - Optimizing image quality
 * 
 * Dependencies: 
 * - sharp (for image processing)
 * - glob (for file pattern matching)
 * 
 * npm install --save-dev sharp glob
 * 
 * Usage:
 * node optimizeAdAssets.js [partnerId]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// This is just a placeholder - in a real implementation you would use sharp for image processing
// const sharp = require('sharp');

// Configuration
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const PARTNERS_DIR = path.join(PUBLIC_DIR, 'partners');
const CONFIG_FILE = path.resolve(__dirname, '../config/adPartners.js');

// Image size specifications
const SIZES = {
  mobile: { width: 640, height: 1200, quality: 80 },
  tablet: { width: 1024, height: 1200, quality: 80 },
  desktop: { width: 1920, height: 1080, quality: 80 }
};

/**
 * Main function to optimize ad assets
 */
async function optimizeAdAssets() {
  try {
    // Get command line arguments
    const partnerId = process.argv[2];
    
    let directories = [];
    
    if (partnerId) {
      // If partner ID provided, only process that partner's directory
      const partnerDir = path.join(PARTNERS_DIR, partnerId);
      if (fs.existsSync(partnerDir)) {
        directories.push(partnerDir);
      } else {
        console.error(`Error: Partner directory not found: ${partnerDir}`);
        process.exit(1);
      }
    } else {
      // Otherwise process all partner directories
      if (!fs.existsSync(PARTNERS_DIR)) {
        console.error(`Error: Partners directory not found: ${PARTNERS_DIR}`);
        process.exit(1);
      }
      
      // Get all subdirectories in the partners directory
      const partnerDirs = fs.readdirSync(PARTNERS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(PARTNERS_DIR, dirent.name));
      
      directories = partnerDirs;
      
      // Also process the root public directory for default assets
      directories.push(PUBLIC_DIR);
    }
    
    console.log(`Found ${directories.length} directories to process`);
    
    // Process each directory
    for (const directory of directories) {
      await processDirectory(directory);
    }
    
    console.log('✅ Ad assets optimization complete!');
  } catch (error) {
    console.error('Error optimizing ad assets:', error.message);
    process.exit(1);
  }
}

/**
 * Process all image files in a directory
 */
async function processDirectory(directory) {
  const dirName = path.basename(directory);
  console.log(`Processing directory: ${dirName}`);
  
  // Find all jpg/png files
  const imagePattern = path.join(directory, '*.{jpg,jpeg,png}');
  const imageFiles = glob.sync(imagePattern);
  
  if (imageFiles.length === 0) {
    console.log(`No image files found in ${dirName}`);
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to process`);
  
  // Process each image file
  for (const imageFile of imageFiles) {
    const filename = path.basename(imageFile);
    
    // Determine what size this image is for
    let sizeKey = null;
    if (filename.includes('mobile')) {
      sizeKey = 'mobile';
    } else if (filename.includes('tablet')) {
      sizeKey = 'tablet';
    } else if (filename.includes('desktop')) {
      sizeKey = 'desktop';
    }
    
    if (sizeKey) {
      await optimizeImage(imageFile, sizeKey, directory);
    } else {
      console.log(`Skipping ${filename} - could not determine target size`);
    }
  }
}

/**
 * Optimize a single image file
 */
async function optimizeImage(imagePath, sizeKey, outputDir) {
  const filename = path.basename(imagePath);
  console.log(`Optimizing ${filename} for ${sizeKey}`);
  
  const targetSize = SIZES[sizeKey];
  const outputWebP = path.join(outputDir, `${sizeKey}.webp`);
  const outputJpg = path.join(outputDir, `${sizeKey}.jpg`);
  
  // In a real implementation, you would use sharp to resize and convert images
  // This is a placeholder for demonstration purposes
  console.log(`  → Would resize to ${targetSize.width}x${targetSize.height}`);
  console.log(`  → Would create WebP: ${path.basename(outputWebP)}`);
  console.log(`  → Would create JPG: ${path.basename(outputJpg)}`);
  
  // Example of how to implement with sharp:
  /*
  await sharp(imagePath)
    .resize(targetSize.width, targetSize.height, {
      fit: 'cover',
      position: 'top'
    })
    .webp({ quality: targetSize.quality })
    .toFile(outputWebP);
    
  await sharp(imagePath)
    .resize(targetSize.width, targetSize.height, {
      fit: 'cover',
      position: 'top'
    })
    .jpeg({ quality: targetSize.quality, progressive: true })
    .toFile(outputJpg);
  */
}

// Execute the script
optimizeAdAssets(); 