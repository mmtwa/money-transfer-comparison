const fs = require('fs');
const path = require('path');

// Define paths
const sourcePath = path.join(__dirname, 'client', 'public');
const publicProvidersPath = path.join(__dirname, 'client', 'public', 'images', 'providers');
const buildProvidersPath = path.join(__dirname, 'client', 'build', 'images', 'providers');

// Logo mapping
const providerLogos = [
  { source: 'wiselogo.png', dest: 'wise.png' },
  { source: 'XELogo.svg', dest: 'xe.png' },
  { source: 'Western-Union-Logo.png', dest: 'westernunion.png' }
];

// Ensure directories exist
if (!fs.existsSync(publicProvidersPath)) {
  fs.mkdirSync(publicProvidersPath, { recursive: true });
  console.log(`Created directory: ${publicProvidersPath}`);
}

if (fs.existsSync(path.join(__dirname, 'client', 'build'))) {
  if (!fs.existsSync(buildProvidersPath)) {
    fs.mkdirSync(buildProvidersPath, { recursive: true });
    console.log(`Created directory: ${buildProvidersPath}`);
  }
}

// Copy files to public providers directory
console.log('Copying logos to public/images/providers...');
providerLogos.forEach(logo => {
  const sourcePath = path.join(__dirname, 'client', 'public', logo.source);
  const destPath = path.join(publicProvidersPath, logo.dest);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${logo.source} to ${destPath}`);
    } catch (err) {
      console.error(`Error copying ${logo.source}:`, err);
    }
  } else {
    console.log(`Source file ${logo.source} not found at ${sourcePath}`);
  }
});

// Copy files to build providers directory if build exists
if (fs.existsSync(path.join(__dirname, 'client', 'build'))) {
  console.log('Copying logos to build/images/providers...');
  providerLogos.forEach(logo => {
    const sourcePath = path.join(__dirname, 'client', 'public', logo.source);
    const destPath = path.join(buildProvidersPath, logo.dest);
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${logo.source} to ${destPath}`);
      } catch (err) {
        console.error(`Error copying ${logo.source} to build:`, err);
      }
    } else {
      console.log(`Source file ${logo.source} not found at ${sourcePath}`);
    }
  });
}

console.log('Logo copying complete!'); 