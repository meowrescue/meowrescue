import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18's entry point for client-side rendering
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Create the App component inside a function
const Main = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

// Hydrate on client-side (React 18)
if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    const rootElement = ReactDOM.createRoot(root);  // Use React 18's new root API
    rootElement.hydrate(<Main />);
  }
}

// SSR entry point without the export in the function itself
export const createApp = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
