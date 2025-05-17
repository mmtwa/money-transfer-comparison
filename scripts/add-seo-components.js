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

// Function to check if a file already has SEO implementation
function hasSeoImplementation(content) {
  return content.includes('import SEO from') || 
         content.includes('import { SEO }') || 
         content.includes('import { Helmet }') || 
         content.includes('import Helmet');
}

// Function to add SEO component to a file
function addSeoComponent(filePath) {
  console.log(`Processing ${path.relative(process.cwd(), filePath)}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file already has SEO implementation
    if (hasSeoImplementation(content)) {
      console.log(`  - Already has SEO implementation`);
      return;
    }
    
    // Determine component name from file path
    const fileName = path.basename(filePath, path.extname(filePath));
    let pageTitle = fileName;
    
    // Convert from camelCase or snake-case to readable format
    pageTitle = pageTitle
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    // Create SEO description based on title
    const pageDescription = `${pageTitle} - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers.`;
    
    // Add import statement for SEO component
    const importStatement = `import SEO from '../../components/SEO';\n`;
    const importIndex = content.lastIndexOf('import');
    if (importIndex === -1) {
      console.log(`  - No import statements found, skipping`);
      return;
    }
    
    // Find the next line after imports
    let importEndIndex = content.indexOf('\n\n', importIndex);
    if (importEndIndex === -1) {
      importEndIndex = content.indexOf('function', importIndex);
      if (importEndIndex === -1) {
        importEndIndex = content.indexOf('const', importIndex);
        if (importEndIndex === -1) {
          console.log(`  - Couldn't find end of imports, skipping`);
          return;
        }
      }
    }
    
    // Add SEO import
    content = content.slice(0, importEndIndex) + 
              '\n' + importStatement + 
              content.slice(importEndIndex);
    
    // Find the main return statement to add SEO component
    const returnMatch = content.match(/return\s*\(\s*(<|<>)/);
    if (!returnMatch) {
      console.log(`  - Couldn't find main return statement, skipping`);
      return;
    }
    
    const returnIndex = returnMatch.index;
    const openingTagMatch = content.substring(returnIndex).match(/(<|<>)/);
    if (!openingTagMatch) {
      console.log(`  - Couldn't find opening tag in return statement, skipping`);
      return;
    }
    
    const insertIndex = returnIndex + openingTagMatch.index + openingTagMatch[0].length;
    
    // Add SEO component
    const seoComponent = `\n      <SEO 
        title="${pageTitle}"
        description="${pageDescription}"
        canonicalUrl="/${fileName.toLowerCase()}"
      />`;
    
    content = content.slice(0, insertIndex) + 
              seoComponent + 
              content.slice(insertIndex);
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content);
    console.log(`  - Added SEO component successfully`);
    
  } catch (error) {
    console.error(`  - Error processing ${filePath}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('Adding SEO components to page files...');
  
  const pagesDir = path.join(__dirname, '..', 'client', 'src', 'pages');
  const pageFiles = findPageComponents(pagesDir);
  
  console.log(`Found ${pageFiles.length} page components`);
  
  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of pageFiles) {
    try {
      // Skip admin pages as they don't need SEO
      if (file.includes('admin')) {
        console.log(`Skipping admin page: ${path.relative(process.cwd(), file)}`);
        skippedCount++;
        continue;
      }
      
      const contentBefore = fs.readFileSync(file, 'utf8');
      addSeoComponent(file);
      const contentAfter = fs.readFileSync(file, 'utf8');
      
      if (contentBefore !== contentAfter) {
        addedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
      errorCount++;
    }
  }
  
  console.log('\nSummary:');
  console.log(`  - Added SEO components to ${addedCount} files`);
  console.log(`  - Skipped ${skippedCount} files`);
  console.log(`  - Encountered errors in ${errorCount} files`);
  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 