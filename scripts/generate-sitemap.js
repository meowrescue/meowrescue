import { generateSitemap } from '../src/utils/sitemapGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

generateSitemap(outputPath)
  .then(() => {
    console.log('Sitemap generated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  });
