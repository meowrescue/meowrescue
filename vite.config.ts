
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import ssr from 'vite-plugin-ssr/plugin';
import path from 'path';

export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    host: "::",
  },
  plugins: [
    react(),
    ssr({
      prerender: true,
      // Use the correct configuration supported by vite-plugin-ssr
      // Removed the unsupported 'includedAssetsDir' property
    }),
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
    ssrManifest: true, // Enable SSR manifest
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      // Important: For vite-plugin-ssr we need to define the entry-server file
      input: {
        'entry-server': './src/entry-server.tsx',
      },
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
