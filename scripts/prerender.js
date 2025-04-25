/**
 * Simplified prerendering script to generate basic HTML files
 * This is a temporary solution to get the build to complete successfully
 */
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  
  const rootDir = join(__dirname, '..');
  const outDir = join(rootDir, 'dist');
  console.log(`Output directory: ${outDir}`);
  
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
    console.log('Created output directory');
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const route of routes) {
    try {
      // Create directory for the route if needed
      const routeDir = join(outDir, route.substring(1));
      if (route !== '/' && !existsSync(routeDir)) {
        mkdirSync(routeDir, { recursive: true });
      }
      
      // Generate HTML file
      const htmlContent = htmlTemplate(route);
      const outputPath = route === '/' 
        ? join(outDir, 'index.html') 
        : join(outDir, route.substring(1), 'index.html');
      
      writeFileSync(outputPath, htmlContent);
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
  
  writeFileSync(join(outDir, 'sitemap.xml'), sitemapContent);
  console.log('Generated sitemap.xml');
  
  // Create a simple robots.txt
  const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
  writeFileSync(join(outDir, 'robots.txt'), robotsContent);
  console.log('Generated robots.txt');
  
  // Copy pattern.svg to ensure it's available
  const patternSrcPath = join(rootDir, 'public', 'pattern.svg');
  if (existsSync(patternSrcPath)) {
    const patternDestPath = join(outDir, 'pattern.svg');
    copyFileSync(patternSrcPath, patternDestPath);
    console.log('Copied pattern.svg');
  }
}

// Run the function
generateStaticFiles().catch(error => {
  console.error('Fatal error during prerendering:', error);
  process.exit(1);
});
