import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Plugin } from 'vite';
import fs from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { componentTagger } from 'lovable-tagger';

// Define static paths directly in the config to avoid any imports
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

// SSG plugin that uses prerender script after the build is complete
function ssgPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssg',
    apply: 'build',
    closeBundle: {
      sequential: true, // Make sure this runs after the build is complete
      order: 'post',    // Run after all other plugins
      handler: async () => {
        try {
          console.log('Starting static pre-rendering for routes:', staticPaths);
          
          // Execute our prerender script as a separate process
          execSync('node scripts/prerender.js', { stdio: 'inherit' });
          
          console.log('Static site generation complete!');
        } catch (error) {
          console.error('Error during SSG:', error);
          throw error; // Re-throw to make build fail if SSG fails
        }
      },
    }
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    ssgPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-tooltip', '@radix-ui/react-label'] 
        }
      }
    }
  }
}));
