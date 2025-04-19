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
    // Ensure ReactDOM.createRoot is only called in the client
    const rootElement = ReactDOM.createRoot(root);
    rootElement.render(<Main />);
  }
}

// SSR entry point (ensure SSR logic remains separate)
export const createApp = () => {
  // This is only used for SSR and does not use createRoot
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
};
