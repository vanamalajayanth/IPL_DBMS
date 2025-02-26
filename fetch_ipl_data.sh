#!/bin/bash

# Set up the data directory
DATA_DIR="data"
mkdir -p "$DATA_DIR"

# Define the Cricsheet IPL dataset URL
IPL_DATA_URL="https://cricsheet.org/downloads/ipl_json.zip"

# Download the dataset
echo "Downloading IPL data..."
curl -o "$DATA_DIR/ipl_json.zip" "$IPL_DATA_URL"

# Extract the ZIP file
echo "Extracting files..."
unzip -o "$DATA_DIR/ipl_json.zip" -d "$DATA_DIR"

# Remove the ZIP file after extraction
rm "$DATA_DIR/ipl_json.zip"

echo "IPL data downloaded and extracted to '$DATA_DIR/'."
