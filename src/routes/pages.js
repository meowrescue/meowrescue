
// Default export for vite-plugin-ssr
// This file helps vite-plugin-ssr find and render our pages
import { routes, getStaticPaths } from '../routes';

// Export the routes
export { routes };

// Export the static paths that should be pre-rendered
export { getStaticPaths };

export const passToClient = ['pageProps', 'urlPathname', 'queryState'];

// onBeforeRender function for server-side rendering
export async function onBeforeRender(pageContext) {
  // Get rendered content from our render function
  const { html, helmet, dehydratedState } = pageContext.exports.render ? 
    await pageContext.exports.render(pageContext.urlPathname) : 
    { html: '', helmet: null, dehydratedState: null };

  return {
    pageContext: {
      pageProps: {},
      documentProps: {
        // Add Helmet data to document props
        title: helmet?.title?.toString() || 'Meow Rescue',
        description: helmet?.meta?.toString() || '',
        // And other meta tags
      },
      // Include the dehydrated React Query state for client hydration
      queryState: dehydratedState,
      // Pass the pre-rendered HTML
      renderedHtml: html
    }
  };
}

// This function is used to render the page's HTML
export function render(pageContext) {
  const { renderedHtml, documentProps = {}, queryState } = pageContext;
  
  // Inject the React Query state into the page
  const queryStateScript = queryState ? 
    `<script>window.__REACT_QUERY_STATE__ = ${queryState};</script>` : 
    '';
  
  return {
    documentHtml: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${documentProps.title || ''}
          ${documentProps.description || ''}
          ${queryStateScript}
        </head>
        <body>
          <div id="root">${renderedHtml}</div>
        </body>
      </html>`
  };
}
