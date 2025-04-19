import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the correct method for React 18
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

// Hydrate on client-side
if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    const rootElement = ReactDOM.createRoot(root);  // Ensure createRoot is used only on the client
    rootElement.hydrate(<Main />);  // Hydrate only in the browser
  }
}

// SSR entry point - ensure SSR logic remains separate
export const createApp = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
