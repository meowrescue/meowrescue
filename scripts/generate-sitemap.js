// Sitemap generator for Meow Rescue
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Function to validate URLs
const validateUrl = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error(`❌ Invalid URL in sitemap: ${url}`, error);
    return false;
  }
};

// Forcibly set the base URL for SEO to production domain
const baseUrl = "https://meowrescue.org";
console.log(`Generating sitemap with production base URL: ${baseUrl}`);

// Define all routes to include in the sitemap (paths only here)
const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/cats', priority: '0.9', changefreq: 'daily' },
  { path: '/adopt', priority: '0.9', changefreq: 'weekly' },
  { path: '/donate', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/volunteer', priority: '0.8', changefreq: 'weekly' },
  { path: '/foster', priority: '0.8', changefreq: 'weekly' },
  { path: '/events', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/success-stories', priority: '0.7', changefreq: 'weekly' },
  { path: '/resources', priority: '0.7', changefreq: 'monthly' },
  { path: '/lost-found', priority: '0.7', changefreq: 'weekly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  // Add dynamic/detail route examples
  { path: '/cats/felix', priority: '0.8', changefreq: 'weekly' },
  { path: '/cats/luna', priority: '0.8', changefreq: 'weekly' },
  { path: '/cats/max', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog/caring-for-senior-cats', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog/kitten-season-tips', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog/adoption-success-stories', priority: '0.7', changefreq: 'monthly' },
];

// Always use production absolute links
function createUrl(path) {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${base}${path}`;
}

// Generate sitemap
const generateSitemap = async () => {
  const today = new Date().toISOString().split('T')[0];

  const sitemapUrls = [];
  for (const route of routes) {
    const fullUrl = createUrl(route.path);
    if (await validateUrl(fullUrl)) {
      sitemapUrls.push({
        url: fullUrl,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
      });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapUrls.map(url => `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${url.url}" />
    <xhtml:link rel="alternate" hreflang="es" href="${createUrl('/es' + url.url.split(baseUrl)[1])}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${url.url}" />
  </url>
`).join('')}
</urlset>
`;

  // Create output folders if necessary
  const distPath = join(dirname(fileURLToPath(import.meta.url)), '../dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  fs.writeFileSync(join(distPath, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully in dist/sitemap.xml!');

  const publicPath = join(dirname(fileURLToPath(import.meta.url)), '../public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  fs.writeFileSync(join(publicPath, 'sitemap.xml'), sitemap);
  console.log('Sitemap copied to public folder successfully!');

  fs.writeFileSync(join(dirname(fileURLToPath(import.meta.url)), '../sitemap.xml'), sitemap);
  console.log('Sitemap copied to root directory for maximum discoverability');
}
generateSitemap();
