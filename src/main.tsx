import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ViteReactSSG } from 'vite-react-ssg';
import routes from './routes';
import { AuthProvider } from './contexts/AuthContext';  // Import the AuthProvider

/**
 * ───────────────────────────────────────────────
 * Normal client‑side hydration (skipped during SSG build)
 * ───────────────────────────────────────────────
 */
if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    );
  }
}

/**
 * ───────────────────────────────────────────────
 * Entry that vite‑react‑ssg calls for each route
 * ───────────────────────────────────────────────
 */
export const createApp = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

export const createRoot = ViteReactSSG(
  { routes },
  () => {}
);
