
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';

// Console log for debugging
console.log('Main.tsx is initializing...');

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a component that conditionally renders ReactQueryDevtools
const ReactQueryDevToolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

function QueryDevTools() {
  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    // Only enable devtools in development
    if (import.meta.env.DEV) {
      setShowDevtools(true);
      console.log('ReactQuery DevTools enabled');
    }
  }, []);

  return showDevtools ? (
    <React.Suspense fallback={null}>
      <ReactQueryDevToolsProduction initialIsOpen={false} />
    </React.Suspense>
  ) : null;
}

console.log('Rendering app to DOM...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster />
            <QueryDevTools />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);

console.log('App mounted successfully');
