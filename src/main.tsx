import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';

// Create a client with SSR-friendly settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Make SSR-friendly with initial data from staleTime
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Only load DevTools in development
const ReactQueryDevTools = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

// Add hydration function to help with SSG/SSR
function hydrate() {
  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
            <Toaster />
            {import.meta.env.DEV && (
              <React.Suspense fallback={null}>
                <ReactQueryDevTools initialIsOpen={false} />
              </React.Suspense>
            )}
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}

// Check if we're hydrating from SSR
const hasSSRData = document.getElementById('__MEOW_RESCUE_DATA__');

if (hasSSRData) {
  // If SSR data exists, hydrate the app
  hydrate();
} else {
  // Otherwise, do a normal render
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
            <Toaster />
            {import.meta.env.DEV && (
              <React.Suspense fallback={null}>
                <ReactQueryDevTools initialIsOpen={false} />
              </React.Suspense>
            )}
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>,
  );
}
