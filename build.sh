#!/usr/bin/env bash
# Exit on error
set -e

# Install dependencies for the server
npm install

# Navigate to client directory
cd client

# Install dependencies with legacy peer deps flag to avoid dependency conflicts
npm install --legacy-peer-deps

# Install tailwindcss explicitly
npm install --save-dev tailwindcss@latest postcss@latest autoprefixer@latest

# Create a minimal tailwind.config.js if it doesn't exist
if [ ! -f tailwind.config.js ]; then
  echo "module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
      extend: {},
    },
    plugins: [],
  }" > tailwind.config.js
fi

# Create a minimal postcss.config.js if it doesn't exist
if [ ! -f postcss.config.js ]; then
  echo "module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  }" > postcss.config.js
fi

# Build the client using react-scripts directly
npx react-scripts build

# Return to the root directory
cd ..