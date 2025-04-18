
// This script is called after the build to generate a sitemap and ensure manifest files are correctly placed
const fs = require('fs');
const path = require('path');

console.log('Running post-build setup...');

// Ensure the manifest file is accessible to the server
try {
  // Check if client manifest exists
  if (fs.existsSync(path.resolve(__dirname, '../dist/client/.vite/manifest.json'))) {
    // Create the client directory if it doesn't exist
    if (!fs.existsSync(path.resolve(__dirname, '../dist/client'))) {
      fs.mkdirSync(path.resolve(__dirname, '../dist/client'), { recursive: true });
    }
    
    // Copy the manifest to the location where it's expected
    fs.copyFileSync(
      path.resolve(__dirname, '../dist/client/.vite/manifest.json'),
      path.resolve(__dirname, '../dist/client/manifest.json')
    );
    
    console.log('Manifest file copied successfully');
  } else {
    console.log('Client manifest file not found, skipping copy');
  }
  
  // Generate sitemap (placeholder for future implementation)
  console.log('Sitemap generation would happen here');
  
} catch (error) {
  console.error('Error in post-build script:', error);
  process.exit(1);
}

console.log('Post-build setup completed successfully');
