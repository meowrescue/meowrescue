
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { routes } from '../src/routes.js';
import App from '../src/App';
import { fetchBlogPosts } from '../src/services/blogService';
import { supabase } from '../src/integrations/supabase/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create initial html template
const createHtmlTemplate = (appHtml, headTags = '') => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headTags}
    <!-- Preloaded state will be injected here -->
    <script>
      window.__PRELOADED_STATE__ = {};
    </script>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
};

// Main prerender function
async function prerender() {
  console.log('Starting prerendering process...');
  
  // Create dist directory if it doesn't exist
  const distDir = path.resolve(__dirname, '../dist');
  ensureDirectoryExists(distDir);
  
  // Fetch blog posts for prerendering
  console.log('Fetching blog posts...');
  const blogPosts = await fetchBlogPosts();
  
  // Get all paths to prerender
  const allPaths = [
    '/',
    '/about',
    '/cats',
    '/adopt',
    '/adopt/apply',
    '/blog',
    '/events',
    '/resources',
    '/contact',
    '/donate',
    '/volunteer',
    '/volunteer/apply',
    '/foster',
    '/foster/apply',
    '/login',
    '/register',
    '/reset-password',
    '/privacy-policy',
    '/terms-of-service',
    '/lost-found',
  ];
  
  // Add blog post paths
  blogPosts.forEach(post => {
    allPaths.push(`/blog/${post.slug}`);
  });
  
  // Create QueryClient for prerendering
  const queryClient = new QueryClient();
  
  // Preload data for blog posts
  await Promise.all(
    blogPosts.map(post => 
      queryClient.prefetchQuery({
        queryKey: ['blogPost', post.slug],
        queryFn: () => post
      })
    )
  );
  
  // Preload data for blog list
  await queryClient.prefetchQuery({
    queryKey: ['blogPosts'],
    queryFn: () => blogPosts
  });
  
  // Get dehydrated state
  const dehydratedState = JSON.stringify(
    queryClient.getQueryCache().getAll().map(query => ({
      queryKey: query.queryKey,
      state: query.state
    }))
  );
  
  // Loop through each path and generate HTML
  for (const routePath of allPaths) {
    console.log(`Prerendering page: ${routePath}`);
    
    // Create helmet context for SSR
    const helmetContext = {};
    
    // Render the app to string
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(
        StaticRouter, 
        { location: routePath },
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(
            HelmetProvider,
            { context: helmetContext },
            React.createElement(App)
          )
        )
      )
    );
    
    // Get helmet data
    const { helmet } = helmetContext;
    
    // Create head tags from helmet
    const headTags = helmet ? `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    ` : '';
    
    // Create HTML with preloaded state
    let html = createHtmlTemplate(appHtml, headTags);
    
    // Inject preloaded state
    html = html.replace(
      'window.__PRELOADED_STATE__ = {};',
      `window.__PRELOADED_STATE__ = ${dehydratedState};`
    );
    
    // Determine the output path
    let outputPath;
    if (routePath === '/') {
      outputPath = path.join(distDir, 'index.html');
    } else {
      // Create directory for nested routes
      const dirPath = path.join(distDir, routePath.slice(1));
      ensureDirectoryExists(dirPath);
      outputPath = path.join(dirPath, 'index.html');
    }
    
    // Write the file
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${outputPath}`);
  }
  
  // Generate sitemap after all pages are rendered
  console.log('Generating sitemap...');
  const sitemap = generateSitemap(allPaths);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  
  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://meowrescue.org/sitemap.xml`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  
  console.log('Prerendering completed successfully!');
}

// Generate sitemap XML
function generateSitemap(paths) {
  const baseUrl = 'https://meowrescue.org';
  const today = new Date().toISOString().slice(0, 10);
  
  const urlset = paths
    .filter(path => !path.includes(':') && !path.includes('admin'))
    .map(path => {
      const priority = path === '/' ? '1.0' : '0.7';
      const changefreq = path === '/' ? 'daily' : 'weekly';
      
      return `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

// Run the prerender function
prerender().catch(error => {
  console.error('Error during prerendering:', error);
  process.exit(1);
});
