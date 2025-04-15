#!/usr/bin/env bash
# Exit on error
set -e

# Install root dependencies
npm install

# Navigate to client directory, install dependencies and build
cd client
npm install
npm run build

# Return to the root directory
cd ..

# Install server dependencies (if you haven't already from the root)
npm install