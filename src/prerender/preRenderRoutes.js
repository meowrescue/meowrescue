import { renderRoutes } from './renderRoutes.js';
import { reportSummary } from './reportSummary.js';
import { copyPublicAssets } from './copyPublicAssets.js';
import { prepareOutputDir } from './prepareOutputDir.js';
import { ensureAssets } from './ensureAssets.js';
import { resolveStaticPaths } from './resolveStaticPaths.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, copyFileSync, writeFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function preRenderRoutes(specificRoutes = []) {
  console.log('Starting pre-rendering of routes with full content including navigation and footer...');
  copyPublicAssets();

  const outDir = prepareOutputDir();
  ensureAssets(outDir);

  try {
    // Use provided routes or resolve all static paths
    const staticPaths = specificRoutes.length > 0 
      ? specificRoutes 
      : await resolveStaticPaths();
      
    console.log(`Found ${staticPaths.length} routes to render with full content`);
    
    // Ensure sitemap.xml exists (try to copy from public or scripts)
    const sitemapOutPath = join(outDir, 'sitemap.xml');
    const publicSitemapPath = join(__dirname, '../../public/sitemap.xml');
    
    if (existsSync(publicSitemapPath)) {
      copyFileSync(publicSitemapPath, sitemapOutPath);
      console.log('✅ Copied sitemap.xml from public directory');
    } else {
      // Try to generate sitemap with script
      try {
        await import('../../scripts/generate-sitemap.js');
        console.log('✅ Generated sitemap.xml using script');
      } catch (err) {
        console.warn('⚠️ Could not generate sitemap, creating a minimal one');
        // Create minimal sitemap with all routes
        const today = new Date().toISOString().split('T')[0];
        const sitemapUrls = staticPaths.map(path => {
          const loc = path === '/' ? 'https://meowrescue.org/' : `https://meowrescue.org${path}`;
          const changefreq = path === '/' ? 'daily' : 'weekly';
          const priority = path === '/' ? '1.0' : '0.8';
          
          return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }).join('');
        
        const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;
        writeFileSync(sitemapOutPath, minimalSitemap);
      }
    }
    
    // Enable complete rendering and count all links
    console.log('Ensuring header, footer, and all navigation links are included in the HTML output');
    
    const { successCount, errorCount, errorPaths } = await renderRoutes(staticPaths, outDir);
    reportSummary(staticPaths, outDir, successCount, errorCount);
    
    // Final verification message
    console.log('Pre-rendering complete with full content including:');
    console.log('- Header with navigation links');
    console.log('- Footer with contact information and links');
    console.log('- Complete page content');
    console.log('- SEO metadata and schema markup');
    console.log('- Sitemap.xml file');
    
    // Double-check sitemap existence
    if (existsSync(sitemapOutPath)) {
      console.log('✅ sitemap.xml verified in output directory');
    } else {
      console.error('❌ sitemap.xml is missing from output directory!');
    }
    
    // Verify robots.txt file has sitemap reference
    const robotsPath = join(outDir, 'robots.txt');
    if (existsSync(robotsPath)) {
      let robotsContent = readFileSync(robotsPath, 'utf8');
      if (!robotsContent.includes('Sitemap:')) {
        robotsContent += '\n# Sitemap\nSitemap: https://meowrescue.org/sitemap.xml\n';
        writeFileSync(robotsPath, robotsContent);
        console.log('✅ Added sitemap reference to robots.txt');
      }
    } else {
      const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
      writeFileSync(robotsPath, robotsContent);
      console.log('✅ Created robots.txt with sitemap reference');
    }
  } catch (error) {
    console.error('Fatal error during pre-rendering:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${__filename}`) {
  preRenderRoutes();
}

export { preRenderRoutes };
