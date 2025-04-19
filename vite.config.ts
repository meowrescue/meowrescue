
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import ssr from 'vite-plugin-ssr/plugin';

export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    host: "::",
  },
  plugins: [
    react(),
    ssr({
      prerender: mode === 'production' ? {
        partial: true,
        // Include dynamic routes that should be pre-rendered
        noExtraDir: true,
      } : false,
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
  ssr: {
    noExternal: [
      // Libraries that need to be processed by Vite during SSR
      '@radix-ui/*',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ]
  }
}));
