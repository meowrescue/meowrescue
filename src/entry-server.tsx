import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';
import { supabase } from './integrations/supabase/client';
import { PageDataProvider } from './contexts/PageDataContext';
import { generateHtmlTemplate } from './templates/htmlTemplate';

interface RenderResult {
  html: string;
  helmet: HelmetServerState;
  state: {
    queryClient: any;
    pageData?: any;
  };
}

// Create an empty helmet state with all required properties
const createEmptyHelmetState = (): HelmetServerState => ({
  base: { toString: () => '', toComponent: () => null },
  bodyAttributes: { toString: () => '', toComponent: () => null },
  htmlAttributes: { toString: () => '', toComponent: () => null },
  link: { toString: () => '', toComponent: () => null },
  meta: { toString: () => '', toComponent: () => null },
  noscript: { toString: () => '', toComponent: () => null },
  script: { toString: () => '', toComponent: () => null },
  style: { toString: () => '', toComponent: () => null },
  title: { toString: () => '', toComponent: () => null },
  titleAttributes: { toString: () => '', toComponent: () => null },
  priority: { toString: () => '', toComponent: () => null }
});

// Function to fetch page-specific data based on URL
async function fetchPageData(url: string): Promise<any> {
  console.log(`[SSR] Fetching page data for URL: ${url}`);
  
  // Parse the URL to get the path
  const urlObj = new URL(url, 'http://localhost');
  const pathname = urlObj.pathname;
  
  // Match route patterns and fetch relevant data
  if (pathname.startsWith('/cats/')) {
    const catId = pathname.split('/').pop();
    if (catId) {
      try {
        // Fetch cat details
        const { data: cat, error } = await supabase
          .from('cats')
          .select('*')
          .eq('id', catId)
          .single();
          
        if (error) throw error;
        
        // Fetch medical records
        const { data: medicalRecords, error: medRecordsError } = await supabase
          .from('cat_medical_records')
          .select('*')
          .eq('cat_id', catId)
          .order('record_date', { ascending: false });
          
        if (medRecordsError) console.error('Error fetching medical records:', medRecordsError);
        
        return {
          pageType: 'catDetail',
          cat,
          medicalRecords: medicalRecords || []
        };
      } catch (error) {
        console.error(`[SSR] Error fetching cat data for ${catId}:`, error);
      }
    }
  } 
  else if (pathname.startsWith('/blog/')) {
    const slug = pathname.split('/').pop();
    if (slug) {
      try {
        const { data: post, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (error) throw error;
        
        // Fetch related posts
        const { data: relatedPosts } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .neq('id', post.id)
          .limit(3);
        
        return {
          pageType: 'blogPost',
          post,
          relatedPosts: relatedPosts || []
        };
      } catch (error) {
        console.error(`[SSR] Error fetching blog post data for ${slug}:`, error);
      }
    }
  }
  else if (pathname.startsWith('/events/')) {
    const eventId = pathname.split('/').pop();
    if (eventId) {
      try {
        const { data: event, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        
        if (error) throw error;
        
        return {
          pageType: 'eventDetail',
          event
        };
      } catch (error) {
        console.error(`[SSR] Error fetching event data for ${eventId}:`, error);
      }
    }
  }
  
  // Default: no page-specific data
  return null;
}

export async function render(url: string, context: any = {}): Promise<RenderResult> {
  console.log(`[SSR] Rendering URL: ${url}`);
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });
  
  // Fetch page-specific data
  const pageData = await fetchPageData(url);
  if (pageData) {
    console.log(`[SSR] Fetched page data for ${url}:`, JSON.stringify(pageData).substring(0, 200) + '...');
  }
  
  // Prefetch listing page data
  const { pathname } = new URL(url, 'http://localhost');
  if (pathname === '/cats') {
    await queryClient.prefetchQuery({
      queryKey: ['adoptable-cats'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .eq('status', 'Available')
          .order('name');
        if (error) throw error;
        return data;
      }
    });
  } else if (pathname === '/blog') {
    await queryClient.prefetchQuery({
      queryKey: ['blogPosts'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('is_featured', { ascending: false })
          .order('published_at', { ascending: false });
        if (error) throw error;
        return data;
      }
    });
  } else if (pathname === '/events') {
    await queryClient.prefetchQuery({
      queryKey: ['events'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date_start', { ascending: true });
        if (error) throw error;
        return data;
      }
    });
  }
  
  const helmetContext: { helmet?: HelmetServerState } = {};
  
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <PageDataProvider initialData={pageData}>
                <App />
              </PageDataProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </StaticRouter>
  );

  return {
    html,
    helmet: helmetContext.helmet || createEmptyHelmetState(),
    state: {
      queryClient: queryClient.getQueryState(),
      pageData
    }
  };
}

export async function renderFullPage(url: string) {
  const rendered = await render(url);
  const hasContent = rendered.html && rendered.html.length > 100;
  
  return generateHtmlTemplate({
    html: rendered.html,
    helmet: rendered.helmet,
    state: rendered.state,
    url,
    hasContent
  });
}
