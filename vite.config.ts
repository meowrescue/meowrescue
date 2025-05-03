import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import { getViteCSP } from './src/config/security';

export default defineConfig(({ mode, command }) => ({
  server: {
    port: 3000,
    host: "::",
    headers: {
      'Content-Security-Policy': getViteCSP()
    }
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
    ssrManifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
        inlineDynamicImports: false,
      },
    },
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: mode === 'production',
      },
    },
  },
  define: {
    'process.env': process.env,
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  ssr: {
    noExternal: ['react-helmet-async', '@radix-ui/*', 'lucide-react'],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    }
  },
  base: '/',
}));
