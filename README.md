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

### Environment Variables

The following environment variables must be set in the Netlify dashboard:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

For local development, create a `.env` file in the root directory with these variables. An example file `.env.example` is provided as a template.

### Secrets Management

This project is configured to handle Supabase credentials securely:

1. All credentials are sourced from environment variables
2. No hardcoded credentials in any source files
3. Netlify's secrets scanning is configured to ignore specific paths where environment variables might be embedded during the build process

If you encounter build failures related to secrets scanning, check the following:
- Ensure all credentials are properly set as environment variables in Netlify
- Verify that no hardcoded credentials exist in the codebase
- Check the `netlify.toml` configuration for proper secrets scanning settings

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

Copyright 2025 MeowRescue. All rights reserved.
