
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

// Get any dehydrated state transmitted from the server
const dehydratedState = window.__REACT_QUERY_STATE__;

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

// Mount the app to the DOM
const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  // Create root and render - explicit client-side hydration
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
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
};

// Declare the global React Query state type
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: any;
  }
}

// Initialize the app
mountApp();
