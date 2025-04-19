
# Meow Rescue Website

## Architecture

This project is structured with:

1. **Public Pages** - Static Site Generated (SSG) HTML for SEO optimization
   - Home, About, Cats, Blog, etc.
   - These pages are pre-rendered at build time as static HTML

2. **Admin Dashboard** - Client-Side Rendered (CSR) React application
   - Protected behind authentication
   - Dynamic interactive components

## Build Process

The build process uses a custom implementation of Static Site Generation:

1. First, the standard Vite build creates the JavaScript bundles
2. Then, our custom SSG plugin generates static HTML files for all public routes
3. Finally, on the client, the static HTML is hydrated with React once JavaScript loads

This approach provides several benefits:
- Excellent SEO as search engines immediately see complete HTML content
- Fast initial page load and Time to First Contentful Paint
- Progressive enhancement as JavaScript loads
- Full React interactivity after hydration

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site is configured to deploy on Netlify. The build command in netlify.toml handles everything needed to generate the static site.

## Important Notes

1. Public routes should be listed in `src/routes.js` for static generation
2. Admin routes use client-side rendering and don't need static HTML
3. For best SEO, ensure all public pages have proper metadata via React Helmet
