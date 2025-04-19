
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
      prerender: {
        // Enable full prerendering for SSG
        partial: false,
        noExtraDir: true,
        // Explicitly tell vite-plugin-ssr this is static generation only
        disableAutoRun: false,
      }
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
      // We don't specify an HTML entry point as vite-plugin-ssr will handle this
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
      // Libraries that need to be processed by Vite during SSG
      '@radix-ui/*',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ]
  }
}));
