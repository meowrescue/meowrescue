
// This is a compatibility file that re-exports from routes.tsx
// We're creating this to ensure backward compatibility with scripts
// that expect routes.js instead of routes.tsx
const { routes, getStaticPaths, fetchAllCatIds, fetchAllBlogSlugs, fetchAllEventIds } = require('./routes');

module.exports = {
  routes,
  getStaticPaths,
  fetchAllCatIds,
  fetchAllBlogSlugs,
  fetchAllEventIds
};
