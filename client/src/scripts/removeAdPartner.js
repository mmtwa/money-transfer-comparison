/**
 * Ad Partner Removal Script
 * 
 * This script removes an ad partner by:
 * - Deleting their directory from the public/partners folder
 * - Removing their entry from the adPartners.js config file
 * 
 * Usage:
 * node removeAdPartner.js partner-id
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const CONFIG_FILE = path.resolve(__dirname, '../config/adPartners.js');

/**
 * Main function to remove an ad partner
 */
function removeAdPartner() {
  try {
    // Get command line arguments
    const partnerId = process.argv[2];
    
    if (!partnerId) {
      console.error('Error: Partner ID is required');
      console.log('Usage: node removeAdPartner.js partner-id');
      process.exit(1);
    }
    
    // Check if partner directory exists
    const partnerDir = path.join(PUBLIC_DIR, 'partners', partnerId);
    const dirExists = fs.existsSync(partnerDir);
    
    if (dirExists) {
      // Remove directory
      fs.rmSync(partnerDir, { recursive: true, force: true });
      console.log(`Removed directory: ${partnerDir}`);
    } else {
      console.log(`Partner directory not found: ${partnerDir}`);
    }
    
    // Remove from configuration file
    removeFromConfigFile(partnerId);
    
    console.log('✅ Ad partner removed successfully!');
  } catch (error) {
    console.error('Error removing ad partner:', error.message);
    process.exit(1);
  }
}

/**
 * Removes partner from the configuration file
 */
function removeFromConfigFile(partnerId) {
  try {
    // Check if config file exists
    if (!fs.existsSync(CONFIG_FILE)) {
      console.log(`Configuration file not found: ${CONFIG_FILE}`);
      return;
    }
    
    // Read the current config file
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Create regex to match the partner entry
    // This looks for the partner ID followed by a block of code in curly braces
    const partnerRegex = new RegExp(`[ \\t]*${partnerId}[ \\t]*:[ \\t]*{[^}]*},?`, 's');
    
    // Check if partner exists in the config
    if (!partnerRegex.test(configContent)) {
      console.log(`Partner '${partnerId}' not found in configuration file`);
      return;
    }
    
    // Remove the partner entry from the config
    const updatedContent = configContent.replace(partnerRegex, '');
    
    // Write back to the file
    fs.writeFileSync(CONFIG_FILE, updatedContent, 'utf8');
    console.log(`Removed partner '${partnerId}' from configuration file`);
  } catch (error) {
    console.error('Error updating config file:', error.message);
  }
}

// Execute the script
removeAdPartner(); 