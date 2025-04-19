import React from 'react';
import ReactDOM from 'react-dom/client';  // Correct import for React 18
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
    const rootElement = ReactDOM.createRoot(root);  // Correct use of createRoot
    rootElement.hydrate(<Main />);  // Hydrate only for client-side rendering
  }
}

// SSR entry point - ensure this is not executed in SSR build
export const createApp = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
