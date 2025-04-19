// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteReactSSG } from 'vite-react-ssg'   // ←  named export

// Routes you want prerendered (add / remove as needed)
const routes = [
  '/', '/about', '/cats', '/adopt', '/donate', '/volunteer', '/foster',
  '/blog', '/events', '/resources',
  '/privacy-policy', '/terms-of-service', '/lost-found', '/success-stories',
  '/404',
]

export default defineConfig({
  plugins: [
    react(),
    viteReactSSG({
      includedRoutes: routes,
      script: 'async',
      formatting: 'minify-html',
    }),
  ],
})
