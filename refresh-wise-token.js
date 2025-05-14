const fs = require('fs');
const path = require('path');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('==========================================================');
console.log('               WISE API TOKEN REFRESH TOOL                ');
console.log('==========================================================');
console.log('This tool will help you update your Wise API token in the .env file');
console.log('');
console.log('Current environment:');

// Check current token
const currentToken = process.env.WISE_CLIENT_SECRET;
if (currentToken) {
  console.log(`Current token: ${currentToken.substring(0, 6)}...${currentToken.substring(currentToken.length - 6)}`);
  console.log(`Token length: ${currentToken.length} characters`);
} else {
  console.log('No token currently set');
}

console.log('\nTo generate a new token:');
console.log('1. Go to https://wise.com/settings/api-tokens');
console.log('2. Sign in to your Wise account');
console.log('3. Create a new API token with "rates" permissions');
console.log('4. Copy the generated token');
console.log('');

// Ask for the new token
rl.question('Enter your new Wise API token: ', (newToken) => {
  if (!newToken) {
    console.log('No token provided. Operation canceled.');
    rl.close();
    return;
  }

  if (newToken.length < 20) {
    console.log('Error: The token you entered is too short. Wise API tokens are typically longer.');
    rl.close();
    return;
  }

  // Load .env file
  const envPath = path.resolve('.env');
  let envContent;
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.error('Error reading .env file:', error);
    rl.close();
    return;
  }

  // Update the WISE_CLIENT_SECRET line
  let updatedContent;
  if (envContent.includes('WISE_CLIENT_SECRET=')) {
    // Replace existing token
    updatedContent = envContent.replace(
      /WISE_CLIENT_SECRET=.*/,
      `WISE_CLIENT_SECRET=${newToken}`
    );
  } else {
    // Add token if it doesn't exist
    updatedContent = `${envContent}\nWISE_CLIENT_SECRET=${newToken}`;
  }

  // Write updated content back to .env file
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('\n✅ Successfully updated WISE_CLIENT_SECRET in .env file');
    console.log(`New token: ${newToken.substring(0, 6)}...${newToken.substring(newToken.length - 6)}`);
    console.log('\nIMPORTANT: You need to restart your server for the new token to take effect');
  } catch (error) {
    console.error('Error writing to .env file:', error);
  }

  // Close readline interface
  rl.close();
}); 