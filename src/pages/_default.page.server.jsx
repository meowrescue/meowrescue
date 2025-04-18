
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from '../App';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server';

export { render };
export { passToClient };

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps', 'urlPathname'];

async function render(pageContext) {
  const { Page, pageProps } = pageContext;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  const helmetContext = {};
  const url = pageContext.urlPathname || '/';

  // Note: We don't include the Toaster components in server rendering
  // as they're UI-only and don't affect the initial HTML structure
  const appHtml = ReactDOMServer.renderToString(
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

  // This part needs to match your index.html template structure
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
        <meta name="keywords" content="cat rescue, cat adoption, feline rescue, kitten adoption, Florida cat rescue, Pasco County animal rescue, pet adoption" />
        <link rel="canonical" href="https://meowrescue.org/" />
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meowrescue.org/" />
        <meta property="og:title" content="MeowRescue - Cat Adoption & Foster Care" />
        <meta property="og:description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
        <meta property="og:image" content="https://meowrescue.org/images/meow-rescue-logo.jpg" />
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://meowrescue.org/" />
        <meta name="twitter:title" content="MeowRescue - Cat Adoption & Foster Care" />
        <meta name="twitter:description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
        <meta name="twitter:image" content="https://meowrescue.org/images/meow-rescue-logo.jpg" />
        
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
        <title>MeowRescue - Cat Adoption & Foster Care</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add any custom data here that we want to access in our frontend
    }
  };
}
