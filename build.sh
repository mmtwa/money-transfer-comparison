#!/usr/bin/env bash
# Exit on error
set -e

# Install dependencies for the server
npm install

# Install dependencies and build the client
cd client
npm install
# Use react-scripts directly instead of craco for building
npx react-scripts build
cd ..