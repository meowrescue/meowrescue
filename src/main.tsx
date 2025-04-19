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

// Client-side rendering
if (!import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    const rootElement = ReactDOM.createRoot(root); // Ensure this is only called on the client
    rootElement.render(<Main />); // Render only in the browser
  }
}

// SSR entry point (ensure SSR logic remains separate)
export const createApp = () => (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
