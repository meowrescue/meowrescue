
// This script is called after the build to generate a sitemap and ensure manifest files are correctly placed
const fs = require('fs');
const path = require('path');

console.log('Running post-build setup...');

// Ensure the manifest file is accessible to the server
try {
  // First, check if dist/client/.vite/manifest.json exists
  const clientManifestVitePath = path.resolve(__dirname, '../dist/client/.vite/manifest.json');
  
  if (fs.existsSync(clientManifestVitePath)) {
    console.log('Found manifest at', clientManifestVitePath);
    
    // Copy to dist/client/manifest.json
    fs.copyFileSync(
      clientManifestVitePath,
      path.resolve(__dirname, '../dist/client/manifest.json')
    );
    console.log('Copied manifest to dist/client/manifest.json');
    
    // Also ensure the correct structure for the server import
    // Create dist/client directory relative to dist/server
    const serverRelativeClientPath = path.resolve(__dirname, '../dist/server/client');
    if (!fs.existsSync(serverRelativeClientPath)) {
      fs.mkdirSync(serverRelativeClientPath, { recursive: true });
      console.log('Created directory', serverRelativeClientPath);
    }
    
    // Copy the manifest to dist/server/client/manifest.json
    fs.copyFileSync(
      clientManifestVitePath,
      path.resolve(serverRelativeClientPath, 'manifest.json')
    );
    console.log('Copied manifest to dist/server/client/manifest.json');
    
    // Also copy any other required files between client and server as needed
    // (if there are any identified in the error logs)
  } else {
    console.log('Client manifest file not found at expected path:', clientManifestVitePath);
    
    // Try alternate locations
    const altManifestPaths = [
      path.resolve(__dirname, '../dist/.vite/manifest.json'),
      path.resolve(__dirname, '../dist/manifest.json')
    ];
    
    let manifestFound = false;
    for (const altPath of altManifestPaths) {
      if (fs.existsSync(altPath)) {
        console.log('Found manifest at alternate location:', altPath);
        
        // Create all necessary directories
        const clientDir = path.resolve(__dirname, '../dist/client');
        const serverClientDir = path.resolve(__dirname, '../dist/server/client');
        
        if (!fs.existsSync(clientDir)) {
          fs.mkdirSync(clientDir, { recursive: true });
        }
        
        if (!fs.existsSync(serverClientDir)) {
          fs.mkdirSync(serverClientDir, { recursive: true });
        }
        
        // Copy to both required locations
        fs.copyFileSync(altPath, path.resolve(clientDir, 'manifest.json'));
        fs.copyFileSync(altPath, path.resolve(serverClientDir, 'manifest.json'));
        
        console.log('Copied manifest to required locations');
        manifestFound = true;
        break;
      }
    }
    
    if (!manifestFound) {
      console.warn('Unable to find manifest file in any expected location');
    }
  }
  
  // Generate sitemap (placeholder for future implementation)
  console.log('Sitemap generation would happen here');
  
} catch (error) {
  console.error('Error in post-build script:', error);
  process.exit(1);
}

console.log('Post-build setup completed successfully');
