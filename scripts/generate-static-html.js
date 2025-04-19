
/**
 * This script is used to generate static HTML for the public routes
 * It will be called during the build process
 */
const fs = require('fs');
const path = require('path');

// Import static paths directly
const staticPaths = [
  '/',
  '/about',
  '/cats',
  '/adopt',
  '/adopt/apply',
  '/blog',
  '/events',
  '/resources',
  '/contact',
  '/donate',
  '/volunteer',
  '/volunteer/apply',
  '/foster',
  '/foster/apply',
  '/login',
  '/register',
  '/reset-password',
  '/privacy-policy',
  '/terms-of-service',
  '/lost-found',
  '/404',
];

// Get all static paths to pre-render
async function generateStaticHTML() {
  try {
    console.log('Generating static HTML for public routes...');
    
    // Read the built index.html
    const distPath = path.resolve(__dirname, '../dist');
    const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    
    // Create directories and HTML files for each path
    for (const routePath of staticPaths) {
      if (routePath === '/') continue; // Skip root, it's already generated
      
      const dirPath = path.join(distPath, routePath.substring(1));
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(path.join(dirPath, 'index.html'), template);
      console.log(`Generated static HTML for: ${routePath}`);
    }
    
    console.log('Static HTML generation complete!');
  } catch (error) {
    console.error('Error generating static HTML:', error);
    process.exit(1);
  }
}

generateStaticHTML();
