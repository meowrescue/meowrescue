
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

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
    }
  }, []);

  return showDevtools ? (
    <React.Suspense fallback={null}>
      <ReactQueryDevToolsProduction initialIsOpen={false} />
    </React.Suspense>
  ) : null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
        <QueryDevTools />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
