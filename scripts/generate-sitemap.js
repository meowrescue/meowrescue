
// This script is called after the build to generate a sitemap and ensure manifest files are correctly placed
const fs = require('fs');
const path = require('path');

console.log('Running post-build setup...');

// Create necessary directories for client manifest relative to server
function ensureManifestDirectories() {
  try {
    // Source manifest
    const clientManifestPath = path.resolve(__dirname, '../dist/client/.vite/manifest.json');
    
    if (!fs.existsSync(clientManifestPath)) {
      console.error('Could not find client manifest at:', clientManifestPath);
      throw new Error('Client manifest not found');
    }
    
    console.log('Found client manifest at:', clientManifestPath);
    
    // Create all required destination directories
    const directories = [
      // Main manifest for client
      path.resolve(__dirname, '../dist/client'),
      // Manifest accessible from server using relative path
      path.resolve(__dirname, '../dist/server/client'),
      // Alternative path some builds may expect
      path.resolve(__dirname, '../dist/client/server/client')
    ];
    
    // Create each directory if it doesn't exist
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('Created directory:', dir);
      }
    });
    
    // Copy manifest to each destination
    const destinations = [
      path.resolve(__dirname, '../dist/client/manifest.json'),
      path.resolve(__dirname, '../dist/server/client/manifest.json'),
      path.resolve(__dirname, '../dist/client/server/client/manifest.json')
    ];
    
    destinations.forEach(dest => {
      fs.copyFileSync(clientManifestPath, dest);
      console.log('Copied manifest to:', dest);
    });
    
    // Also copy the ssr-manifest.json if it exists
    const ssrManifestPath = path.resolve(__dirname, '../dist/client/.vite/ssr-manifest.json');
    if (fs.existsSync(ssrManifestPath)) {
      const ssrDestinations = [
        path.resolve(__dirname, '../dist/client/ssr-manifest.json'),
        path.resolve(__dirname, '../dist/server/client/ssr-manifest.json'),
        path.resolve(__dirname, '../dist/client/server/client/ssr-manifest.json')
      ];
      
      ssrDestinations.forEach(dest => {
        fs.copyFileSync(ssrManifestPath, dest);
        console.log('Copied SSR manifest to:', dest);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up manifest directories:', error);
    return false;
  }
}

// Dummy sitemap generation function (placeholder for actual implementation)
function generateSitemap() {
  console.log('Sitemap generation would happen here (not implemented yet)');
}

// Main function to run post-build operations
function runPostBuild() {
  console.log('Starting post-build process...');
  
  const manifestSuccess = ensureManifestDirectories();
  if (!manifestSuccess) {
    console.warn('Failed to set up manifest files, build may fail');
  }
  
  generateSitemap();
  
  console.log('Post-build process completed');
}

runPostBuild();
