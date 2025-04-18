
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
      // and remove the HTML entry points as they're incompatible
      input: {
        'entry-server': './src/entry-server.tsx',
      },
      output: {
        // Remove the manualChunks configuration that's causing conflicts
        // with React being treated as external
        manualChunks: (id) => {
          // Create chunks for specific third-party dependencies
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Add more specific dependencies as needed
            return 'vendor'; // All other dependencies
          }
        }
      },
    },
  },
}));
