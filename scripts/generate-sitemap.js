
const fs = require('fs');
const path = require('path');
const { getStaticPaths } = require('../dist/server/routes');

async function generateSitemap() {
  const baseUrl = 'https://meowrescue.org';
  const paths = await getStaticPaths();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${path === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../dist/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully at dist/sitemap.xml');
}

generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
