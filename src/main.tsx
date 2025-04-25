
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './contexts/AuthContext'
import { PageDataProvider } from './contexts/PageDataContext'
import App from './App.tsx'
import './index.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/700.css'

// Define window.__INITIAL_DATA__ type
declare global {
  interface Window {
    __INITIAL_DATA__?: {
      queryClient?: {
        queries: Record<string, { state: { data: any } }>;
      };
      pageData?: any;
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const dehydratedState = window.__INITIAL_DATA__?.queryClient || null;
const pageData = window.__INITIAL_DATA__?.pageData || null;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <TooltipProvider>
              <AuthProvider>
                <PageDataProvider initialData={pageData}>
                  <App />
                </PageDataProvider>
              </AuthProvider>
            </TooltipProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
