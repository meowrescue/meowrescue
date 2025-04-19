import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct method for React 18
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

// Client-side rendering logic
if (typeof window !== "undefined" && !import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    const rootElement = ReactDOM.createRoot(root); // Only call createRoot in the client-side
    rootElement.render(<Main />); // Render only in the browser
  }
}

// SSR entry point (ensure SSR logic remains separate)
// No use of createRoot here, as it's client-specific
export const createApp = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
