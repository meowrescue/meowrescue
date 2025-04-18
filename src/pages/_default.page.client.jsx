
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import App from '../App';
import '../index.css';

// This file is needed for vite-plugin-ssr to understand how to render our React app

export { render };

// Create a client with settings
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

async function render(pageContext) {
  const { Page } = pageContext;
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }

  // Use createRoot for CSR or hydrateRoot for hydration
  const AppWithProviders = (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthProvider>
                <App />
              </AuthProvider>
            </TooltipProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );

  // Check if we're hydrating from SSR or doing a normal render
  if (rootElement.innerHTML.includes('data-reactroot')) {
    ReactDOM.hydrateRoot(rootElement, AppWithProviders);
  } else {
    ReactDOM.createRoot(rootElement).render(AppWithProviders);
  }
}
