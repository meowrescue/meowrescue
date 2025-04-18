
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
        manualChunks: {
          react: ['react', 'react-dom'],
          reactRouter: ['react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
          ],
        },
      },
    },
  },
}));
