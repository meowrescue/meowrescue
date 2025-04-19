
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.js';
import AdminDashboard from '../pages/AdminDashboard.js';
import AdminCats from '../pages/AdminCats.js';
import AdminCatForm from '../pages/AdminCatForm.js';
import AdminBlog from '../pages/AdminBlog.js';
import AdminBlogForm from '../pages/AdminBlogForm.js';
import AdminUsers from '../pages/AdminUsers.js';
import AdminFinance from '../pages/AdminFinance.js';
import AdminPages from '../pages/AdminPages.js';
import AdminEvents from '../pages/AdminEvents.js';
import AdminLostFound from '../pages/AdminLostFound.js';
import AdminMessages from '../pages/AdminMessages.js';
import AdminChat from '../pages/AdminChat.js';
import AdminSecurity from '../pages/AdminSecurity.js';
import AdminApplications from '../pages/AdminApplications.js';
import AdminSupplies from '../pages/AdminSupplies.js';
import AdminDocuments from '../pages/AdminDocuments.js';
import AdminTeam from '../pages/AdminTeam.js';
import AdminSuccessStories from '../pages/AdminSuccessStories.js';
import AdminBusinessLicenses from '../pages/AdminBusinessLicenses.js';
import AdminDirectMessages from '../pages/AdminDirectMessages.js';
import AdminOrders from '../pages/AdminOrders.js';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>
  },
  {
    path: '/admin/cats',
    element: <ProtectedRoute requireAdmin={true}><AdminCats /></ProtectedRoute>
  },
  {
    path: '/admin/cats/new',
    element: <ProtectedRoute requireAdmin={true}><AdminCatForm /></ProtectedRoute>
  },
  {
    path: '/admin/cats/edit/:id',
    element: <ProtectedRoute requireAdmin={true}><AdminCatForm /></ProtectedRoute>
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute requireAdmin={true}><AdminUsers /></ProtectedRoute>
  },
  {
    path: '/admin/finance',
    element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>
  },
  {
    path: '/admin/pages',
    element: <ProtectedRoute requireAdmin={true}><AdminPages /></ProtectedRoute>
  },
  {
    path: '/admin/blog',
    element: <ProtectedRoute requireAdmin={true}><AdminBlog /></ProtectedRoute>
  },
  {
    path: '/admin/blog/new',
    element: <ProtectedRoute requireAdmin={true}><AdminBlogForm /></ProtectedRoute>
  },
  {
    path: '/admin/blog/edit/:id',
    element: <ProtectedRoute requireAdmin={true}><AdminBlogForm /></ProtectedRoute>
  },
  {
    path: '/admin/events',
    element: <ProtectedRoute requireAdmin={true}><AdminEvents /></ProtectedRoute>
  },
  {
    path: '/admin/lost-found',
    element: <ProtectedRoute requireAdmin={true}><AdminLostFound /></ProtectedRoute>
  },
  {
    path: '/admin/messages',
    element: <ProtectedRoute requireAdmin={true}><AdminMessages /></ProtectedRoute>
  },
  {
    path: '/admin/chat',
    element: <ProtectedRoute requireAdmin={true}><AdminChat /></ProtectedRoute>
  },
  {
    path: '/admin/security',
    element: <ProtectedRoute requireAdmin={true}><AdminSecurity /></ProtectedRoute>
  },
  {
    path: '/admin/applications',
    element: <ProtectedRoute requireAdmin={true}><AdminApplications /></ProtectedRoute>
  },
  {
    path: '/admin/supplies',
    element: <ProtectedRoute requireAdmin={true}><AdminSupplies /></ProtectedRoute>
  },
  {
    path: '/admin/documents',
    element: <ProtectedRoute requireAdmin={true}><AdminDocuments /></ProtectedRoute>
  },
  {
    path: '/admin/team',
    element: <ProtectedRoute requireAdmin={true}><AdminTeam /></ProtectedRoute>
  },
  {
    path: '/admin/success-stories',
    element: <ProtectedRoute requireAdmin={true}><AdminSuccessStories /></ProtectedRoute>
  },
  {
    path: '/admin/business-licenses',
    element: <ProtectedRoute requireAdmin={true}><AdminBusinessLicenses /></ProtectedRoute>
  },
  {
    path: '/admin/direct-messages',
    element: <ProtectedRoute requireAdmin={true}><AdminDirectMessages /></ProtectedRoute>
  },
  {
    path: '/admin/orders',
    element: <ProtectedRoute requireAdmin={true}><AdminOrders /></ProtectedRoute>
  }
];
