
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';

// This function is used for static site generation (SSG)
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

  // Pre-fetch critical data for static generation
  if (url.startsWith('/blog')) {
    try {
      // Import the fetchBlogPosts function dynamically
      const { fetchBlogPosts, fetchBlogPostBySlug } = await import('./services/blogService');
      
      // Prefetch all blog posts for the blog index page
      await queryClient.prefetchQuery({
        queryKey: ['blogPosts'],
        queryFn: fetchBlogPosts,
      });
      
      // If it's a blog post page, try to extract the slug and prefetch that specific post
      const matches = url.match(/\/blog\/([^\/]+)/);
      if (matches && matches[1]) {
        const slug = matches[1];
        await queryClient.prefetchQuery({
          queryKey: ['blogPost', slug],
          queryFn: () => fetchBlogPostBySlug(slug),
        });
      }
    } catch (error) {
      console.error('Error prefetching blog data:', error);
    }
  }

  // Render the application to an HTML string for static generation
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
