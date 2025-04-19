
// This is a compatibility file that provides static routes data
// without requiring JSX processing

// Simple static export for build tools
export const staticPaths = [
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
  '/404',
];

// Simplified routes for build tools
export const routes = staticPaths.map(path => ({ path }));

export function getStaticPaths() {
  return staticPaths;
}

export function fetchAllCatIds() {
  return ['cat1', 'cat2', 'cat3']; // Simplified for build
}

export function fetchAllBlogSlugs() {
  return ['post1', 'post2', 'post3']; // Simplified for build
}

export function fetchAllEventIds() {
  return ['event1', 'event2', 'event3']; // Simplified for build
}
