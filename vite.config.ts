import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { ViteSSG } from 'vite-react-ssg'

// Static routes you want HTML files for
const pages = [
  '/',                // home
  '/about',
  '/cats',
  '/adopt',
  '/donate',
  '/volunteer',
  '/foster',
  '/blog',
  '/events',
  '/resources',
  '/privacy-policy',
  '/terms-of-service',
  '/lost-found',
  '/success-stories',
  '/404',             // custom 404
]

export default defineConfig({
  plugins: [
    react(),

    // ⇢ generates dist/route/index.html for every entry in `pages`
    ViteSSG({
      script: 'async',          // inject scripts as <script async>
      formatting: 'minify-html',
      includedRoutes: pages,
    }),
  ],
})
