
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';
import './styles/globals.css'; 
import './index.css';

// Debug logs
console.log('Main.tsx is executing');

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

// More debug logs
console.log('About to render React root');

// Check if the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found in the DOM!');
} else {
  console.log('Root element found, proceeding with render');
  
  try {
    // Mount the app to the DOM
    ReactDOM.createRoot(rootElement).render(
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
    console.log('React root rendered successfully');
  } catch (error) {
    console.error('Error rendering React root:', error);
  }
}
