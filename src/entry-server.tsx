import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider, dehydrate, DehydratedState } from '@tanstack/react-query';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthProvider } from './contexts/AuthContext';
import { PageDataProvider } from './contexts/PageDataContext';
import App from './App';

// Interface for the results returned by the render function
export interface RenderOutput {
  appHtml: string;
  helmetContext: Record<string, any>; // Contains helmet tags like title, meta, etc.
  dehydratedState: DehydratedState; // Dehydrated React Query state
}

/**
 * Renders the React application to an HTML string for a given URL.
 * Assumes data fetching and queryClient population happen *before* calling this.
 * @param url The request URL to render.
 * @param queryClient The QueryClient instance, potentially pre-populated with data.
 * @param supabaseClient The initialized Supabase client instance.
 * @param pageData Any additional page-specific data needed by PageDataProvider.
 * @returns Promise<RenderOutput> An object containing the rendered HTML and context.
 */
export async function render(
  url: string,
  queryClient: QueryClient,
  supabaseClient: SupabaseClient,
  pageData: any = null
): Promise<RenderOutput> {
  const helmetContext: Record<string, any> = {};

  // Render the application component to an HTML string
  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            {/* AuthProvider might need adjustments if it relies on browser-specific APIs */}
            <AuthProvider supabaseClient={supabaseClient}>
              <PageDataProvider initialData={pageData}>
                <App />
              </PageDataProvider>
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </StaticRouter>
    </React.StrictMode>
  );

  // Dehydrate the state from the QueryClient after rendering
  const dehydratedState = dehydrate(queryClient);

  // Return the rendered HTML and context objects
  return {
    appHtml,
    helmetContext,
    dehydratedState,
  };
}
