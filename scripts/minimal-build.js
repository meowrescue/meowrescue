// minimal-build.js - A simplified build script for testing
import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Utility for consistent logging with timestamps
function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

// Clean the dist directory
function cleanDist() {
  log('🧹 Cleaning previous build...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(distDir, 'client'), { recursive: true });
  log('✅ Clean completed');
}

// Main build function
async function main() {
  try {
    log('🚀 Starting minimal build process...');
    
    // Clean the dist directory
    cleanDist();
    
    // Build only the client with minimal configuration
    log('📦 Building client application...');
    await build({
      root: rootDir,
      mode: 'production',
      build: {
        outDir: 'dist/client',
        emptyOutDir: true,
        minify: false, // Disable minification
        sourcemap: false, // Disable sourcemaps
        cssCodeSplit: false, // Put all CSS in one file
        rollupOptions: {
          input: path.resolve(rootDir, 'index.html'),
          output: {
            manualChunks: undefined, // Disable code splitting
            entryFileNames: 'assets/[name].js', // Simplify output filenames
            chunkFileNames: 'assets/[name].js',
            assetFileNames: 'assets/[name].[ext]'
          },
          treeshake: false // Disable tree shaking for testing
        }
      },
      logLevel: 'info',
    });
    
    log('✅ Client build completed successfully!');
  } catch (error) {
    log('❌ Error during build:');
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error in main process:', error);
  process.exit(1);
});
