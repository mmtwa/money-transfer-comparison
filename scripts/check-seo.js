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
    content: String,
    type: String,
    status: String,
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  });
  Content = mongoose.model('Content', ContentSchema);
}

// Check SEO metadata in content
async function checkContentSeo() {
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
      .select('title slug type seo')
      .sort({ updatedDate: -1 });
    
    console.log(`Found ${contents.length} published content items`);
    console.log('Checking SEO metadata...\n');
    
    const issuesFound = [];
    
    // Check each content item
    contents.forEach(content => {
      const issues = [];
      
      // Check if SEO object exists
      if (!content.seo) {
        issues.push('Missing SEO object');
      } else {
        // Check SEO title
        if (!content.seo.title) {
          issues.push('Missing SEO title');
        } else if (content.seo.title.length > 60) {
          issues.push(`SEO title too long (${content.seo.title.length} chars, max 60)`);
        }
        
        // Check SEO description
        if (!content.seo.description) {
          issues.push('Missing SEO description');
        } else if (content.seo.description.length > 160) {
          issues.push(`SEO description too long (${content.seo.description.length} chars, max 160)`);
        }
        
        // Check SEO keywords
        if (!content.seo.keywords || content.seo.keywords.length === 0) {
          issues.push('Missing SEO keywords');
        }
      }
      
      // If issues found, add to report
      if (issues.length > 0) {
        issuesFound.push({
          title: content.title,
          slug: content.slug,
          type: content.type,
          issues
        });
      }
    });
    
    // Generate report
    if (issuesFound.length > 0) {
      console.log(`SEO issues found in ${issuesFound.length} content items:\n`);
      
      issuesFound.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} (${item.type})`);
        console.log(`   URL: ${getUrlFromTypeAndSlug(item.type, item.slug)}`);
        console.log('   Issues:');
        item.issues.forEach(issue => {
          console.log(`     - ${issue}`);
        });
        console.log('');
      });
      
      console.log('Recommendations:');
      console.log('1. Add missing SEO metadata to all content items');
      console.log('2. Keep titles under 60 characters');
      console.log('3. Keep descriptions under 160 characters');
      console.log('4. Include relevant keywords for each content item');
    } else {
      console.log('No SEO issues found in content. Great job!');
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error checking SEO:', error);
    // Try to disconnect in case of error
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
    process.exit(1);
  }
}

// Helper function to get URL from content type and slug
function getUrlFromTypeAndSlug(type, slug) {
  const base = 'https://www.mymoneytransfers.com';
  
  if (type === 'guide') {
    return `${base}/guides/${slug}`;
  } else if (type === 'faq') {
    return `${base}/faq/${slug}`;
  } else if (type === 'page') {
    return `${base}/${slug}`;
  } else {
    return `${base}/${slug}`;
  }
}

// Check React components for SEO elements
function checkReactComponents() {
  console.log('\nChecking React components for SEO elements...');
  
  const srcDir = path.join(__dirname, '..', 'client', 'src');
  const pagesDir = path.join(srcDir, 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.log('Pages directory not found');
    return;
  }
  
  const pages = findJsFiles(pagesDir);
  console.log(`Found ${pages.length} page components`);
  
  const issuesFound = [];
  
  // Check each page component
  pages.forEach(page => {
    const content = fs.readFileSync(page, 'utf8');
    const issues = [];
    
    // Skip admin pages
    if (page.includes('admin')) {
      return; // Skip admin pages as they don't need SEO
    }
    
    // Check for SEO component
    const hasSEOComponent = content.includes('import SEO') || 
                            content.includes('<SEO');
    const hasHelmet = content.includes('import { Helmet }') || 
                      content.includes('import Helmet') || 
                      content.includes('<Helmet');
                      
    if (!hasSEOComponent && !hasHelmet) {
      issues.push('No SEO component found');
    }
    
    // Check for title tag (either directly or via title prop)
    const hasDirectTitleTag = content.includes('<title') && content.includes('</title>');
    const hasTitleProp = (content.includes('title=') && 
                          (content.includes('<SEO') || content.includes('<Helmet')));
    
    if (!hasDirectTitleTag && !hasTitleProp) {
      issues.push('No title tag found');
    }
    
    // Check for meta description
    const hasDirectMetaDescription = content.includes('name="description"') || 
                                    content.includes("name='description'");
    const hasDescriptionProp = (content.includes('description=') && 
                               (content.includes('<SEO') || content.includes('<Helmet')));
    
    if (!hasDirectMetaDescription && !hasDescriptionProp) {
      issues.push('No meta description found');
    }
    
    // If issues found, add to report
    if (issues.length > 0) {
      issuesFound.push({
        file: path.relative(path.join(__dirname, '..'), page),
        issues
      });
    }
  });
  
  // Generate report
  if (issuesFound.length > 0) {
    console.log(`SEO issues found in ${issuesFound.length} React components:\n`);
    
    issuesFound.forEach((item, index) => {
      console.log(`${index + 1}. ${item.file}`);
      console.log('   Issues:');
      item.issues.forEach(issue => {
        console.log(`     - ${issue}`);
      });
      console.log('');
    });
    
    console.log('Recommendations:');
    console.log('1. Add the SEO component to all page components');
    console.log('2. Ensure each page has a unique title');
    console.log('3. Add meta descriptions to all pages');
  } else {
    console.log('No SEO issues found in React components. Great job!');
  }
}

// Helper function to find JS files recursively
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Run checks
async function runChecks() {
  console.log('RUNNING SEO CHECKS\n' + '='.repeat(50));
  
  // Check React components
  checkReactComponents();
  
  // Check content SEO
  await checkContentSeo();
  
  console.log('\nSEO checks completed');
}

// Run all checks
runChecks(); 