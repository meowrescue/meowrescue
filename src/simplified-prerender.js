/**
 * Simplified prerendering script to generate basic HTML files
 * This is a temporary solution to get the build to complete successfully
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

// Basic routes to generate HTML files for
const routes = [
  '/',
  '/about',
  '/cats',
  '/adopt',
  '/volunteer',
  '/foster',
  '/donate',
  '/events',
  '/blog',
  '/contact',
  '/resources',
  '/success-stories',
  '/financial-transparency',
  '/lost-found',
  '/privacy-policy',
  '/terms-of-service'
];

// Basic HTML template
const htmlTemplate = (route) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meow Rescue${route === '/' ? '' : ' - ' + route.substring(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</title>
  <meta name="description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.">
  <link rel="canonical" href="https://meowrescue.org${route}">
  <link rel="stylesheet" href="/assets/index.css">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
  <div id="root"></div>
  <script>
    window.__PRELOADED_STATE__ = ${JSON.stringify({queryClient: {}})};
  </script>
  <script type="module" src="/assets/main.js"></script>
</body>
</html>`;

// Main function to generate HTML files
async function generateStaticFiles() {
  console.log('Starting simplified prerendering...');
  
  const outDir = path.join(__dirname, '../dist');
  console.log(`Output directory: ${outDir}`);
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log('Created output directory');
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const route of routes) {
    try {
      // Create directory for the route if needed
      const routeDir = path.join(outDir, route.substring(1));
      if (route !== '/' && !fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      // Generate HTML file
      const htmlContent = htmlTemplate(route);
      const outputPath = route === '/' 
        ? path.join(outDir, 'index.html') 
        : path.join(outDir, route.substring(1), 'index.html');
      
      fs.writeFileSync(outputPath, htmlContent);
      console.log(`Generated HTML for ${route} at ${outputPath}`);
      successCount++;
    } catch (error) {
      console.error(`Error generating HTML for ${route}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\nPrerendering complete!`);
  console.log(`Successfully generated: ${successCount}`);
  console.log(`Failed to generate: ${errorCount}`);
  
  // Create a simple sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  const loc = route === '/' ? 'https://meowrescue.org/' : `https://meowrescue.org${route}`;
  const priority = route === '/' ? '1.0' : '0.8';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;
  
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapContent);
  console.log('Generated sitemap.xml');
  
  // Create a simple robots.txt
  const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsContent);
  console.log('Generated robots.txt');
}

// Run the function
generateStaticFiles().catch(error => {
  console.error('Fatal error during prerendering:', error);
  process.exit(1);
});
