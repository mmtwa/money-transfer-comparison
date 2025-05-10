/**
 * Script to update all guide content to published status
 * and add missing images to guide content.
 * 
 * Usage: node scripts/fix-guides-status.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Check for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI not found in environment variables!');
  console.log('Checking for .env file...');
  
  // Try to read .env file directly
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const mongoMatch = envContent.match(/MONGODB_URI\s*=\s*(.+)/);
      if (mongoMatch && mongoMatch[1]) {
        console.log('Found MongoDB URI in .env file. Using that instead.');
        process.env.MONGODB_URI = mongoMatch[1].trim();
      } else {
        console.error('MongoDB URI not found in .env file!');
        process.exit(1);
      }
    } else {
      console.error('.env file not found!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error reading .env file:', err);
    process.exit(1);
  }
}

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  runFixes();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Import Content model
let Content;
try {
  Content = mongoose.model('Content');
} catch {
  // Define ContentSchema
  const ContentSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    type: String,
    category: String,
    status: String,
    images: {
      heroImage: String,
      contentImages: [String]
    },
    publishedDate: Date,
    updatedDate: Date
  });
  
  Content = mongoose.model('Content', ContentSchema);
}

// Get available images
const getAvailableImages = () => {
  try {
    const imagesDir = path.join(__dirname, '../client/src/assets/images/guides');
    
    if (!fs.existsSync(imagesDir)) {
      console.warn('Images directory not found:', imagesDir);
      return [];
    }
    
    // Read directory contents
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files and format paths
    return files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/images/guides/${file}`);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

// Get suitable hero image for a guide
const getHeroImageForGuide = (slug, availableImages) => {
  // Try to find a matching image
  const slugWithoutPrefix = slug.replace(/^\/?(guides\/)?/, '');
  
  if (slugWithoutPrefix.includes('send-money-to-')) {
    const country = slugWithoutPrefix.replace('send-money-to-', '');
    const countryImage = availableImages.find(img => 
      img.toLowerCase().includes(country.toLowerCase()) && 
      img.toLowerCase().includes('hero')
    );
    if (countryImage) return countryImage;
  }
  
  // Check for specific matches
  if (slugWithoutPrefix.includes('getting-started')) {
    const match = availableImages.find(img => img.toLowerCase().includes('international') && img.toLowerCase().includes('hero'));
    if (match) return match;
  }
  
  if (slugWithoutPrefix.includes('exchange-rates')) {
    const match = availableImages.find(img => img.toLowerCase().includes('exchange') && img.toLowerCase().includes('hero'));
    if (match) return match;
  }
  
  if (slugWithoutPrefix.includes('transfer-fees')) {
    const match = availableImages.find(img => img.toLowerCase().includes('fees') && img.toLowerCase().includes('hero'));
    if (match) return match;
  }
  
  if (slugWithoutPrefix.includes('security')) {
    const match = availableImages.find(img => img.toLowerCase().includes('security') && img.toLowerCase().includes('hero'));
    if (match) return match;
  }
  
  // Find any image that might match part of the slug
  const slugParts = slugWithoutPrefix.split('-');
  for (const part of slugParts) {
    if (part.length > 3) { // Only consider meaningful parts
      const match = availableImages.find(img => img.toLowerCase().includes(part) && img.toLowerCase().includes('hero'));
      if (match) return match;
    }
  }
  
  // Default hero image
  const defaultHero = availableImages.find(img => img.toLowerCase().includes('hero'));
  return defaultHero || availableImages[0] || '';
};

// Run the fixes
const runFixes = async () => {
  try {
    // Get all guides
    const guides = await Content.find({ type: 'guide' });
    console.log(`Found ${guides.length} guides to process`);
    
    const availableImages = getAvailableImages();
    console.log(`Found ${availableImages.length} available images`);
    
    // Process each guide
    let updatedCount = 0;
    for (const guide of guides) {
      let hasChanges = false;
      const updates = {};
      
      // Set status to published if not already
      if (guide.status !== 'published') {
        updates.status = 'published';
        hasChanges = true;
      }
      
      // Add hero image if missing
      if (!guide.images || !guide.images.heroImage) {
        const heroImage = getHeroImageForGuide(guide.slug, availableImages);
        updates.images = {
          heroImage,
          contentImages: guide.images?.contentImages || []
        };
        hasChanges = true;
      }
      
      // Update guide if changes needed
      if (hasChanges) {
        console.log(`Updating guide: ${guide.title} (${guide.slug})`);
        await Content.updateOne({ _id: guide._id }, { $set: updates });
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} guides`);
    console.log('Completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing guides:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}; 