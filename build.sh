#!/usr/bin/env bash
# Exit on error
set -e

# Install dependencies for the server
npm install

# Navigate to client directory
cd client

# Install dependencies 
npm install --legacy-peer-deps

# Create a temporary version of index.css without Tailwind directives
cp src/index.css src/index.css.bak
sed -i 's/@tailwind/\/\* @tailwind/g' src/index.css

# Modify postcss.config.js to remove tailwind
echo "module.exports = {
  plugins: {
    autoprefixer: {},
  }
}" > postcss.config.js

# Remove tailwind config
if [ -f tailwind.config.js ]; then
  mv tailwind.config.js tailwind.config.js.bak
fi

# Remove craco config (if exists)
if [ -f craco.config.js ]; then
  mv craco.config.js craco.config.js.bak
fi

# Modify package.json to use react-scripts directly
sed -i 's/"build": "craco build"/"build": "react-scripts build"/g' package.json

# Build the client using react-scripts directly
npx react-scripts build

# Return to the root directory
cd ..