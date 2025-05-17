const fs = require('fs');
const path = require('path');

// Function to find all React component files in the pages directory
function findPageComponents(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findPageComponents(filePath, fileList);
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && 
               !file.includes('.test.') && 
               !file.includes('.spec.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to generate a title from file path
function generateTitle(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Convert from camelCase or snake-case to readable format
  let title = fileName
    .replace(/([A-Z])/g, ' $1')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Special case handling for specific pages
  if (fileName === 'AboutUs') {
    title = 'About Us';
  } else if (fileName === 'FAQ') {
    title = 'Frequently Asked Questions';
  } else if (fileName.toLowerCase().includes('send-money-to-')) {
    const country = fileName.toLowerCase().replace('send-money-to-', '');
    title = `Send Money to ${country.charAt(0).toUpperCase() + country.slice(1)} - Guide & Best Providers`;
  } else if (fileName.includes('Transfers')) {
    title += ' - Money Transfer Guide';
  }
  
  // Add site suffix
  title += ' | MyMoneyTransfers';
  
  return title;
}

// Function to add title tags to SEO components
function addTitleTags(filePath) {
  console.log(`Processing ${path.relative(process.cwd(), filePath)}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Skip files that don't have SEO components
    if (!content.includes('<SEO') && !content.includes('<Helmet')) {
      console.log(`  - No SEO component found, skipping`);
      return false;
    }
    
    // Generate title
    const title = generateTitle(filePath);
    
    // Check if title prop already exists
    if (content.includes('title={') || content.includes('title="')) {
      // Update existing title
      if (content.includes('title={')) {
        // Handle JSX expression title
        content = content.replace(/title=\{[^}]*\}/g, `title="${title}"`);
        modified = true;
        console.log(`  - Updated existing title to "${title}"`);
      } else if (content.includes('title="')) {
        // Handle string title
        content = content.replace(/title="[^"]*"/g, `title="${title}"`);
        modified = true;
        console.log(`  - Updated existing title to "${title}"`);
      }
    } 
    // Add title prop to SEO component
    else if (content.includes('<SEO')) {
      content = content.replace(
        /<SEO([^>]*)>/g,
        (match, props) => {
          if (props.includes('title=')) {
            return match; // Don't modify if title already exists
          }
          
          // Add title prop
          if (props.trim().endsWith('/')) {
            return `<SEO${props.slice(0, -1)} title="${title}" />`;
          }
          return `<SEO${props} title="${title}">`;
        }
      );
      modified = true;
      console.log(`  - Added title prop to SEO component: "${title}"`);
    }
    // Add title tag to Helmet
    else if (content.includes('<Helmet>')) {
      if (!content.includes('<title>')) {
        content = content.replace(
          /<Helmet>/g,
          `<Helmet>\n        <title>${title}</title>`
        );
        modified = true;
        console.log(`  - Added title tag to Helmet: "${title}"`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`  - Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Adding title tags to SEO components...');
  
  const pagesDir = path.join(__dirname, '..', 'client', 'src', 'pages');
  const pageFiles = findPageComponents(pagesDir);
  
  console.log(`Found ${pageFiles.length} page components`);
  
  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of pageFiles) {
    try {
      // Skip admin pages
      if (file.includes('admin')) {
        console.log(`Skipping admin page: ${path.relative(process.cwd(), file)}`);
        skippedCount++;
        continue;
      }
      
      const fixed = addTitleTags(file);
      
      if (fixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
      errorCount++;
    }
  }
  
  console.log('\nSummary:');
  console.log(`  - Added or updated title tags in ${fixedCount} files`);
  console.log(`  - Skipped ${skippedCount} files`);
  console.log(`  - Encountered errors in ${errorCount} files`);
  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 