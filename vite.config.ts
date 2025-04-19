
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Plugin } from 'vite';
import fs from 'fs';
import { resolve } from 'path';

// Define static paths directly in the config to avoid JSX imports
const staticPaths = [
  '/',
  '/about',
  '/cats',
  '/adopt',
  '/adopt/apply',
  '/blog',
  '/events',
  '/resources',
  '/contact',
  '/donate',
  '/volunteer',
  '/volunteer/apply',
  '/foster',
  '/foster/apply',
  '/login',
  '/register',
  '/reset-password',
  '/privacy-policy',
  '/terms-of-service',
  '/lost-found',
  '/404',
];

// Simple SSG plugin that runs AFTER the build is complete
function ssgPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssg',
    enforce: 'post',
    apply: 'build',
    closeBundle: async () => {
      try {
        console.log('Generating static pages for routes:', staticPaths);
        
        // Read the built index.html after Vite has finished building it
        const template = fs.readFileSync(resolve('dist/index.html'), 'utf-8');
        
        // Create a directory for each path and copy the index.html
        for (const path of staticPaths) {
          if (path === '/') continue; // Skip root as it's already generated
          
          const dirPath = resolve(`dist${path}`);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          fs.writeFileSync(resolve(`dist${path}/index.html`), template);
          console.log(`Generated static page for: ${path}`);
        }
        
        console.log('Static site generation complete!');
      } catch (error) {
        console.error('Error during SSG:', error);
      }
    },
  };
}

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    react(),
    ssgPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Make sure we generate a separate JS bundle for each route
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-tooltip', '@radix-ui/react-label'] // Fixed specific UI components instead of directory
        }
      }
    }
  }
});
