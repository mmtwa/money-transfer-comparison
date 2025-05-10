/**
 * Script to extract guide content from React components and save it to the database.
 * 
 * Usage: node scripts/migrate-guide-content.js
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
  migrateContent();
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

// Guide paths to process (corresponding to ContentList.js section paths)
const guidePaths = [
  // Basics guides
  '/guides/getting-started',
  '/guides/exchange-rates',
  '/guides/transfer-fees',
  '/guides/family-remittances',
  '/guides/business-transfers',
  '/guides/security-tips',
  
  // Country guides
  '/guides/send-money-to-india',
  '/guides/send-money-to-philippines',
  '/guides/send-money-to-mexico',
  '/guides/send-money-to-pakistan',
  '/guides/send-money-to-nigeria',
  '/guides/send-money-to-poland',
  '/guides/send-money-to-romania',
  '/guides/send-money-to-china',
  '/guides/send-money-to-morocco',
  '/guides/send-money-to-vietnam',
  '/guides/send-money-to-bangladesh',
  '/guides/send-money-to-canada',
  
  // Value guides
  '/guides/high-value',
  '/guides/mid-value',
  '/guides/low-value',
  '/guides/micro',
  
  // Purpose guides
  '/guides/purpose/property',
  '/guides/purpose/study',
  '/guides/purpose/family',
  '/guides/purpose/nomad',
  '/guides/purpose/business',
  
  // Frequency guides
  '/guides/frequency/regular',
  '/guides/frequency/periodic',
  '/guides/frequency/one-time',
  '/guides/frequency/occasional',
  
  // Corridors guides
  '/guides/corridors/uk-asia',
  '/guides/corridors/us-latam',
  '/guides/corridors/eu-africa',
  '/guides/corridors/aus-pacific',
  '/guides/corridors/gulf-asia',
  
  // Criteria guides
  '/guides/criteria/cost',
  '/guides/criteria/convenience',
  '/guides/criteria/security',
  '/guides/criteria/service',
  
  // Method guides
  '/guides/method/digital-native',
  '/guides/method/digital-adapter',
  '/guides/method/traditional'
];

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

// Extract content from a component file
const extractContentFromComponent = (guidePath) => {
  // Convert guide path to component file path
  // E.g., /guides/getting-started -> GettingStarted.js
  let fileName;
  
  // Special case for country guides
  if (guidePath.includes('send-money-to-')) {
    const country = guidePath.replace('/guides/send-money-to-', '');
    const capitalizedCountry = country.charAt(0).toUpperCase() + country.slice(1);
    fileName = `SendMoneyTo${capitalizedCountry}Guide.js`;
  } 
  // Special case for guides in subdirectories
  else if (guidePath.includes('/')) {
    const lastPart = guidePath.split('/').pop();
    fileName = lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + '.js';
  } 
  // Basic guides
  else {
    fileName = guidePath
      .replace('/guides/', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + '.js';
  }
  
  // Full path to the component file
  const componentFilePath = path.join(__dirname, '../client/src/pages/guides', fileName);
  const alternateFilePath = path.join(__dirname, '../client/src/pages/guides', guidePath.split('/').pop(), fileName);
  
  let fileContent = '';
  let exists = false;
  
  // Try to read the component file
  try {
    if (fs.existsSync(componentFilePath)) {
      fileContent = fs.readFileSync(componentFilePath, 'utf8');
      exists = true;
    } else if (fs.existsSync(alternateFilePath)) {
      fileContent = fs.readFileSync(alternateFilePath, 'utf8');
      exists = true;
    } else {
      console.warn(`Component file for ${guidePath} not found at ${componentFilePath}`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading component file for ${guidePath}:`, error);
    return null;
  }
  
  if (!exists || !fileContent) {
    return null;
  }
  
  // Extract guide title
  let title = '';
  const titleMatch = fileContent.match(/title=['"]([^'"]*)['"]/);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1];
  } else {
    // Try to infer title from component name
    title = fileName.replace('.js', '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }
  
  // Extract content from JSX - look for text between `{expandedSections['section-id'] && (...)}`
  let content = '';
  let heroImagePath = '';
  
  // Look for heroImage prop
  const heroImageMatch = fileContent.match(/heroImage[=\s]*{?['"]([^'"]*)['"]/);
  if (heroImageMatch && heroImageMatch[1]) {
    heroImagePath = heroImageMatch[1];
  }
  
  // Look for content blocks in JSX
  const contentBlocks = [];
  
  // Extract paragraphs
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
  let paragraphMatch;
  while ((paragraphMatch = paragraphRegex.exec(fileContent)) !== null) {
    // Clean up paragraph text (remove JSX tags)
    let paragraphText = paragraphMatch[1]
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/\{[^}]*\}/g, '') // Remove JS expressions
      .trim();
      
    if (paragraphText) {
      contentBlocks.push(paragraphText);
    }
  }
  
  // Extract headings
  const headingRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(fileContent)) !== null) {
    // Clean up heading text
    let headingText = headingMatch[1]
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/\{[^}]*\}/g, '') // Remove JS expressions
      .trim();
      
    if (headingText) {
      // Add as markdown heading
      contentBlocks.push(`## ${headingText}`);
    }
  }
  
  // Combine content blocks into markdown
  if (contentBlocks.length > 0) {
    content = `# ${title}\n\n` + contentBlocks.join('\n\n');
  } else {
    // Fallback content
    content = `# ${title}\n\n## Introduction\n\nThis guide provides information about ${title.toLowerCase()}.\n\n## Key Points\n\n- Point 1\n- Point 2\n- Point 3\n\n## Summary\n\nSummary of the guide.`;
  }
  
  return {
    title,
    content,
    heroImagePath
  };
};

// Run the migration
const migrateContent = async () => {
  try {
    const availableImages = getAvailableImages();
    console.log(`Found ${availableImages.length} available images`);
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const guidePath of guidePaths) {
      console.log(`Processing ${guidePath}...`);
      
      // Extract slug from path (remove /guides/ prefix)
      const slug = guidePath.replace(/^\/guides/, '');
      
      // Check if content already exists in database
      let content = await Content.findOne({ slug });
      let isNew = false;
      
      if (!content) {
        // Try with leading slash
        content = await Content.findOne({ slug: slug.startsWith('/') ? slug : `/${slug}` });
      }
      
      if (!content) {
        console.log(`Creating new content for ${guidePath}`);
        
        // Extract component data
        const componentData = extractContentFromComponent(guidePath);
        
        if (!componentData) {
          console.log(`Skipping ${guidePath} - unable to extract content`);
          continue;
        }
        
        // Get hero image
        const heroImage = componentData.heroImagePath || getHeroImageForGuide(slug, availableImages);
        
        // Create new content
        content = new Content({
          title: componentData.title,
          slug: slug.startsWith('/') ? slug.substring(1) : slug,
          content: componentData.content,
          type: 'guide',
          category: '',
          status: 'published',
          images: {
            heroImage,
            contentImages: []
          },
          publishedDate: new Date(),
          updatedDate: new Date()
        });
        
        await content.save();
        createdCount++;
        isNew = true;
      } else {
        console.log(`Updating existing content for ${guidePath}`);
        
        // Extract component data
        const componentData = extractContentFromComponent(guidePath);
        
        if (!componentData) {
          console.log(`Skipping update for ${guidePath} - unable to extract content`);
          continue;
        }
        
        // Get hero image if not already set
        const heroImage = content.images?.heroImage || 
                          componentData.heroImagePath || 
                          getHeroImageForGuide(slug, availableImages);
        
        // Update content
        content.title = componentData.title;
        content.content = componentData.content;
        content.status = 'published';
        content.images = {
          heroImage,
          contentImages: content.images?.contentImages || []
        };
        content.updatedDate = new Date();
        
        await content.save();
        updatedCount++;
      }
      
      console.log(`${isNew ? 'Created' : 'Updated'} content for ${guidePath}`);
    }
    
    console.log(`Migration complete. Created ${createdCount} new guides, updated ${updatedCount} existing guides.`);
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}; 