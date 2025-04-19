import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Import the AuthProvider
import { BrowserRouter } from 'react-router-dom';

// Ensure AuthProvider is wrapping the entire app for both client-side and SSR
const Main = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

if (!import.meta.env.SSR) {
  // Hydration for client-side
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.hydrate(<Main />, root);
  }
} else {
  // SSR entry point
  export const createApp = () => (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}
