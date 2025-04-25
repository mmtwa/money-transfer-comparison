#!/bin/bash

echo "Starting build..."

# Clean up previous build
echo "Cleaning up previous build..."
rm -rf ./client/build

# Build client
echo "Building React client..."
cd client && npm run build && cd ..

# Ensure provider logos are copied properly
echo "Ensuring provider logos are properly copied..."
mkdir -p ./client/build/images/providers

# Copy provider logos from public to build
echo "Copying provider logos..."
cp -f ./client/public/wiselogo.png ./client/build/images/providers/wise.png
cp -f ./client/public/XELogo.svg ./client/build/images/providers/xe.png
cp -f ./client/public/Western-Union-Logo.png ./client/build/images/providers/westernunion.png

# Also copy them to the client public images/providers directory
mkdir -p ./client/public/images/providers
cp -f ./client/public/wiselogo.png ./client/public/images/providers/wise.png
cp -f ./client/public/XELogo.svg ./client/public/images/providers/xe.png
cp -f ./client/public/Western-Union-Logo.png ./client/public/images/providers/westernunion.png

echo "Logo files copied successfully."
echo "Build completed."
