/**
 * Ad Partner Setup Script
 * 
 * This script helps create the necessary directory structure and update configuration
 * for a new ad partner. It can be run with Node.js to automate the setup process.
 * 
 * Usage:
 * node createAdPartner.js partner-id "Partner Name"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const CONFIG_FILE = path.resolve(__dirname, '../config/adPartners.js');

/**
 * Main function to create a new ad partner
 */
async function createAdPartner() {
  try {
    // Get command line arguments
    const partnerId = process.argv[2];
    const partnerName = process.argv[3] || 'New Partner';
    
    if (!partnerId) {
      console.error('Error: Partner ID is required');
      console.log('Usage: node createAdPartner.js partner-id "Partner Name"');
      process.exit(1);
    }
    
    // Create directory for partner assets
    const partnerDir = path.join(PUBLIC_DIR, 'partners', partnerId);
    createDirectoryIfNotExists(partnerDir);
    
    // Create placeholder files for each screen size
    createPlaceholder(partnerDir, 'mobile.jpg', '640x1200');
    createPlaceholder(partnerDir, 'tablet.jpg', '1024x1200');
    createPlaceholder(partnerDir, 'desktop.jpg', '1920x1080');
    
    // Create WebP versions (future-proofing)
    createPlaceholder(partnerDir, 'mobile.webp', '640x1200');
    createPlaceholder(partnerDir, 'tablet.webp', '1024x1200');
    createPlaceholder(partnerDir, 'desktop.webp', '1920x1080');
    
    // Add partner to configuration file
    updateConfigFile(partnerId, partnerName);
    
    console.log('✅ Ad partner created successfully!');
    console.log(`📁 Partner assets directory: ${partnerDir}`);
    console.log(`🖼️  Remember to replace placeholder images with actual ad creative`);
    console.log(`🔄 Update the partner configuration in ${CONFIG_FILE} with campaign dates and priority`);
  } catch (error) {
    console.error('Error creating ad partner:', error.message);
    process.exit(1);
  }
}

/**
 * Creates a directory if it doesn't exist
 */
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Creates a placeholder image file with text indicating dimensions
 */
function createPlaceholder(dir, filename, dimensions) {
  const filePath = path.join(dir, filename);
  
  // For a real implementation, this would create an actual image with canvas or sharp
  // For this example, we'll just create an empty file
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `Placeholder for ${dimensions} image`);
    console.log(`Created placeholder: ${filePath}`);
  }
}

/**
 * Updates the configuration file with a new partner
 */
function updateConfigFile(partnerId, partnerName) {
  try {
    // Read the current config file
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Find the position to insert the new partner (before the last export)
    const lastExportPos = configContent.lastIndexOf('export default');
    
    if (lastExportPos === -1) {
      throw new Error('Could not find export statement in config file');
    }
    
    // Create the new partner configuration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Default 1 month campaign
    
    const newPartnerConfig = `
  // ${partnerName} campaign
  ${partnerId}: {
    name: '${partnerName}',
    active: false, // Set to true when ready to go live
    startDate: '${startDate.toISOString().split('T')[0]}',
    endDate: '${endDate.toISOString().split('T')[0]}',
    priority: 5, // Adjust as needed
    assets: {
      mobile: {
        src: '/partners/${partnerId}/mobile.webp',
        width: 640,
        height: 1200,
      },
      tablet: {
        src: '/partners/${partnerId}/tablet.webp',
        width: 1024,
        height: 1200,
      },
      desktop: {
        src: '/partners/${partnerId}/desktop.webp',
        width: 1920,
        height: 1080,
      },
    },
    metadata: {
      altText: '${partnerName} Advertisement',
      trackingId: '${partnerId}-${startDate.getFullYear()}',
    }
  },
`;
    
    // Insert the new partner before the export
    const updatedContent = 
      configContent.slice(0, lastExportPos) + 
      newPartnerConfig + 
      configContent.slice(lastExportPos);
    
    // Write back to the file
    fs.writeFileSync(CONFIG_FILE, updatedContent, 'utf8');
    console.log(`Updated config file with ${partnerId}`);
  } catch (error) {
    console.error('Error updating config file:', error.message);
    // Continue execution rather than exiting - the directories are still useful
  }
}

// Execute the script
createAdPartner(); 