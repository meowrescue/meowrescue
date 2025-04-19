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

// Check if running in client-side
if (typeof window !== 'undefined' && !import.meta.env.SSR) {
  const root = document.getElementById('root');
  if (root) {
    // Use ReactDOM.createRoot only for client-side rendering
    const rootElement = ReactDOM.createRoot(root);
    rootElement.render(<Main />);
  }
}

// SSR entry point without createRoot for server-side rendering
export const createApp = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
};
