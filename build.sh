#!/bin/bash

# Install dependencies for the main app
echo "Installing main dependencies..."
npm install

# Install and build client app
echo "Moving to client directory..."
cd client

echo "Installing client dependencies..."
npm install

echo "Building React app..."
npx @craco/craco build

# Return to project root
cd ..

echo "Build completed successfully!"
