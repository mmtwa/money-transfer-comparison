/**
 * Simple WebP Conversion Script
 * 
 * This script takes JPG files in a partner directory and converts them to WebP
 * 
 * Usage: 
 * node convertToWebP.js ba
 * 
 * This will convert all JPG files in the partners/ba directory to WebP
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const PARTNERS_DIR = path.join(PUBLIC_DIR, 'partners');

async function convertToWebP() {
  try {
    // Get partner ID from command line
    const partnerId = process.argv[2];
    
    if (!partnerId) {
      console.error('Error: Partner ID is required');
      console.log('Usage: node convertToWebP.js partner-id');
      process.exit(1);
    }
    
    // Get partner directory
    const partnerDir = path.join(PARTNERS_DIR, partnerId);
    if (!fs.existsSync(partnerDir)) {
      console.error(`Error: Partner directory not found: ${partnerDir}`);
      process.exit(1);
    }
    
    console.log(`Converting images for partner: ${partnerId}`);
    
    // Find all jpg files
    const files = fs.readdirSync(partnerDir);
    const jpgFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    if (jpgFiles.length === 0) {
      console.log('No JPG files found to convert');
      process.exit(0);
    }
    
    console.log(`Found ${jpgFiles.length} files to convert`);
    
    // Process each file
    const conversions = jpgFiles.map(async (file) => {
      const inputPath = path.join(partnerDir, file);
      let outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Handle special case for desktop-ad.jpg
      if (file === 'desktop-ad.jpg') outputName = 'desktop.webp';
      if (file === 'mobile-ad.jpg') outputName = 'mobile.webp';
      if (file === 'tablet-ad.jpg') outputName = 'tablet.webp';
      
      const outputPath = path.join(partnerDir, outputName);
      
      console.log(`Converting ${file} to ${outputName}`);
      
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`✓ Converted ${file} to WebP successfully`);
      } catch (err) {
        console.error(`× Error converting ${file}: ${err.message}`);
      }
    });
    
    // Wait for all conversions to complete
    await Promise.all(conversions);
    
    console.log('✅ All conversions complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
convertToWebP(); 