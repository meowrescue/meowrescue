
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
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

// Component with all providers for both client and server rendering
const AppWithProviders = ({ url }: { url?: string }) => {
  // Use StaticRouter for SSR/SSG or BrowserRouter for browser
  const Router = typeof window === 'undefined' ? StaticRouter : BrowserRouter;
  const routerProps = url ? { location: url } : {};

  return (
    <React.StrictMode>
      {/* @ts-ignore - Type issues with StaticRouter vs BrowserRouter */}
      <Router {...routerProps}>
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
      </Router>
    </React.StrictMode>
  );
};

// Client-side rendering function
const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  // Check if this is an SSG hydration or a CSR render
  if (rootElement.childNodes.length > 0) {
    // For SSG hydration (public routes), we use hydrateRoot
    ReactDOM.hydrateRoot(rootElement, <AppWithProviders />);
  } else {
    // For admin routes and first-time CSR, we use createRoot
    const root = ReactDOM.createRoot(rootElement);
    root.render(<AppWithProviders />);
  }
};

// Initialize the app if we're in the browser
if (typeof window !== 'undefined') {
  mountApp();
}

// Export for SSR/SSG
export { AppWithProviders };
export default mountApp;
