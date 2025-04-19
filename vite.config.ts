
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Plugin } from 'vite';
import fs from 'fs';
import { resolve } from 'path';
import { routes, getStaticPaths } from './src/routes.js';

// Simple SSG plugin
function ssgPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssg',
    closeBundle: async () => {
      // Get all static paths to pre-render
      const paths = await getStaticPaths();
      
      console.log('Generating static pages for routes:', paths);
      
      // Read the built index.html
      const template = fs.readFileSync(resolve('dist/index.html'), 'utf-8');
      
      // Create a directory for each path and copy the index.html
      for (const path of paths) {
        if (path === '/') continue; // Skip root as it's already generated
        
        const dirPath = resolve(`dist${path}`);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        fs.writeFileSync(resolve(`dist${path}/index.html`), template);
        console.log(`Generated static page for: ${path}`);
      }
      
      console.log('Static site generation complete!');
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
          'ui-vendor': ['@/components/ui']
        }
      }
    }
  }
});
