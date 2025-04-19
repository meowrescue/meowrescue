
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import App from './App';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

// Create the app component with all providers
const AppWithProviders = () => (
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary>
          <HelmetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthProvider>
                <App />
              </AuthProvider>
            </TooltipProvider>
          </HelmetProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Mount the app to the DOM - dynamic client-side rendering
const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  // Check if this is an SSG hydration or a CSR render
  if (rootElement.innerHTML === '') {
    // For admin routes and first-time CSR, we use createRoot
    const root = ReactDOM.createRoot(rootElement);
    root.render(<AppWithProviders />);
  } else {
    // For SSG hydration (public routes), we use hydrateRoot
    // This expects pre-rendered HTML content
    const root = ReactDOM.hydrateRoot(rootElement, <AppWithProviders />);
  }
};

// Initialize the app
mountApp();

export { AppWithProviders };
export default mountApp;
