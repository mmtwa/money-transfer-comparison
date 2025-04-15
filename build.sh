#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Install dependencies for the main app
echo "Installing main dependencies..."
npm install

# Navigate to client directory
echo "Moving to client directory..."
cd client

# Install dependencies for the client
echo "Installing client dependencies..."
npm install

# Build the React app using npx to ensure we're using the local installation
echo "Building React app..."
CI=false npm run build

# Move back to root
cd ..

# Create build directory if it doesn't exist
echo "Setting up server build..."
mkdir -p build

# Copy server files to build directory
echo "Copying server files..."
cp -r models routes middleware services config .env.example package.json package-lock.json server.js ./build/

# Copy the built React app
echo "Copying React build files..."
cp -r client/build ./build/client

# Install production dependencies in the build directory
echo "Installing production dependencies in build directory..."
cd build
npm install --omit=dev

echo "Build completed successfully!"