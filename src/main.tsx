
import React from 'react';
import { ViteSSG } from 'vite-ssg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';
import './index.css';
import { routes, getStaticPaths } from './routes';

// Create a client with SSR-friendly settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Make SSR-friendly with initial data from staleTime
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (previously cacheTime)
    },
  },
});

// Create the SSG app
export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    // Install plugins
    app.use(router);
    
    // Wrap with providers
    app.component('ClientOnly', {
      render() {
        return isClient ? this.$slots.default?.() : null;
      },
    });
    
    // Setup the app with our providers
    const RootProvider = ({ children }: { children: React.ReactNode }) => (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );
    
    // Wrap the entire app with our providers
    app.component('RootProvider', RootProvider);
  }
);

// This function is automatically detected and called during build
// It provides all the paths that should be pre-rendered
export async function includedRoutes() {
  return await getStaticPaths();
}
