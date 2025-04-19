import React from 'react';
import { createRoot } from 'react-dom/client';  // Ensure this is correct
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ViteReactSSG } from 'vite-react-ssg';
import routes from './routes';

/**
 * ───────────────────────────────────────────────
 * Normal client‑side hydration (skipped during SSG build)
 * ───────────────────────────────────────────────
 */
if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
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
  { routes },
  () => {}
)
