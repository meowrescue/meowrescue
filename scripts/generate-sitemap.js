
// This script generates a sitemap and ensures proper build structure
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running post-build setup...');

// Get static paths - define them directly to avoid import issues
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
  '/privacy-policy',
  '/terms-of-service',
  '/lost-found',
  '/404',
];

// Generate sitemap.xml
function generateSitemap() {
  try {
    const baseUrl = 'https://meowrescue.org';
    const today = new Date().toISOString().slice(0, 10);
    
    // Map all routes to sitemap entries
    const urlset = staticPaths
      .filter(path => path !== '*' && !path.includes(':') && !path.includes('admin') && path !== '/404')
      .map(path => {
        const priority = path === '/' ? '1.0' : '0.7';
        const changefreq = path === '/' ? 'daily' : 'weekly';
        
        return `
  <url>
    <loc>${baseUrl}${path}</loc>
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
    if (!fs.existsSync(path.dirname(sitemapPath))) {
      fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });
    }
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
  if (!fs.existsSync(path.dirname(robotsPath))) {
    fs.mkdirSync(path.dirname(robotsPath), { recursive: true });
  }
  
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
