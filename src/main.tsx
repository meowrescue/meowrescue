// src/main.tsx or src/index.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot as reactCreateRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';  // Import your AuthProvider
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
  reactCreateRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <AuthProvider> {/* Wrap the App component with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * ───────────────────────────────────────────────
 * Entry that vite‑react‑ssg calls for each route
 * ───────────────────────────────────────────────
 */
export const createApp = () => (
  <BrowserRouter>
    <AuthProvider> {/* Wrap the App component with AuthProvider */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    /* optional hook – run code once per environment if you need */
  }
);
