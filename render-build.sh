#!/bin/bash

# Exit on error
set -e

# Install dependencies for the main app
echo "Installing server dependencies..."
npm install

# Create necessary directories
echo "Creating image directories..."
mkdir -p client/public/images/providers

# Ensure provider logos are in the right place
if [ -f "client/public/wiselogo.png" ] && [ ! -f "client/public/images/providers/wise.png" ]; then
  cp client/public/wiselogo.png client/public/images/providers/wise.png
  echo "Copied Wise logo"
fi

if [ -f "client/public/XELogo.svg" ] && [ ! -f "client/public/images/providers/xe.png" ]; then
  cp client/public/XELogo.svg client/public/images/providers/xe.png
  echo "Copied XE logo"
fi

if [ -f "client/public/Western-Union-Logo.png" ] && [ ! -f "client/public/images/providers/westernunion.png" ]; then
  cp client/public/Western-Union-Logo.png client/public/images/providers/westernunion.png
  echo "Copied Western Union logo"
fi

# Navigate to client directory
echo "Moving to client directory..."
cd client

# Install client dependencies
echo "Installing client dependencies..."
npm install --force

# Build the React app
echo "Building React app..."
CI=false npm run build

# Make sure the images directory exists in the build
mkdir -p build/images/providers

# Copy provider logos to build directory if needed
if [ -d "public/images/providers" ]; then
  cp -r public/images/providers/* build/images/providers/
  echo "Copied provider logos to build directory"
fi

# Return to project root
cd ..

echo "Build completed successfully!" 