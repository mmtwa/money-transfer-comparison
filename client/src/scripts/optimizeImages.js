const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories to scan for images
const IMAGES_DIR = path.join(__dirname, '../assets/images');

// Output quality for different formats
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 75;

// Max width for resizing
const MAX_WIDTH = 1200;

// Function to normalize filenames (replace spaces with hyphens)
function normalizeFilename(filePath) {
  const directory = path.dirname(filePath);
  const extension = path.extname(filePath);
  const basename = path.basename(filePath, extension);
  
  // Check if the filename contains spaces
  if (basename.includes(' ')) {
    const normalizedBasename = basename.replace(/ /g, '-');
    const normalizedPath = path.join(directory, `${normalizedBasename}${extension}`);
    return { needsRename: true, originalPath: filePath, normalizedPath };
  }
  
  return { needsRename: false, originalPath: filePath, normalizedPath: filePath };
}

// Function to find all image files recursively
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // Skip already optimized files
        if (!file.includes('-optimized')) {
          fileList.push(filePath);
        }
      }
    }
  });
  
  return fileList;
}

// Check if file needs optimization
function needsOptimization(imagePath) {
  const directory = path.dirname(imagePath);
  const extension = path.extname(imagePath).toLowerCase();
  const nameWithoutExt = path.basename(imagePath, extension);
  
  // Paths for optimized versions
  const optimizedPath = path.join(directory, `${nameWithoutExt}-optimized${extension}`);
  const webpPath = path.join(directory, `${nameWithoutExt}.webp`);
  
  // Check if optimized files exist
  const optimizedExists = fs.existsSync(optimizedPath);
  const webpExists = fs.existsSync(webpPath);
  
  // If neither exists, optimization is needed
  if (!optimizedExists || !webpExists) {
    return true;
  }
  
  // Compare modification times to check if original is newer
  const originalStat = fs.statSync(imagePath);
  const optimizedStat = optimizedExists ? fs.statSync(optimizedPath) : null;
  const webpStat = webpExists ? fs.statSync(webpPath) : null;
  
  // If original is newer than optimized versions, re-optimization is needed
  return (optimizedExists && originalStat.mtimeMs > optimizedStat.mtimeMs) || 
         (webpExists && originalStat.mtimeMs > webpStat.mtimeMs);
}

// Process all images
async function optimizeImages() {
  try {
    console.log('Script starting...');
    console.log('Looking for images in:', IMAGES_DIR);
    
    // Check if directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      console.error('Error: Images directory does not exist:', IMAGES_DIR);
      return;
    }
    
    // Find all image files recursively
    const imageFiles = findImageFiles(IMAGES_DIR);
    
    console.log(`Found ${imageFiles.length} images to check`);
    
    if (imageFiles.length === 0) {
      console.log('No image files found with extensions: .jpg, .jpeg, .png');
      return;
    }
    
    let optimizedCount = 0;
    let skippedCount = 0;
    let renamedCount = 0;
    
    for (let imagePath of imageFiles) {
      // Normalize filename (replace spaces with hyphens)
      const { needsRename, originalPath, normalizedPath } = normalizeFilename(imagePath);
      
      // Rename file if needed
      if (needsRename) {
        try {
          fs.renameSync(originalPath, normalizedPath);
          console.log(`Renamed: ${path.basename(originalPath)} → ${path.basename(normalizedPath)}`);
          renamedCount++;
          // Update the path for further processing
          imagePath = normalizedPath;
        } catch (err) {
          console.error(`Error renaming ${path.basename(originalPath)}:`, err);
          continue; // Skip this file if rename fails
        }
      }
      
      const filename = path.basename(imagePath);
      const directory = path.dirname(imagePath);
      const extension = path.extname(imagePath).toLowerCase();
      const nameWithoutExt = path.basename(filename, extension);
      
      // Check if file needs optimization
      if (!needsOptimization(imagePath)) {
        console.log(`Skipping: ${filename} (already optimized)`);
        skippedCount++;
        continue;
      }
      
      console.log(`Processing: ${filename}`);
      optimizedCount++;
      
      try {
        // Get image metadata first
        const metadata = await sharp(imagePath).metadata();
        
        // Determine if resizing is needed
        const needsResize = metadata.width > MAX_WIDTH;
        const resizeOptions = needsResize ? { width: MAX_WIDTH } : null;
        
        if (needsResize) {
          console.log(`  Resizing from ${metadata.width}px to ${MAX_WIDTH}px width`);
        }
        
        // Optimize based on image format
        if (extension === '.jpg' || extension === '.jpeg') {
          // Create optimized version with a new Sharp instance
          const outputPath = path.join(directory, `${nameWithoutExt}-optimized${extension}`);
          await sharp(imagePath)
            .resize(resizeOptions)
            .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
            .toFile(outputPath);
            
          console.log(`  Optimized JPEG: ${outputPath}`);
          
        } else if (extension === '.png') {
          // Create optimized version with a new Sharp instance
          const outputPath = path.join(directory, `${nameWithoutExt}-optimized${extension}`);
          await sharp(imagePath)
            .resize(resizeOptions)
            .png({ quality: PNG_QUALITY, compressionLevel: 9 })
            .toFile(outputPath);
            
          console.log(`  Optimized PNG: ${outputPath}`);
        }
        
        // Create WebP version with a new Sharp instance
        const webpPath = path.join(directory, `${nameWithoutExt}.webp`);
        await sharp(imagePath)
          .resize(resizeOptions)
          .webp({ quality: WEBP_QUALITY })
          .toFile(webpPath);
          
        console.log(`  Created WebP: ${webpPath}`);
      } catch (err) {
        console.error(`Error processing ${filename}:`, err);
      }
    }
    
    console.log('Image optimization complete!');
    console.log(`Renamed: ${renamedCount}, Optimized: ${optimizedCount}, Skipped: ${skippedCount}`);
    
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 