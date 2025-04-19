import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Import the AuthProvider
import { BrowserRouter } from 'react-router-dom';

// Create the App component inside a function
const Main = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

// Hydrate on client-side
if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.hydrate(<Main />, root);
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
