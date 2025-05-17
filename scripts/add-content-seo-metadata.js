const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define the Content model if it doesn't exist
let Content;
try {
  Content = mongoose.model('Content');
} catch {
  // If the model doesn't exist, create it
  const ContentSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    type: String,
    status: String,
    publishedDate: Date,
    updatedDate: Date,
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  });
  Content = mongoose.model('Content', ContentSchema);
}

// Generate SEO metadata for content
function generateSeoMetadata(content) {
  let title = content.title || '';
  
  // Clean the title (remove "REVEALED:" and similar prefixes)
  title = title.replace(/^(REVEALED|EXPOSED|BREAKING):\s+/i, '');
  
  // Limit title to 60 characters
  const seoTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Generate description based on content type
  let description = '';
  switch (content.type) {
    case 'guide':
      description = `Learn about ${title.toLowerCase()} with our comprehensive guide. Compare rates, fees, and services from multiple money transfer providers with 100% independent rankings.`;
      break;
    case 'faq':
      description = `Get answers to your questions about ${title.toLowerCase()}. MyMoneyTransfers provides independent, unbiased information about international money transfers.`;
      break;
    case 'page':
    default:
      description = `${title} - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers.`;
      break;
  }
  
  // Limit description to 160 characters
  const seoDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // Generate keywords based on content title and type
  const baseKeywords = [
    'money transfer', 
    'international money transfer', 
    'currency exchange', 
    'exchange rates', 
    'transfer fees'
  ];
  
  // Add specific keywords based on content
  const titleWords = title.toLowerCase().split(' ');
  const specificKeywords = [];
  
  // Extract meaningful keywords from title
  titleWords.forEach(word => {
    // Skip common words
    if (word.length > 3 && 
        !['that', 'this', 'with', 'from', 'your', 'their', 'have', 'will', 'what', 'when', 'about'].includes(word)) {
      specificKeywords.push(word);
    }
  });
  
  // Look for specific countries or providers in the title
  const countries = ['india', 'pakistan', 'philippines', 'nigeria', 'mexico', 'china', 'kenya', 'canada', 'vietnam', 'poland', 'romania', 'morocco', 'bangladesh'];
  const providers = ['wise', 'western union', 'remitly', 'xe', 'revolut', 'instarem'];
  
  countries.forEach(country => {
    if (title.toLowerCase().includes(country)) {
      specificKeywords.push(`send money to ${country}`);
      specificKeywords.push(`money transfer to ${country}`);
    }
  });
  
  providers.forEach(provider => {
    if (title.toLowerCase().includes(provider)) {
      specificKeywords.push(provider);
      specificKeywords.push(`${provider} money transfer`);
    }
  });
  
  // Add type-specific keywords
  if (content.type === 'guide') {
    specificKeywords.push('money transfer guide');
    specificKeywords.push('transfer comparison');
  }
  
  // Combine base and specific keywords, remove duplicates
  const seoKeywords = [...new Set([...baseKeywords, ...specificKeywords])];
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords
  };
}

// Update content SEO metadata
async function updateContentSeo() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB. Fetching content...');
    
    // Get all published content
    const contents = await Content.find({ status: 'published' })
      .select('title slug type content seo publishedDate')
      .sort({ updatedDate: -1 });
    
    console.log(`Found ${contents.length} published content items`);
    console.log('Updating SEO metadata...\n');
    
    let updatedCount = 0;
    
    // Update each content item
    for (const content of contents) {
      // Skip if SEO metadata already exists and is complete
      if (content.seo && 
          content.seo.title && 
          content.seo.description && 
          content.seo.keywords && 
          content.seo.keywords.length > 0) {
        console.log(`${content.title} - SEO metadata already exists, skipping`);
        continue;
      }
      
      // Generate SEO metadata
      const seoMetadata = generateSeoMetadata(content);
      
      // Update content
      content.seo = seoMetadata;
      content.updatedDate = new Date();
      
      await content.save();
      
      console.log(`Updated SEO metadata for: ${content.title}`);
      console.log(`  - Title: ${seoMetadata.title}`);
      console.log(`  - Description: ${seoMetadata.description}`);
      console.log(`  - Keywords: ${seoMetadata.keywords.length} keywords`);
      
      updatedCount++;
    }
    
    console.log(`\nUpdated SEO metadata for ${updatedCount} out of ${contents.length} content items`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error updating SEO metadata:', error);
    // Try to disconnect in case of error
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
    process.exit(1);
  }
}

// Run the update
updateContentSeo(); 