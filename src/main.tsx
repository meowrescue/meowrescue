
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

// Get any preloaded state from server-side rendering
const preloadedState = window.__PRELOADED_STATE__ || {};

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

// Hydrate any queries that were prefetched
if (preloadedState && Array.isArray(preloadedState)) {
  queryClient.setQueriesData(
    preloadedState.map(cache => ({
      queryKey: cache.queryKey,
      data: cache.state.data
    }))
  );
}

// Mount the app to the DOM
const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  // Create root with correct arguments
  const root = ReactDOM.createRoot(rootElement, {
    // Optional: Add any root configuration if needed
  });
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={preloadedState}>
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

// Declare the global preloaded state type
declare global {
  interface Window {
    __PRELOADED_STATE__?: any;
  }
}

// Initialize the app
mountApp();
