
const fs = require('fs');
const path = require('path');
const { getStaticPaths } = require('../src/routes');

async function generateSitemap() {
  try {
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

    if (!fs.existsSync(path.join(__dirname, '../dist'))) {
      fs.mkdirSync(path.join(__dirname, '../dist'), { recursive: true });
    }
    
    fs.writeFileSync(path.join(__dirname, '../dist/sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at dist/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
