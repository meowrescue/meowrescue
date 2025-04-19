import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot as reactCreateRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ViteReactSSG } from 'vite-react-ssg'
import routes from './routes'

/**
 * ───────────────────────────────────────────────
 * Normal client‑side hydration (skipped during SSG build)
 * ───────────────────────────────────────────────
 */
if (!import.meta.env.SSR) {
  reactCreateRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

/**
 * ───────────────────────────────────────────────
 * Entry that vite‑react‑ssg calls for each route
 * ───────────────────────────────────────────────
 */
export const createApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

export const createRoot = ViteReactSSG(
  { routes },                          // pre‑render every route in this tree
  () => {
    /* optional hook – run code once per environment if you need */
  }
)
