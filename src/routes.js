// Updated routes configuration including success‑stories for SSG & sitemap
export const routes = [
  { path: '/' },
  { path: '/about' },
  { path: '/cats' },
  { path: '/cats/:id' },
  { path: '/adopt' },
  { path: '/adopt/apply' },
  { path: '/blog' },
  { path: '/blog/:slug' },
  { path: '/events' },
  { path: '/events/:id' },
  { path: '/resources' },
  { path: '/contact' },
  { path: '/donate' },
  { path: '/volunteer' },
  { path: '/volunteer/apply' },
  { path: '/foster' },
  { path: '/foster/apply' },
  { path: '/success-stories' },
  { path: '/login' },
  { path: '/register' },
  { path: '/reset-password' },
  { path: '/privacy-policy' },
  { path: '/terms-of-service' },
  { path: '/lost-found' },
  { path: '/404' }
];

// Function to supply static paths for react‑snap, sitemap, etc.
export const getStaticPaths = () => {
  const paths = [
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
    '/success-stories',
    '/privacy-policy',
    '/terms-of-service',
    '/lost-found',
    '/404'
  ];

  return paths;
};
