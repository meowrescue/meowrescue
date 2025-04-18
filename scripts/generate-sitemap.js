
const fs = require('fs');
const path = require('path');

// Define your routes manually
const routes = [
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
  '/404'
];

async function generateSitemap() {
  try {
    const baseUrl = 'https://meowrescue.org';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const distPath = path.join(__dirname, '../dist');
    
    // Make sure the dist directory exists
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }
    
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at dist/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Don't exit the process with an error code to prevent build failure
    console.log('Could not generate sitemap, but continuing build...');
  }
}

// Run the function
generateSitemap();
