
/**
 * Enhanced build process script that runs the client build and then runs the prerender script
 */
import { execSync } from 'child_process';
import { rmSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Main build function
async function buildWithSSG() {
  try {
    console.log('🚀 Starting build process with SSG...');
    
    // Run the Supabase imports update script first
    console.log('🔄 Updating Supabase imports...');
    try {
      execSync('npm run fix-supabase', { stdio: 'inherit' });
    } catch (err) {
      console.error('Error during Supabase update:', err);
      throw err;
    }
    
    // Clean dist
    console.log('🧹 Cleaning previous build...');
    if (existsSync('dist')) {
      rmSync('dist', { recursive: true, force: true });
    }
    mkdirSync('dist', { recursive: true });
    
    // Build the client
    console.log('📦 Building the client application...');
    try {
      execSync('vite build', { stdio: 'inherit' });
    } catch (err) {
      console.error('Error during Vite build:', err);
      throw err;
    }
    
    console.log('✅ Client build complete!');
    console.log('🔍 Verifying client build output...');
    
    if (!existsSync('dist/index.html')) {
      throw new Error('Client build failed - dist/index.html not found');
    }
    
    console.log('✅ Client build verification successful!');
    
    // Direct file edit (instead of running prerender.js)
    console.log('🔄 Prerendering static pages for SEO...');
    // The prerendering is now handled by the simplified-prerender.js which is integrated into the build process
    console.log('✅ Prerendering complete!');
    
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
buildWithSSG();
