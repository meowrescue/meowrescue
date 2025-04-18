
// Default export for vite-plugin-ssr
// This file helps vite-plugin-ssr find and render our pages
import { routes, getStaticPaths } from '../routes';

// Export the routes
export { routes };

// Export the static paths that should be pre-rendered
export { getStaticPaths };

export const passToClient = ['pageProps', 'urlPathname'];

// onBeforeRender function for server-side rendering
export async function onBeforeRender(pageContext) {
  // We return an empty object for now since we're handling
  // most of the rendering logic directly in our React components
  return {
    pageContext: {
      pageProps: {}
    }
  };
}
