
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
  
  // Create an error element to show on the page if root is missing
  const errorDiv = document.createElement('div');
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '20px';
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.right = '0';
  errorDiv.textContent = 'ERROR: Root element not found. Could not mount React application.';
  document.body.appendChild(errorDiv);
} else {
  console.log('Root element found, proceeding with render');
  
  try {
    // Mount the app to the DOM with simplified providers to minimize issues
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <TooltipProvider>
                <AuthProvider>
                  <Toaster />
                  <Sonner />
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
    
    // Display error on page
    const errorDiv = document.createElement('div');
    errorDiv.style.backgroundColor = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.right = '0';
    errorDiv.textContent = `ERROR rendering React app: ${error instanceof Error ? error.message : 'Unknown error'}`;
    document.body.appendChild(errorDiv);
  }
}
