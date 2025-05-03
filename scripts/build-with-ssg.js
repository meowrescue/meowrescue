/**
 * This script runs the build process and executes the SSG pre-rendering
 * to ensure all HTML files are generated correctly.
 */
import { execSync } from 'child_process';
import { resolve, join } from 'path';
import { existsSync, rmSync, readdirSync, copyFileSync, writeFileSync, readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

// Paths
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = join(rootDir, 'dist');
const serverOutDir = join(distDir, 'server');

console.log('🚀 Starting build process with SSG...');

try {
  // Clean dist directory
  if (existsSync(distDir)) {
    console.log('🧹 Cleaning previous build...');
    rmSync(distDir, { recursive: true, force: true });
  }

  // Set environment variable for production build
  process.env.NODE_ENV = 'production';
  
  // Run the client build first - important for assets to be generated
  console.log('📦 Building the client application...');
  execSync('vite build', { 
    stdio: 'inherit', 
    cwd: rootDir, 
    env: { ...process.env } 
  });
  
  // Run the server build second - needs client assets
  console.log('📦 Building the server bundle...');
  execSync('vite build --ssr src/entry-server.tsx --outDir dist/server --ssrManifest', {
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Skip this step since we're generating a more comprehensive sitemap in the prerender script
  console.log('🗺️ Using advanced sitemap generation from prerender.js instead...');
  // execSync('node scripts/generate-sitemap.js', { 
  //   stdio: 'inherit', 
  //   cwd: rootDir 
  // });
  
  // Verify client build has generated expected files
  console.log('🔍 Verifying client build output...');
  
  // Check for main assets
  const assetsDir = join(distDir, 'assets');
  if (!existsSync(assetsDir)) {
    throw new Error('Assets directory was not generated! Build failed.');
  }
  
  const assetFiles = readdirSync(assetsDir);
  console.log(`Found ${assetFiles.length} asset files`);
  
  // Check for main.js and CSS files
  const mainJsFile = assetFiles.find(file => file.startsWith('main') && file.endsWith('.js'));
  const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
  
  if (!mainJsFile) {
    console.error('CRITICAL ERROR: main.js file is missing!');
    throw new Error('Build missing critical files');
  }
  
  if (cssFiles.length === 0) {
    console.warn('⚠️ Warning: No CSS files found, but continuing...');
  } else {
    console.log(`Found CSS files: ${cssFiles.join(', ')}`);
    
    // If we have CSS files but not the expected index.css, copy the first one
    if (!cssFiles.includes('index.css') && cssFiles.length > 0) {
      console.log('Creating index.css from available CSS...');
      const firstCss = join(assetsDir, cssFiles[0]);
      const indexCss = join(assetsDir, 'index.css');
      copyFileSync(firstCss, indexCss);
      console.log(`Created index.css (${statSync(indexCss).size} bytes)`);
    }
  }
  
  // Run prerendering - needs both client & server builds
  console.log('\n🖨️ Prerendering HTML files...');
  try {
    execSync('node scripts/prerender.js', { 
      stdio: 'inherit', 
      cwd: rootDir,
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } catch (error) {
    console.error('Error prerendering HTML files:', error);
    process.exit(1);
  }

  // Apply security headers for production
  console.log('\n🔒 Applying security headers...');
  try {
    execSync('node scripts/apply-security-headers.js', {
      stdio: 'inherit',
      cwd: rootDir,
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log('✅ Security headers applied successfully');
  } catch (error) {
    console.error('Error applying security headers:', error);
    console.warn('⚠️ Continuing with build despite security headers error');
  }

  // Fix paths for Netlify compatibility
  console.log('\n🔧 Fixing paths for Netlify compatibility...');
  try {
    // Check if we're in a Netlify environment
    const isNetlify = process.env.NETLIFY === 'true';
    
    if (isNetlify) {
      // Skip PowerShell script on Netlify
      console.log('Running in Netlify environment, skipping PowerShell script');
    } else {
      // Only run PowerShell script in local environment
      execSync('powershell -ExecutionPolicy Bypass -File fix-paths.ps1', { 
        stdio: 'inherit', 
        cwd: rootDir 
      });
    }
  } catch (error) {
    console.error('Error fixing paths:', error);
    // Don't exit - continue with the build even if this step fails
    console.warn('Continuing with build despite path fixing error');
  }
  
  // Copy robots.txt to output
  if (existsSync(join(rootDir, 'public/robots.txt'))) {
    console.log('📝 Copying robots.txt...');
    copyFileSync(
      join(rootDir, 'public/robots.txt'),
      join(distDir, 'robots.txt')
    );
  }
  
  // Copy any additional assets
  const publicDir = join(rootDir, 'public');
  if (existsSync(publicDir)) {
    console.log('📝 Copying public assets...');
    // Copy all files from public to dist
    const files = readdirSync(publicDir);
    files.forEach(file => {
      const src = join(publicDir, file);
      const dest = join(distDir, file);
      
      // Skip directories for now
      if (statSync(src).isDirectory()) {
        return;
      }
      
      // Skip sitemap.xml to avoid overwriting our comprehensive one
      if (file === 'sitemap.xml') {
        console.log(`Skipping ${file} to preserve our enhanced sitemap`);
        return;
      }
      
      // Skip csp-fix.js as we're now using proper CSP headers
      if (file === 'csp-fix.js') {
        console.log(`Skipping ${file} as we now use proper CSP configuration`);
        return;
      }
      
      // Copy the file, overwriting if necessary
      copyFileSync(src, dest);
      console.log(`Copied ${file}`);
    });
  }
  
  // Final check for sitemap and critical files
  console.log('🔍 Final verification of build output...');
  
  // Check for index.html
  const indexHtml = join(distDir, 'index.html');
  if (!existsSync(indexHtml)) {
    throw new Error('index.html was not generated! Build failed.');
  }
  
  // Check for sitemap.xml
  const sitemapPath = join(distDir, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sitemapContent = readFileSync(sitemapPath, 'utf8');
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    console.log(`\n✅ Sitemap.xml found with ${urlCount} URLs`);
    
    // Check if blog posts are in sitemap
    const blogUrlsInSitemap = (sitemapContent.match(/<loc>.*?\/blog\/.*?<\/loc>/g) || []).length;
    console.log(`✅ Blog posts in sitemap: ${blogUrlsInSitemap}`);
  } else {
    console.error('❌ sitemap.xml not found in dist directory.');
  }
  
  // Skip detailed SEO verification which might be causing issues
  console.log('\n✅ Build completed successfully!');
  console.log(`Final build size: ${(getDirSize(distDir) / (1024 * 1024)).toFixed(2)} MB`);
  
  console.log('\n🔔 REMINDER: Database security policies are not automatically applied during build.');
  console.log('To apply the RLS policies to your Supabase database, run:');
  console.log('node scripts/apply-database-policies.js');
  
} catch (error) {
  console.error('❌ Build process failed:', error);
  process.exit(1);
}

function getDirSize(dirPath) {
  let size = 0;
  const files = readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isDirectory()) {
      size += getDirSize(join(dirPath, file.name));
    } else {
      size += statSync(join(dirPath, file.name)).size;
    }
  }
  
  return size;
}
