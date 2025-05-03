/**
 * Simplified build script optimized for Netlify deployments
 * This script skips the extensive prerendering to speed up build times
 */
import { execSync } from 'child_process';
import { resolve, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Paths
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('🚀 Starting optimized Netlify build process...');

try {
  // Set environment variable for production build
  process.env.NODE_ENV = 'production';
  
  // Run the client build
  console.log('📦 Building the client application...');
  execSync('vite build', { 
    stdio: 'inherit', 
    cwd: rootDir, 
    env: { ...process.env } 
  });
  
  // Run the server build for SSR
  console.log('📦 Building the server bundle...');
  execSync('vite build --ssr src/entry-server.tsx --outDir dist/server --ssrManifest', {
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Generate basic HTML files for main routes
  console.log('📄 Generating basic HTML files...');
  
  // Get the template HTML
  const templatePath = join(distDir, 'index.html');
  if (!existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }
  
  // Read the template
  const template = readFileSync(templatePath, 'utf8');
  
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
    '/success-stories',
    '/financial-transparency',
    '/lost-found'
  ];
  
  // Create HTML files for basic routes
  for (const route of routes) {
    if (route === '/') continue; // Skip root as it already exists
    
    const filePath = join(distDir, route.substring(1), 'index.html');
    const dir = join(distDir, route.substring(1));
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(filePath, template);
    console.log(`Generated: ${route}`);
  }
  
  // Create a basic sitemap.xml
  console.log('🗺️ Generating basic sitemap.xml...');
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  return `  <url>
    <loc>https://meowrescue.org${route === '/' ? '' : route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
}).join('\n')}
</urlset>`;
  
  writeFileSync(join(distDir, 'sitemap.xml'), sitemapContent);
  
  // Create a basic robots.txt
  console.log('🤖 Generating robots.txt...');
  
  const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin*
Disallow: /login
Disallow: /dashboard

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
  
  writeFileSync(join(distDir, 'robots.txt'), robotsContent);
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build process failed:', error);
  process.exit(1);
}
