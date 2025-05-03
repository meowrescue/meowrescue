
// Exporting all routes information for SSG processing
import App from './App';
import getSupabaseClient from '@/integrations/supabase/client';

// Define all base routes for the application
export const routes = [
  { path: '/', element: <App />, exact: true },
  { path: '/about', element: <App />, exact: true },
  { path: '/cats', element: <App />, exact: true },
  { path: '/cats/:id', element: <App /> },
  { path: '/adopt', element: <App />, exact: true },
  { path: '/adopt/apply', element: <App />, exact: true },
  { path: '/volunteer', element: <App />, exact: true },
  { path: '/volunteer/apply', element: <App />, exact: true },
  { path: '/foster', element: <App />, exact: true },
  { path: '/foster/apply', element: <App />, exact: true },
  { path: '/donate', element: <App />, exact: true },
  { path: '/events', element: <App />, exact: true },
  { path: '/events/:id', element: <App /> },
  { path: '/blog', element: <App />, exact: true },
  { path: '/blog/:slug', element: <App /> },
  { path: '/contact', element: <App />, exact: true },
  { path: '/resources', element: <App />, exact: true },
  { path: '/success-stories', element: <App />, exact: true },
  { path: '/financial-transparency', element: <App />, exact: true },
  { path: '/lost-found', element: <App />, exact: true },
  { path: '/lost-found/:id', element: <App /> },
  { path: '/privacy-policy', element: <App />, exact: true },
  { path: '/terms-of-service', element: <App />, exact: true }
];

// Get static paths for pre-rendering
export async function getStaticPaths() {
  // Return base routes without dynamic params
  return routes
    .filter(route => !route.path.includes(':'))
    .map(route => route.path);
}

// Function to fetch all cat IDs for dynamic route generation
export async function fetchAllCatIds() {
  try {
    const { data, error } = await getSupabaseClient()
      .from('cats')
      .select('id')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching cat IDs:', error);
      return [];
    }
    
    return data.map(cat => cat.id);
  } catch (error) {
    console.error('Failed to fetch cat IDs:', error);
    return [];
  }
}

// Function to fetch all blog post slugs
export async function fetchAllBlogSlugs() {
  try {
    const { data, error } = await getSupabaseClient()
      .from('blog_posts')
      .select('slug')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog slugs:', error);
      return [];
    }
    
    return data.map(post => post.slug);
  } catch (error) {
    console.error('Failed to fetch blog slugs:', error);
    return [];
  }
}

// Function to fetch all event IDs
export async function fetchAllEventIds() {
  try {
    const { data, error } = await getSupabaseClient()
      .from('events')
      .select('id')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching event IDs:', error);
      return [];
    }
    
    return data.map(event => event.id);
  } catch (error) {
    console.error('Failed to fetch event IDs:', error);
    return [];
  }
}
