import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Ensure correct path
import App from './App';
import './index.css';

// Client-side hydration (skipped during SSG build)
if (!import.meta.env.SSR) {
  createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

export const createApp = () => (
  <BrowserRouter>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);
