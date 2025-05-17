const fs = require('fs');
const path = require('path');

// Function to find all React component files with SEO issues
function findPagesWithIssues(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findPagesWithIssues(filePath, fileList);
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && 
               !file.includes('.test.') && 
               !file.includes('.spec.')) {
      // Check if this file has SEO issues
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip files that already have SEO components
      if (content.includes('import SEO') || 
          content.includes('import { SEO }') || 
          content.includes('import Helmet') || 
          content.includes('import { Helmet }')) {
        return;
      }
      
      // Skip admin pages
      if (filePath.includes('admin')) {
        return;
      }
      
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to generate a page title from file path
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
  if (fileName.toLowerCase().includes('send-money-to-')) {
    const country = fileName.toLowerCase().replace('send-money-to-', '');
    title = `Send Money to ${country.charAt(0).toUpperCase() + country.slice(1)} - Guide & Best Providers`;
  } else if (fileName.includes('Transfers')) {
    title += ' - Money Transfer Guide';
  } else if (fileName.includes('Digital')) {
    title += ' Money Transfer Services';
  } else if (fileName.includes('corridor')) {
    title = `${title} Money Transfer Corridor Guide`;
  }
  
  // Add site suffix for SEO
  title += ' | MyMoneyTransfers';
  
  return title;
}

// Function to generate a description based on file path
function generateDescription(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const relativePath = path.relative(path.join(__dirname, '..', 'client', 'src', 'pages'), filePath);
  
  // Convert from camelCase or snake-case to readable format
  let baseTitle = fileName
    .replace(/([A-Z])/g, ' $1')
    .replace(/-/g, ' ')
    .toLowerCase();
  
  let description = '';
  
  // Country-specific guides
  if (fileName.toLowerCase().includes('send-money-to-')) {
    const country = fileName.toLowerCase().replace('send-money-to-', '');
    description = `Compare the best ways to send money to ${country}. Get live exchange rates, transfer fees, and honest rankings of money transfer providers. 100% independent comparison with no commissions.`;
  } 
  // Corridor guides
  else if (relativePath.includes('corridors')) {
    const corridor = fileName.replace(/([A-Z])/g, ' $1').trim();
    description = `Discover the best money transfer services for the ${corridor} corridor. Compare rates, speeds, and provider features with our 100% independent money transfer guide.`;
  }
  // Transfer amount guides
  else if (fileName.includes('Value') || fileName.includes('Micro')) {
    const amountType = fileName.replace('Transfers', '').replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    description = `Find the best providers for ${amountType} money transfers. Compare rates, fees, and features from multiple providers with unbiased rankings and no commissions.`;
  }
  // Method guides
  else if (relativePath.includes('method')) {
    const method = fileName.replace(/([A-Z])/g, ' $1').trim();
    description = `Learn about ${method.toLowerCase()} money transfer services. Compare features, fees, exchange rates, and service quality with our 100% independent guide.`;
  }
  // Default description for other guides
  else {
    description = `MyMoneyTransfers provides detailed information about ${baseTitle} to help you make informed decisions about international money transfers. Compare providers with our unbiased rankings.`;
  }
  
  return description;
}

// Function to add SEO component to a file
function addSeoToFile(filePath) {
  console.log(`Processing ${path.relative(process.cwd(), filePath)}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has SEO implementation
    if (content.includes('import SEO from') || 
        content.includes('import { SEO }') || 
        content.includes('import Helmet')) {
      console.log(`  - Already has SEO implementation, skipping`);
      return false;
    }
    
    // Generate SEO metadata
    const title = generateTitle(filePath);
    const description = generateDescription(filePath);
    const canonicalUrl = '/' + path.relative(path.join(__dirname, '..', 'client', 'src', 'pages'), filePath)
      .replace(/\\/g, '/') // Convert Windows backslashes to forward slashes
      .replace(/\.jsx?$/, '') // Remove file extension
      .toLowerCase(); // Convert to lowercase
    
    // Find import section and add SEO import
    const importRegex = /import .+ from ["'][^"']+["'];?(\r?\n|$)/g;
    const matches = [...content.matchAll(importRegex)];
    
    if (matches.length === 0) {
      console.log(`  - Couldn't find import section, skipping`);
      return false;
    }
    
    // Get the last import statement
    const lastImport = matches[matches.length - 1];
    const insertIndex = lastImport.index + lastImport[0].length;
    
    // Add SEO import
    content = content.slice(0, insertIndex) + 
              `import SEO from '${relativePath(filePath, 'components/SEO')}';${lastImport[1]}` + 
              content.slice(insertIndex);
    
    // Add SEO component to render section
    const renderRegex = /return\s*\(\s*(<>|<div|<section|<React.Fragment)/;
    const renderMatch = content.match(renderRegex);
    
    if (!renderMatch) {
      console.log(`  - Couldn't find render section, skipping`);
      return false;
    }
    
    // Find the first opening tag after return
    const openingTagIndex = renderMatch.index + renderMatch[0].length;
    const tagEnd = content.indexOf('>', openingTagIndex) + 1;
    
    // Add SEO component after opening tag
    content = content.slice(0, tagEnd) + 
              `\n      <SEO\n        title="${title}"\n        description="${description}"\n        canonicalUrl="${canonicalUrl}"\n      />` + 
              content.slice(tagEnd);
    
    // Write updated content
    fs.writeFileSync(filePath, content);
    console.log(`  - Added SEO component with title and description`);
    return true;
    
  } catch (error) {
    console.error(`  - Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Helper function to calculate relative path for imports
function relativePath(from, to) {
  // Convert absolute paths to relative paths
  const fromDir = path.dirname(from);
  const componentsPath = path.join(__dirname, '..', 'client', 'src', to);
  
  let relPath = path.relative(fromDir, componentsPath);
  
  // Ensure path has proper format for imports
  if (!relPath.startsWith('.')) {
    relPath = './' + relPath;
  }
  
  // Convert Windows backslashes to forward slashes
  return relPath.replace(/\\/g, '/');
}

// Main function
async function main() {
  console.log('Fixing remaining SEO issues...');
  
  const pagesDir = path.join(__dirname, '..', 'client', 'src', 'pages');
  const issueFiles = findPagesWithIssues(pagesDir);
  
  console.log(`Found ${issueFiles.length} pages with SEO issues`);
  
  let fixedCount = 0;
  let skippedCount = 0;
  
  for (const file of issueFiles) {
    const fixed = addSeoToFile(file);
    
    if (fixed) {
      fixedCount++;
    } else {
      skippedCount++;
    }
  }
  
  console.log('\nSummary:');
  console.log(`  - Fixed SEO issues in ${fixedCount} files`);
  console.log(`  - Skipped ${skippedCount} files`);
  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 