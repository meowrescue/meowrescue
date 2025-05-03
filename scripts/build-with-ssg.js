/**
 * This script runs the build process and executes the SSG pre-rendering
 * to ensure all HTML files are generated correctly.
 * Optimized for faster Netlify deployments.
 */
import { execSync } from 'child_process';
import { resolve, join } from 'path';
import { existsSync, rmSync, readdirSync, copyFileSync, readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

// Paths
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = join(rootDir, 'dist');
const serverOutDir = join(distDir, 'server');

console.log('🚀 Starting optimized build process with SSG...');

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
  
  // Verify client build has generated expected files
  console.log('🔍 Verifying client build output...');
  
  // Check for main assets
  const assetsDir = join(distDir, 'assets');
  if (!existsSync(assetsDir)) {
    throw new Error('Assets directory was not generated! Build failed.');
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
      
      // Copy the file, overwriting if necessary
      copyFileSync(src, dest);
    });
  }
  
  // Final check for index.html
  const indexHtml = join(distDir, 'index.html');
  if (!existsSync(indexHtml)) {
    throw new Error('index.html was not generated! Build failed.');
  }
  
  console.log('\n✅ Build completed successfully!');
  console.log(`Final build size: ${(getDirSize(distDir) / (1024 * 1024)).toFixed(2)} MB`);
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
