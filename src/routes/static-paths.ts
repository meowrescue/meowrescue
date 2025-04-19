
import { cats } from '../data/cats.js';

// Function to generate static paths for cats
export async function fetchAllCatIds() {
  return cats.map(cat => cat.id);
}

// Function to generate static paths for blog posts
export async function fetchAllBlogSlugs() {
  return ['caring-for-senior-cats', 'kitten-season-tips', 'adoption-success-stories'];
}

// Function to generate static paths for events
export async function fetchAllEventIds() {
  return ['event1', 'event2', 'event3'];
}

// Export the static paths that should be pre-rendered
export const getStaticPaths = async () => {
  const catIds = await fetchAllCatIds();
  const blogSlugs = await fetchAllBlogSlugs();
  const eventIds = await fetchAllEventIds();
  
  return [
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
    ...catIds.map(id => `/cats/${id}`),
    ...blogSlugs.map(slug => `/blog/${slug}`),
    ...eventIds.map(id => `/events/${id}`)
  ];
};
