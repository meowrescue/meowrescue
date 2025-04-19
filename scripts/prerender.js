
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import AppShellForSSG from '../src/AppShellForSSG.js';

// Convert ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the static paths to pre-render
const staticPaths = [
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
  '/privacy-policy',
  '/terms-of-service',
  '/lost-found',
  '/404',
];

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

async function prerender() {
  console.log('Starting pre-rendering process with renderToString...');
  
  const distPath = path.resolve(__dirname, '../dist');
  const templatePath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error('Build directory does not contain index.html. Make sure to run this after the build.');
  }
  
  // Read the base template
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Process each path
  for (const pagePath of staticPaths) {
    console.log(`Pre-rendering ${pagePath}...`);
    
    // Calculate the output file path
    const outputPath = pagePath === '/' 
      ? path.join(distPath, 'index.html')
      : path.join(distPath, pagePath.substring(1), 'index.html');
    
    // Make sure the directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    try {
      // Render the React app to string
      const appHtml = renderToString(
        React.createElement(
          StaticRouter, 
          { location: pagePath },
          React.createElement(
            QueryClientProvider,
            { client: queryClient },
            React.createElement(
              HelmetProvider,
              {},
              React.createElement(AppShellForSSG)
            )
          )
        )
      );
      
      // Insert the rendered HTML into the template
      const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      
      // Write the pre-rendered HTML to file
      fs.writeFileSync(outputPath, finalHtml);
      
      console.log(`Pre-rendered ${pagePath} → ${outputPath}`);
    } catch (error) {
      console.error(`Error pre-rendering ${pagePath}:`, error);
    }
  }
  
  console.log('Pre-rendering complete!');
}

prerender().catch(error => {
  console.error('Pre-rendering failed:', error);
  process.exit(1);
});
