
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Important for SSG: disable retries and ensure data is prefetched
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    },
  });

  // Set up React Helmet for managing head tags
  const helmetContext = {};

  // Pre-fetch critical data
  if (url.startsWith('/blog')) {
    try {
      // Import the fetchBlogPosts function dynamically
      const { fetchBlogPosts } = await import('./services/blogService');
      await queryClient.prefetchQuery({
        queryKey: ['blogPosts'],
        queryFn: fetchBlogPosts,
      });
    } catch (error) {
      console.error('Error prefetching blog data:', error);
    }
  }

  // Render the application to an HTML string
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </StaticRouter>
  );

  // Extract head tags from Helmet context
  const helmet = (helmetContext as any).helmet;

  // Serialize the React Query cache to rehydrate on the client
  const dehydratedState = JSON.stringify(dehydrate(queryClient));

  return { 
    html,
    helmet,
    dehydratedState
  };
}
