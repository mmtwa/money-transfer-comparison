#!/bin/bash

# Exit on error
set -e

# Print commands before executing
set -x

# Install dependencies for the main app
echo "Installing server dependencies..."
npm install

# Create necessary directories
echo "Creating image directories..."
mkdir -p client/public/images/providers

# Ensure provider logos are in the right place
if [ -f "client/public/wiselogo.png" ]; then
  mkdir -p client/public/images/providers
  cp client/public/wiselogo.png client/public/images/providers/wise.png
  echo "Copied Wise logo"
fi

if [ -f "client/public/XELogo.svg" ]; then
  mkdir -p client/public/images/providers
  cp client/public/XELogo.svg client/public/images/providers/xe.png
  echo "Copied XE logo"
fi

if [ -f "client/public/Western-Union-Logo.png" ]; then
  mkdir -p client/public/images/providers
  cp client/public/Western-Union-Logo.png client/public/images/providers/westernunion.png
  echo "Copied Western Union logo"
fi

# Navigate to client directory
echo "Moving to client directory..."
cd client

# Install client dependencies
echo "Installing client dependencies..."
npm install --legacy-peer-deps

# Update the client/.env.production file to ensure correct PUBLIC_URL
echo "Updating client .env.production file..."
echo "REACT_APP_API_URL=/api" > .env.production
echo "GENERATE_SOURCEMAP=false" >> .env.production
echo "PUBLIC_URL=/" >> .env.production

# Build the React app
echo "Building React app..."
CI=false npm run build

# Make sure the images directory exists in the build
mkdir -p build/images/providers

# Copy provider logos to build directory
echo "Copying logos to build directory..."
if [ -d "public/images/providers" ]; then
  cp -r public/images/providers/* build/images/providers/
  echo "Copied provider logos to build directory"
fi

# Return to project root
cd ..

# Make sure we have provider images in the build directory as well
mkdir -p client/build/images/providers

# Copy all image assets to the build
if [ -f "client/public/wiselogo.png" ]; then
  cp client/public/wiselogo.png client/build/images/providers/wise.png
fi

if [ -f "client/public/XELogo.svg" ]; then
  cp client/public/XELogo.svg client/build/images/providers/xe.png
fi

if [ -f "client/public/Western-Union-Logo.png" ]; then
  cp client/public/Western-Union-Logo.png client/build/images/providers/westernunion.png
fi

# Verify build directory contents
echo "Verifying build directory contents:"
ls -la client/build/
ls -la client/build/images/ || echo "No images directory found in build!"
ls -la client/build/images/providers/ || echo "No providers directory found in build!"

echo "Build completed successfully!" 