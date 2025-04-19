import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// 👇  NO import from “vite‑react‑ssg” here.
// The SSG CLI wraps Vite for the build – the config stays 100 % normal.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
