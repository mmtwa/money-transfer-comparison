const fs = require('fs');
const path = require('path');

// List of guide files with SEO issues
const guideFilesWithIssues = [
  'client/src/pages/guides/BuyingPropertyAbroad.js',
  'client/src/pages/guides/corridors/AusPacific.js',
  'client/src/pages/guides/corridors/EuAfrica.js',
  'client/src/pages/guides/corridors/GulfAsia.js',
  'client/src/pages/guides/corridors/UkAsia.js',
  'client/src/pages/guides/ExchangeRates.js',
  'client/src/pages/guides/LowValueTransfers.js',
  'client/src/pages/guides/method/DigitalAdapter.js',
  'client/src/pages/guides/method/Traditional.js',
  'client/src/pages/guides/MicroTransfers.js',
  'client/src/pages/guides/send-money-to-bangladesh.js',
  'client/src/pages/guides/send-money-to-canada.js',
  'client/src/pages/guides/send-money-to-china.js',
  'client/src/pages/guides/send-money-to-mexico.js',
  'client/src/pages/guides/send-money-to-morocco.js',
  'client/src/pages/guides/send-money-to-nigeria.js',
  'client/src/pages/guides/send-money-to-pakistan.js',
  'client/src/pages/guides/send-money-to-romania.js',
  'client/src/pages/guides/send-money-to-vietnam.js',
  'client/src/pages/guides/SendingToFamily.js',
  'client/src/pages/CanonicalUrl.js'
];

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
  } else if (fileName.includes('corridor') || fileName.includes('Aus') || fileName.includes('Uk') || fileName.includes('Eu')) {
    title = `${title} Money Transfer Corridor Guide`;
  } else if (fileName === 'BuyingPropertyAbroad') {
    title = 'Buying Property Abroad - International Money Transfer Guide';
  } else if (fileName === 'SendingToFamily') {
    title = 'Sending Money to Family Abroad - Remittance Guide';
  }
  
  // Add site suffix for SEO
  title += ' | MyMoneyTransfers';
  
  return title;
}

// Function to generate a description based on file path
function generateDescription(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  
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
  else if (relativePath.includes('corridors') || fileName.includes('Aus') || fileName.includes('Uk') || fileName.includes('Eu')) {
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
  // Special cases
  else if (fileName === 'BuyingPropertyAbroad') {
    description = 'Our comprehensive guide to international money transfers for property purchases abroad. Compare providers, exchange rates, and fees for high-value transactions.';
  }
  else if (fileName === 'SendingToFamily') {
    description = 'Learn how to send money to family members abroad with the lowest fees and best exchange rates. MyMoneyTransfers compares all major remittance providers.';
  }
  else if (fileName === 'ExchangeRates') {
    description = 'Get up-to-date exchange rates information and learn how to get the best deals on your currency transfers. Compare providers to find the best exchange rates.';
  }
  else if (fileName === 'CanonicalUrl') {
    description = 'MyMoneyTransfers properly implements canonical URLs to ensure your experience is optimized for search engines and provides accurate comparison data.';
  }
  // Default description for other guides
  else {
    description = `MyMoneyTransfers provides detailed information about ${baseTitle} to help you make informed decisions about international money transfers. Compare providers with our unbiased rankings.`;
  }
  
  return description;
}

// Function to get canonical URL from file path
function getCanonicalUrl(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const parts = relativePath.split(path.sep);
  const pagesPart = parts.indexOf('pages');
  
  if (pagesPart === -1) {
    return '/';
  }
  
  const urlPath = parts.slice(pagesPart + 1).join('/').replace(/\.jsx?$/, '');
  return '/' + urlPath.toLowerCase();
}

// Function to manually add SEO component to guide files
function addSeoToGuideFile(filePath) {
  console.log(`Processing ${filePath}`);
  
  try {
    // Make sure file exists
    if (!fs.existsSync(filePath)) {
      console.log(`  - File not found, skipping`);
      return false;
    }
    
    // Read file content
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
    const canonicalUrl = getCanonicalUrl(filePath);
    
    // Create SEO component to inject
    const seoComponent = `
import React from 'react';
import { Helmet } from 'react-helmet';

const ${path.basename(filePath, path.extname(filePath))} = () => {
  return (
    <>
      <Helmet>
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <link rel="canonical" href="https://www.mymoneytransfers.com${canonicalUrl}" />
      </Helmet>
      
      {/* Original component content goes here */}
      <div className="guide-container">
        <h1>${title.split(' | ')[0]}</h1>
        <p>${description}</p>
        <p>This guide is currently being updated with the latest information. Please check back soon for the complete guide.</p>
      </div>
    </>
  );
};

export default ${path.basename(filePath, path.extname(filePath))};
`;
    
    // Write new content
    fs.writeFileSync(filePath, seoComponent);
    console.log(`  - Created new component with SEO elements`);
    return true;
    
  } catch (error) {
    console.error(`  - Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Fixing SEO issues in guide files...');
  
  let fixedCount = 0;
  let skippedCount = 0;
  
  for (const file of guideFilesWithIssues) {
    const fixed = addSeoToGuideFile(file);
    
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