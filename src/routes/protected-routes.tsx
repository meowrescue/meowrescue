
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.js';
import Profile from '../pages/Profile.js';
import LostFoundForm from '../pages/LostFoundForm.js';

export const protectedRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/lost-found/new',
    element: <ProtectedRoute><LostFoundForm /></ProtectedRoute>
  },
  {
    path: '/lost-found/edit/:id',
    element: <ProtectedRoute><LostFoundForm /></ProtectedRoute>
  }
];
