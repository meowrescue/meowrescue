
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode, command }) => ({
  server: {
    port: 8080,
    host: "::",
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    minify: mode === 'production' ? 'terser' : false,
    ssrManifest: true, // Enabled for proper SSG support
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // Use predictable, simple file names for assets
        entryFileNames: 'assets/[name].js', // Keep main.js as is for easier reference
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // For CSS files, use a consistent, simple name
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Ensure proper exports for SSR/SSG
        inlineDynamicImports: false,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  ssr: {
    // List external dependencies that shouldn't be bundled in SSR build
    noExternal: ['react-helmet-async', '@radix-ui/*', 'lucide-react'],
    // Enable thread optimization
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    }
  },
  base: '/', // Ensure base URL is set correctly
}));
