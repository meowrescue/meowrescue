
// This script generates a sitemap and ensures proper build structure
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { routes } from '../src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running post-build setup...');

// Generate sitemap.xml
function generateSitemap() {
  try {
    const baseUrl = 'https://meowrescue.org';
    const today = new Date().toISOString().slice(0, 10);
    
    // Get all routes from routes.tsx
    const urlset = routes
      .filter(route => route.path !== '*' && !route.path.includes(':') && !route.path.includes('admin'))
      .map(route => {
        const priority = route.path === '/' ? '1.0' : '0.7';
        const changefreq = route.path === '/' ? 'daily' : 'weekly';
        
        return `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join('');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
    
    // Write sitemap to the dist directory
    const sitemapPath = path.resolve(__dirname, '../dist/sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Generated sitemap at:', sitemapPath);
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
}

// Main function to run post-build operations
function runPostBuild() {
  console.log('Starting post-build process...');
  
  const sitemapSuccess = generateSitemap();
  if (!sitemapSuccess) {
    console.warn('Failed to generate sitemap');
  }
  
  // Create robots.txt if it doesn't exist
  const robotsPath = path.resolve(__dirname, '../dist/robots.txt');
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `User-agent: *
Allow: /
Sitemap: https://meowrescue.org/sitemap.xml`;
    
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('Created robots.txt at:', robotsPath);
  }
  
  console.log('Post-build process completed');
}

runPostBuild();
