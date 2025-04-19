
import { RouteObject } from 'react-router-dom';
import { publicRoutes } from './public-routes.js';
import { protectedRoutes } from './protected-routes.js';
import { adminRoutes } from './admin-routes.js';

export * from './static-paths.js';

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes
];

export default routes;
