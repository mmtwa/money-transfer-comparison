const fs = require('fs');
const path = require('path');
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
    type: String,
    publishedDate: Date,
    updatedDate: Date,
    status: String
  });
  Content = mongoose.model('Content', ContentSchema);
}

// Date formatting function
const formatDate = (date) => {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
};

// Function to generate the sitemap
async function generateSitemap() {
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
      .select('title slug type publishedDate updatedDate')
      .sort({ updatedDate: -1 });
    
    console.log(`Found ${contents.length} published content items`);
    
    // Core URLs that will always be in the sitemap
    const coreUrls = [
      {
        loc: 'https://www.mymoneytransfers.com/',
        priority: '1.0',
        changefreq: 'daily'
      },
      {
        loc: 'https://www.mymoneytransfers.com/about',
        priority: '0.8',
        changefreq: 'monthly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/results',
        priority: '0.9',
        changefreq: 'daily'
      },
      {
        loc: 'https://www.mymoneytransfers.com/faq',
        priority: '0.8',
        changefreq: 'monthly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/historical-rates',
        priority: '0.7',
        changefreq: 'weekly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/privacy-policy',
        priority: '0.5',
        changefreq: 'monthly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/terms-of-service',
        priority: '0.5',
        changefreq: 'monthly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/cookie-policy',
        priority: '0.5',
        changefreq: 'monthly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/legal-disclosure',
        priority: '0.5',
        changefreq: 'monthly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/press',
        priority: '0.6',
        changefreq: 'weekly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/careers',
        priority: '0.6',
        changefreq: 'weekly'
      },
      {
        loc: 'https://www.mymoneytransfers.com/guides',
        priority: '0.9',
        changefreq: 'weekly'
      }
    ];
    
    // Build content URLs
    const contentUrls = contents.map(content => {
      let urlPath;
      let priority = '0.7';
      let changefreq = 'monthly';
      
      // Determine URL path based on content type
      if (content.type === 'guide') {
        urlPath = `https://www.mymoneytransfers.com/guides/${content.slug}`;
        priority = '0.8';
      } else if (content.type === 'faq') {
        urlPath = `https://www.mymoneytransfers.com/faq/${content.slug}`;
        priority = '0.7';
      } else if (content.type === 'page') {
        urlPath = `https://www.mymoneytransfers.com/${content.slug}`;
        priority = '0.7';
      } else {
        urlPath = `https://www.mymoneytransfers.com/${content.slug}`;
      }
      
      return {
        loc: urlPath,
        lastmod: formatDate(content.updatedDate || content.publishedDate),
        priority: priority,
        changefreq: changefreq
      };
    });
    
    // Combine core and content URLs
    const allUrls = [...coreUrls, ...contentUrls];
    
    // Build XML sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
    
    // Add each URL to the sitemap
    allUrls.forEach(url => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url.loc}</loc>\n`;
      if (url.lastmod) {
        sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
      } else {
        // Default to current date
        sitemap += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      }
      sitemap += `    <priority>${url.priority}</priority>\n`;
      sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    // Write sitemap to the client/public directory
    const sitemapPath = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log(`Sitemap generated at ${sitemapPath}`);
    console.log(`Total URLs in sitemap: ${allUrls.length}`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Try to disconnect in case of error
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
    process.exit(1);
  }
}

// Run the sitemap generator
generateSitemap(); 