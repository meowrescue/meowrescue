
import { RouteObject } from 'react-router-dom';
import { publicRoutes } from './public-routes';
import { protectedRoutes } from './protected-routes';
import { adminRoutes } from './admin-routes';

export * from './static-paths';

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes
];

export default routes;
