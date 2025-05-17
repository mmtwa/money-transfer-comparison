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

// Function to generate canonical URL from file path
function generateCanonicalUrl(filePath) {
  const pagesDir = path.join(__dirname, '..', 'client', 'src', 'pages');
  const relativePath = path.relative(pagesDir, filePath);
  const extname = path.extname(relativePath);
  
  // Remove file extension
  let urlPath = relativePath.substring(0, relativePath.length - extname.length);
  
  // Convert index.js to just the directory
  urlPath = urlPath.replace(/\/index$|^index$/i, '');
  
  // Convert camelCase to kebab-case
  urlPath = urlPath.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  
  // Handle guides directory structure
  if (urlPath.startsWith('guides/')) {
    return `/${urlPath}`;
  }
  
  // Handle other paths
  return urlPath ? `/${urlPath}` : '/';
}

// Function to fix canonical URLs in a file
function fixCanonicalUrls(filePath) {
  console.log(`Processing ${path.relative(process.cwd(), filePath)}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Skip files that already use our CanonicalUrl component
    if (content.includes('import CanonicalUrl from') || 
        content.includes('import { CanonicalUrl }')) {
      console.log(`  - Already using CanonicalUrl component`);
      return false;
    }
    
    // Check if file has SEO component
    const hasSeo = content.includes('<SEO') || content.includes('<Helmet');
    
    if (hasSeo) {
      const canonicalUrl = generateCanonicalUrl(filePath);
      
      // Check if there's already a canonicalUrl prop
      if (content.includes('canonicalUrl=')) {
        // Replace existing canonicalUrl
        content = content.replace(
          /canonicalUrl=["'][^"']*["']/g, 
          `canonicalUrl="${canonicalUrl}"`
        );
        modified = true;
        console.log(`  - Updated existing canonicalUrl to "${canonicalUrl}"`);
      } 
      // Check if there's a canonical element directly in Helmet
      else if (content.includes('<link rel="canonical"')) {
        // Replace existing canonical link
        content = content.replace(
          /<link rel="canonical"[^>]*>/g,
          `<link rel="canonical" href="${canonicalUrl}" />`
        );
        modified = true;
        console.log(`  - Updated existing canonical link to "${canonicalUrl}"`);
      }
      // Add canonicalUrl prop to SEO component
      else if (content.includes('<SEO')) {
        content = content.replace(
          /<SEO([^>]*)>/g,
          (match, props) => {
            // Check if props end with />
            if (props.trim().endsWith('/')) {
              return `<SEO${props.slice(0, -1)} canonicalUrl="${canonicalUrl}" />`;
            }
            return `<SEO${props} canonicalUrl="${canonicalUrl}">`;
          }
        );
        modified = true;
        console.log(`  - Added canonicalUrl prop to SEO component: "${canonicalUrl}"`);
      }
      // Add canonical link to Helmet
      else if (content.includes('<Helmet>')) {
        content = content.replace(
          /<Helmet>/g,
          `<Helmet>\n        <link rel="canonical" href="${canonicalUrl}" />`
        );
        modified = true;
        console.log(`  - Added canonical link to Helmet: "${canonicalUrl}"`);
      }
    } else {
      console.log(`  - No SEO component found, skipping`);
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

// Function to add CanonicalUrl component to App.js
function addCanonicalToRouter() {
  console.log('Adding CanonicalUrl component to router setup...');
  
  const appJsPath = path.join(__dirname, '..', 'client', 'src', 'App.js');
  
  if (!fs.existsSync(appJsPath)) {
    console.log('  - App.js not found, skipping');
    return false;
  }
  
  try {
    let content = fs.readFileSync(appJsPath, 'utf8');
    
    // Skip if already using our component
    if (content.includes('import CanonicalUrl from') || 
        content.includes('import { CanonicalUrl }')) {
      console.log('  - Already using CanonicalUrl component');
      return false;
    }
    
    // Find import section
    const importIndex = content.lastIndexOf('import');
    if (importIndex === -1) {
      console.log('  - No import statements found, skipping');
      return false;
    }
    
    // Add import for CanonicalUrl
    let importEndIndex = content.indexOf('\n\n', importIndex);
    if (importEndIndex === -1) {
      importEndIndex = content.indexOf('function', importIndex);
    }
    
    content = content.slice(0, importEndIndex) + 
              '\nimport CanonicalUrl from \'./components/CanonicalUrl\';\n' + 
              content.slice(importEndIndex);
    
    // Look for Route components
    const routeMatches = [...content.matchAll(/<Route[^>]*path=["']([^"']+)["'][^>]*>/g)];
    
    if (routeMatches.length === 0) {
      console.log('  - No Route components found, skipping');
      return false;
    }
    
    // Modify Route components to include CanonicalUrl
    let modifiedContent = content;
    let count = 0;
    
    routeMatches.forEach(match => {
      const routeTag = match[0];
      const path = match[1];
      
      // Skip if already contains CanonicalUrl
      if (routeTag.includes('<CanonicalUrl')) {
        return;
      }
      
      const componentStart = modifiedContent.indexOf('>', match.index) + 1;
      modifiedContent = modifiedContent.slice(0, componentStart) + 
                       '\n          <CanonicalUrl path="' + path + '" />' + 
                       modifiedContent.slice(componentStart);
      
      count++;
    });
    
    if (count > 0) {
      fs.writeFileSync(appJsPath, modifiedContent);
      console.log(`  - Added CanonicalUrl to ${count} Route components`);
      return true;
    }
    
    console.log('  - No modifications needed');
    return false;
    
  } catch (error) {
    console.error('  - Error updating App.js:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Fixing canonical URLs...');
  
  // 1. First check if we have a CanonicalUrl component
  const canonicalComponentPath = path.join(__dirname, '..', 'client', 'src', 'components', 'CanonicalUrl.js');
  
  if (!fs.existsSync(canonicalComponentPath)) {
    console.log('CanonicalUrl component not found. Using direct canonical URL fixes.');
  } else {
    console.log('CanonicalUrl component found. Adding it to router...');
    addCanonicalToRouter();
  }
  
  // 2. Fix individual page components
  const pagesDir = path.join(__dirname, '..', 'client', 'src', 'pages');
  const pageFiles = findPageComponents(pagesDir);
  
  console.log(`\nFound ${pageFiles.length} page components`);
  
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
      
      const fixed = fixCanonicalUrls(file);
      
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
  console.log(`  - Fixed canonical URLs in ${fixedCount} files`);
  console.log(`  - Skipped ${skippedCount} files`);
  console.log(`  - Encountered errors in ${errorCount} files`);
  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 