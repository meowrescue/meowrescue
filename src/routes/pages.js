
// Default export for vite-plugin-ssr
import { routes, getStaticPaths, fetchAllCatIds, fetchAllBlogSlugs, fetchAllEventIds } from '../routes';

// Export the routes
export { routes };

// Export the static paths that should be pre-rendered
export { getStaticPaths, fetchAllCatIds, fetchAllBlogSlugs, fetchAllEventIds };

export const passToClient = ['pageProps', 'urlPathname', 'routeParams'];

// onBeforeRender function for server-side rendering
export async function onBeforeRender(pageContext) {
  const { url, routeParams } = pageContext;
  
  console.log(`[SSR] onBeforeRender for URL: ${url}`);
  
  // Find the matching route
  const route = routes.find(r => {
    // Convert route path pattern to regex for matching
    const pattern = r.path.replace(/:[^\s/]+/g, '([\\w-]+)');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(url);
  });
  
  let pageProps = {};
  
  // If we found a matching route with a component that has getStaticProps
  if (route && route.element && typeof route.element.type?.getStaticProps === 'function') {
    try {
      console.log(`[SSR] Found getStaticProps for route ${route.path}, fetching data...`);
      pageProps = await route.element.type.getStaticProps({ params: routeParams });
    } catch (error) {
      console.error(`[SSR] Error loading data for ${url}:`, error);
    }
  }

  return {
    pageContext: {
      pageProps,
      // Make the route params available on the client
      routeParams
    }
  };
}
