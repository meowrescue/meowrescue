import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'          // Tailwind entry

/**
 * Normal client‑side render (not during SSG)
 * ------------------------------------------------
 */
if (import.meta.env.MODE !== 'ssg') {
  createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
}

/**
 * Static‑site‑generation entry for vite-react-ssg
 * ------------------------------------------------
 * vite-react-ssg looks for — and calls — this export for every
 * route in `includedRoutes`, captures the HTML, and writes it
 * to dist/<route>/index.html.
 */
export const createApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
