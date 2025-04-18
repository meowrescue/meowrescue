
# MeowRescue - Cat Rescue Website

A complete website for MeowRescue, a home-based cat rescue in Pasco County, Florida. The site includes features for adoption listings, donation handling, volunteer management, and other essential rescue operations.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **Rendering**: Static Site Generation (SSG) with vite-ssg
- **Hosting**: Netlify
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form
- **State Management**: TanStack Query (React Query)

## Static Site Generation (SSG)

This project uses vite-ssg to pre-render all public-facing pages, including dynamic content like individual cat profiles, into static HTML at build time. This approach offers:

- Better SEO as search engines can index complete HTML
- Faster initial page loads
- Reduced server costs as pages are served directly from Netlify's CDN
- Improved reliability with reduced runtime dependencies

Dynamic features like user authentication, form submissions, and admin functionality still work through client-side JavaScript and Supabase APIs.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (generates static site)
npm run build

# Preview production build
npm run preview

# Type-check the codebase
npm run typecheck
```

## Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch. The static site generation happens during the build process.

## Project Structure

- `src/pages/` - Page components
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/contexts/` - React contexts for state management
- `src/types/` - TypeScript type definitions
- `src/data/` - Mock data (replaced by Supabase in production)

## Adding New Cat Profiles

When new cats are added to the database, the site needs to be rebuilt to generate their static pages. This can be triggered manually in Netlify or through a webhook from Supabase when cat data changes.

## License

Copyright © 2025 MeowRescue. All rights reserved.
