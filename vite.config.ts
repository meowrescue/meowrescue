import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteReactSSG from 'vite-react-ssg'          // ✅ default export

// All public pages you want pre‑rendered
const routes = [
  '/', '/about', '/cats', '/adopt', '/donate', '/volunteer', '/foster',
  '/blog', '/events', '/resources',
  '/privacy-policy', '/terms-of-service', '/lost-found', '/success-stories',
  '/404',
]

export default defineConfig({
  plugins: [
    react(),

    // Static‑site generation
    viteReactSSG({
      includedRoutes: routes,
      script: 'async',
      formatting: 'minify-html',
    }),
  ],
})
