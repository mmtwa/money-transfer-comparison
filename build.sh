#!/usr/bin/env bash
# Exit on error
set -e

# Install dependencies for the server
npm install

# Navigate to client directory
cd client

# Install dependencies 
npm install --legacy-peer-deps

# Create simple CSS files
echo "body { margin: 0; font-family: Arial, sans-serif; }" > src/index.css
echo ".App { text-align: center; }" > src/App.css

# Configure package.json to use react-scripts directly
cat > temp-package.json << EOFMARKER
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.5.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOFMARKER

mv temp-package.json package.json

# Build the client using react-scripts directly
GENERATE_SOURCEMAP=false npm run build

# Make sure the build directory exists and has the right permissions
if [ -d build ]; then
  chmod -R 755 build
else
  echo "Error: Build directory not found!"
  exit 1
fi

# List contents to verify
ls -la build/

# Return to the root directory
cd ..

# Verify server knows where to find the client build files
# Modify server.js if needed to point to the correct build directory
if [ -f server.js ]; then
  echo "Checking server.js configuration..."
  if grep -q "client/build" server.js; then
    echo "Server is configured to use client/build directory"
  else
    echo "Warning: Server may not be correctly configured to serve client build files"
  fi
fi  