
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base URL
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://meowrescue.org' 
  : 'http://localhost:8080';

console.log(`Generating sitemap with ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} base URL: ${baseUrl}`);

// Define the pages to include in the sitemap
const pages = [
  '/',
  '/about',
  '/adopt',
  '/cats',
  '/blog',
  '/events',
  '/volunteer',
  '/foster',
  '/donate',
  '/resources',
  '/contact',
  '/login',
  '/register',
  '/financial-transparency',
  '/lost-found'
];

// Generate the sitemap XML content
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Add each page to the sitemap
pages.forEach((page) => {
  sitemap += '  <url>\n';
  sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
  sitemap += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
  sitemap += '    <changefreq>weekly</changefreq>\n';
  sitemap += '    <priority>' + (page === '/' ? '1.0' : '0.8') + '</priority>\n';
  sitemap += '  </url>\n';
});

sitemap += '</urlset>';

// Write the sitemap to a file
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully in dist/sitemap.xml!');

// Copy the sitemap to the public folder for development
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap copied to public folder successfully!');
}

// Copy to root directory for maximum discoverability
fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), sitemap);
console.log('Sitemap copied to root directory for maximum discoverability');

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;

// Write robots.txt to both dist and public directories
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
console.log('robots.txt generated successfully in dist/robots.txt!');

if (fs.existsSync(publicDir)) {
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt copied to public folder successfully!');
}

// Copy to root directory for maximum discoverability
fs.writeFileSync(path.join(__dirname, '..', 'robots.txt'), robotsTxt);
console.log('robots.txt copied to root directory for maximum discoverability');
