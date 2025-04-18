
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Import componentTagger only in development mode
  let plugins = [react()];
  
  if (mode === 'development') {
    // Dynamically import in dev mode only
    try {
      const { componentTagger } = require("lovable-tagger");
      plugins.push(componentTagger());
    } catch (e) {
      console.warn('lovable-tagger not available, continuing without it');
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    base: '/',
    plugins: plugins.filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true, // Enable sourcemaps for debugging
      // Optimize for Netlify deployment
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      minify: mode === 'production' ? 'terser' : false, // Disable minification in development
      terserOptions: {
        compress: {
          drop_console: false, // Keep console logs for debugging
          drop_debugger: false, // Keep debugger statements for debugging
        },
      },
      // Improve chunk handling for Netlify
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('@radix-ui')) return 'vendor-radix';
              if (id.includes('tailwind')) return 'vendor-tailwind';
              if (id.includes('tanstack')) return 'vendor-tanstack';
              return 'vendor'; // all other packages
            }
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
      // Reduce memory usage during build
      emptyOutDir: true,
      target: 'es2015',
      reportCompressedSize: false,
    },
  };
});
