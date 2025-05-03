import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => ({
  envPrefix: 'VITE_',
  server: {
    port: 8080,
    host: "::",
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@integrations": path.resolve(__dirname, "./src/integrations"),
      "@supabase": path.resolve(__dirname, "./src/integrations/supabase"),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    esbuildOptions: {
      target: 'es2020',
      platform: 'browser',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    ssrManifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/font|woff|woff2|eot|ttf|otf/.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        inlineDynamicImports: false,
      },
    },
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
    },
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
  },
  ssr: {
    noExternal: ['react-helmet-async', '@radix-ui/*', 'lucide-react', '@supabase/supabase-js'],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  },
  base: '/',
}));
