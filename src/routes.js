
// ES module version of routes for sitemap generation
export const routes = [
  {
    path: '/',
  },
  {
    path: '/about',
  },
  {
    path: '/cats',
  },
  {
    path: '/cats/:id',
  },
  {
    path: '/adopt',
  },
  {
    path: '/adopt/apply',
  },
  {
    path: '/blog',
  },
  {
    path: '/blog/:slug',
  },
  {
    path: '/events',
  },
  {
    path: '/events/:id',
  },
  {
    path: '/resources',
  },
  {
    path: '/contact',
  },
  {
    path: '/donate',
  },
  {
    path: '/volunteer',
  },
  {
    path: '/volunteer/apply',
  },
  {
    path: '/foster',
  },
  {
    path: '/foster/apply',
  },
  {
    path: '/login',
  },
  {
    path: '/register',
  },
  {
    path: '/reset-password',
  },
  {
    path: '/profile',
  },
  {
    path: '/privacy-policy',
  },
  {
    path: '/terms-of-service',
  },
  {
    path: '/lost-found',
  },
  {
    path: '/lost-found/:id',
  },
  {
    path: '/lost-found/new',
  },
  {
    path: '/lost-found/edit/:id',
  },
  {
    path: '*',
  }
];

// Export the static paths that should be pre-rendered
export const getStaticPaths = async () => {
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
    '/login',
    '/register',
    '/reset-password',
    '/privacy-policy',
    '/terms-of-service',
    '/lost-found',
    '/404',
  ];
  
  return paths;
};
