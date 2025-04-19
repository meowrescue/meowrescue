
/**
 * This script is used to generate static HTML for the public routes
 * It will be called during the build process
 */
const fs = require('fs');
const path = require('path');
// Import from routes.js which re-exports from routes.tsx
const routesModule = require('../src/routes.js');
const { routes } = routesModule;

// Get all static paths to pre-render
async function generateStaticHTML() {
  try {
    console.log('Generating static HTML for public routes...');
    
    // Read the built index.html
    const distPath = path.resolve(__dirname, '../dist');
    const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    
    // Get only public routes (non-admin routes)
    const publicRoutes = routes.filter(route => 
      !route.path.startsWith('/admin') && 
      !route.path.includes(':') && // Skip dynamic routes
      route.path !== '*'          // Skip catch-all route
    );
    
    console.log(`Found ${publicRoutes.length} public routes to generate static HTML for:`);
    publicRoutes.forEach(route => console.log(`- ${route.path}`));
    
    // Create directories and HTML files for each public route
    for (const route of publicRoutes) {
      if (route.path === '/') continue; // Skip root, it's already generated
      
      const routePath = route.path === '/' ? '' : route.path;
      const dirPath = path.join(distPath, routePath);
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(path.join(dirPath, 'index.html'), template);
      console.log(`Generated static HTML for: ${route.path}`);
    }
    
    console.log('Static HTML generation complete!');
  } catch (error) {
    console.error('Error generating static HTML:', error);
    process.exit(1);
  }
}

generateStaticHTML();
