import { ViteReactSSG } from 'vite-react-ssg';
import { QueryClient } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { routes } from './routes';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, isClient, initialState }) => {
    // Custom setup
    if (isClient) {
      // Client-side specific setup
      // Register service worker for PWA
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
    }

    // Wrap the app with providers
    return ({ App }) => (
      <HelmetProvider>
        <QueryClient client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <App />
            </AuthProvider>
          </TooltipProvider>
        </QueryClient>
      </HelmetProvider>
    );
  }
);
