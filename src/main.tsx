import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * ───────────────────────────────────────────────
 * Normal client‑side hydration
 * ───────────────────────────────────────────────
 */
if (import.meta.env.MODE !== 'ssg') {
  createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
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
