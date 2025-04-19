import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// ───────────────────────────────────────────────
// Vite / Rollup configuration
// • Adds "@" alias  →  src/... everywhere
// • Marks `next-themes` as external to silence
//   Rollup's misplaced /*#__PURE__*/ comment warnings
// ───────────────────────────────────────────────
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['next-themes'],
    },
  },
})
