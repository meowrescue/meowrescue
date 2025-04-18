
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { glob } from 'glob';

// Get all routes for pre-rendering
const pages = glob.sync('src/pages/**/*.tsx')
  .filter(page => !page.includes('Admin') && !page.includes('_default'))
  .map(page => {
    // Convert file paths to route paths
    const route = page
      .replace('src/pages/', '/')
      .replace('.tsx', '')
      .replace('/index', '/');
    return route;
  });

export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    host: "::",
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    minify: 'terser',
    // Enable SSG
    ssrManifest: false,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        // Use a function for manualChunks to avoid conflicts with external modules
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group by specific package categories
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('tanstack')) {
              return 'vendor-tanstack';
            }
            // Skip React as it's treated as external
            if (id.includes('react') || id.includes('react-dom')) {
              return; // Skip creating manual chunk for React
            }
            // All other node_modules
            return 'vendor';
          }
        }
      },
    },
  },
}));
