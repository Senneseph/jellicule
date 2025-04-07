#!/bin/bash

# Build script for the Jellicule UI example

# Create the dist directory if it doesn't exist
mkdir -p dist

# Copy the built library files
cp ../dist/jellicule.js dist/
cp ../dist/jellicule.min.js dist/

# Copy the CSS files
mkdir -p styles
cp ../styles/reset.css styles/
cp ../styles/jellicule.css styles/

echo "Build completed successfully!"
