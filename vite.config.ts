
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

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
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
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
