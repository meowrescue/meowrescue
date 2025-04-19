
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
import AdminLayout from '../pages/Admin.tsx';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/cats',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Cats"><AdminCats /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/cats/new',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="New Cat"><AdminCatForm /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/cats/edit/:id',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Edit Cat"><AdminCatForm /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Users"><AdminUsers /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/finance',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Finance"><AdminFinance /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/pages',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Pages"><AdminPages /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/blog',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Blog"><AdminBlog /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/blog/new',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="New Blog Post"><AdminBlogForm /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/blog/edit/:id',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Edit Blog Post"><AdminBlogForm /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/events',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Events"><AdminEvents /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/lost-found',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Lost & Found"><AdminLostFound /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/messages',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Messages"><AdminMessages /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/chat',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Chat"><AdminChat /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/security',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Security"><AdminSecurity /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/applications',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Applications"><AdminApplications /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/supplies',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Supplies"><AdminSupplies /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/documents',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Documents"><AdminDocuments /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/team',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Team"><AdminTeam /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/success-stories',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Success Stories"><AdminSuccessStories /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/business-licenses',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Business Licenses"><AdminBusinessLicenses /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/direct-messages',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Direct Messages"><AdminDirectMessages /></AdminLayout></ProtectedRoute>
  },
  {
    path: '/admin/orders',
    element: <ProtectedRoute requireAdmin={true}><AdminLayout title="Orders"><AdminOrders /></AdminLayout></ProtectedRoute>
  }
];
