import React from 'react';
import { supabase } from './integrations/supabase/client';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Lazy load components for code splitting
const Index = React.lazy(() => import('./pages/Index'));
const About = React.lazy(() => import('./pages/About'));
const Cats = React.lazy(() => import('./pages/Cats'));
const CatDetail = React.lazy(() => import('./pages/CatDetail'));
const Adopt = React.lazy(() => import('./pages/Adopt'));
const AdoptionForm = React.lazy(() => import('./pages/AdoptionForm'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Events = React.lazy(() => import('./pages/Events'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const Resources = React.lazy(() => import('./pages/Resources'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Donate = React.lazy(() => import('./pages/Donate'));
const Volunteer = React.lazy(() => import('./pages/Volunteer'));
const VolunteerForm = React.lazy(() => import('./pages/VolunteerForm'));
const Foster = React.lazy(() => import('./pages/Foster'));
const FosterForm = React.lazy(() => import('./pages/FosterForm'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const LostFound = React.lazy(() => import('./pages/LostFound'));
const LostFoundDetail = React.lazy(() => import('./pages/LostFoundDetail'));
const LostFoundForm = React.lazy(() => import('./pages/LostFoundForm'));
const SuccessStories = React.lazy(() => import('./pages/SuccessStories'));

// Admin pages
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminCats = React.lazy(() => import('./pages/AdminCats'));
const AdminCatForm = React.lazy(() => import('./pages/AdminCatForm'));
const AdminBlog = React.lazy(() => import('./pages/AdminBlog'));
const AdminBlogForm = React.lazy(() => import('./pages/AdminBlogForm'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers'));
const AdminFinance = React.lazy(() => import('./pages/AdminFinance'));
const AdminPages = React.lazy(() => import('./pages/AdminPages'));
const AdminEvents = React.lazy(() => import('./pages/AdminEvents'));
const AdminLostFound = React.lazy(() => import('./pages/AdminLostFound'));
const AdminMessages = React.lazy(() => import('./pages/AdminMessages'));
const AdminChat = React.lazy(() => import('./pages/AdminChat'));
const AdminSecurity = React.lazy(() => import('./pages/AdminSecurity'));
const AdminApplications = React.lazy(() => import('./pages/AdminApplications'));
const AdminSupplies = React.lazy(() => import('./pages/AdminSupplies'));
const AdminDocuments = React.lazy(() => import('./pages/AdminDocuments'));
const AdminTeam = React.lazy(() => import('./pages/AdminTeam'));
const AdminSuccessStories = React.lazy(() => import('./pages/AdminSuccessStories'));
const AdminBusinessLicenses = React.lazy(() => import('./pages/AdminBusinessLicenses'));
const AdminDirectMessages = React.lazy(() => import('./pages/AdminDirectMessages'));
const AdminOrders = React.lazy(() => import('./pages/AdminOrders'));

// Function to get static paths for dynamic routes
async function getCatIds() {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('id')
      .eq('is_published', true);
    
    if (error) throw error;
    return data.map(cat => `/cats/${cat.id}`);
  } catch (error) {
    console.error('Error fetching cat IDs:', error);
    return [];
  }
}

async function getBlogSlugs() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('is_published', true);
    
    if (error) throw error;
    return data.map(post => `/blog/${post.slug}`);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

// Wrap components with Layout
const wrapWithLayout = (Component, hideFooter = false) => (
  <Layout hideFooter={hideFooter}><Component /></Layout>
);

// Export routes for potential SSG/SSR usage in the future
export const routes = [
  {
    path: '/',
    element: wrapWithLayout(Index),
  },
  {
    path: '/about',
    element: wrapWithLayout(About),
  },
  {
    path: '/cats',
    element: wrapWithLayout(Cats),
  },
  {
    path: '/cats/:id',
    element: wrapWithLayout(CatDetail),
  },
  {
    path: '/adopt',
    element: wrapWithLayout(Adopt),
  },
  {
    path: '/adopt/apply',
    element: wrapWithLayout(AdoptionForm),
  },
  {
    path: '/foster',
    element: wrapWithLayout(Foster),
  },
  {
    path: '/foster/apply',
    element: wrapWithLayout(FosterForm),
  },
  {
    path: '/success-stories',
    element: wrapWithLayout(SuccessStories),
  },
  {
    path: '/blog',
    element: wrapWithLayout(Blog),
  },
  {
    path: '/blog/:slug',
    element: wrapWithLayout(BlogPost),
  },
  {
    path: '/events',
    element: wrapWithLayout(Events),
  },
  {
    path: '/events/:id',
    element: wrapWithLayout(EventDetail),
  },
  {
    path: '/resources',
    element: wrapWithLayout(Resources),
  },
  {
    path: '/contact',
    element: wrapWithLayout(Contact),
  },
  {
    path: '/donate',
    element: wrapWithLayout(Donate),
  },
  {
    path: '/volunteer',
    element: wrapWithLayout(Volunteer),
  },
  {
    path: '/volunteer/apply',
    element: wrapWithLayout(VolunteerForm),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/privacy-policy',
    element: wrapWithLayout(PrivacyPolicy),
  },
  {
    path: '/terms-of-service',
    element: wrapWithLayout(TermsOfService),
  },
  {
    path: '/lost-found',
    element: wrapWithLayout(LostFound),
  },
  {
    path: '/lost-found/:id',
    element: wrapWithLayout(LostFoundDetail),
  },
  {
    path: '/profile',
    element: <ProtectedRoute>{wrapWithLayout(Profile)}</ProtectedRoute>,
  },
  {
    path: '/lost-found/new',
    element: <ProtectedRoute>{wrapWithLayout(LostFoundForm)}</ProtectedRoute>,
  },
  {
    path: '/lost-found/edit/:id',
    element: <ProtectedRoute>{wrapWithLayout(LostFoundForm)}</ProtectedRoute>,
  },
  // Admin routes
  {
    path: '/admin',
    element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: '/admin/cats',
    element: <ProtectedRoute requireAdmin={true}><AdminCats /></ProtectedRoute>,
  },
  {
    path: '/admin/cats/new',
    element: <ProtectedRoute requireAdmin={true}><AdminCatForm /></ProtectedRoute>,
  },
  {
    path: '/admin/cats/edit/:id',
    element: <ProtectedRoute requireAdmin={true}><AdminCatForm /></ProtectedRoute>,
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute requireAdmin={true}><AdminUsers /></ProtectedRoute>,
  },
  {
    path: '/admin/finance',
    element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
  },
  {
    path: '/admin/finance/donations',
    element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
  },
  {
    path: '/admin/finance/income',
    element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
  },
  {
    path: '/admin/finance/expenses',
    element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
  },
  {
    path: '/admin/pages',
    element: <ProtectedRoute requireAdmin={true}><AdminPages /></ProtectedRoute>,
  },
  {
    path: '/admin/blog',
    element: <ProtectedRoute requireAdmin={true}><AdminBlog /></ProtectedRoute>,
  },
  {
    path: '/admin/blog/new',
    element: <ProtectedRoute requireAdmin={true}><AdminBlogForm /></ProtectedRoute>,
  },
  {
    path: '/admin/blog/edit/:id',
    element: <ProtectedRoute requireAdmin={true}><AdminBlogForm /></ProtectedRoute>,
  },
  {
    path: '/admin/events',
    element: <ProtectedRoute requireAdmin={true}><AdminEvents /></ProtectedRoute>,
  },
  {
    path: '/admin/lost-found',
    element: <ProtectedRoute requireAdmin={true}><AdminLostFound /></ProtectedRoute>,
  },
  {
    path: '/admin/messages',
    element: <ProtectedRoute requireAdmin={true}><AdminMessages /></ProtectedRoute>,
  },
  {
    path: '/admin/chat',
    element: <ProtectedRoute requireAdmin={true}><AdminChat /></ProtectedRoute>,
  },
  {
    path: '/admin/security',
    element: <ProtectedRoute requireAdmin={true}><AdminSecurity /></ProtectedRoute>,
  },
  {
    path: '/admin/applications',
    element: <ProtectedRoute requireAdmin={true}><AdminApplications /></ProtectedRoute>,
  },
  {
    path: '/admin/supplies',
    element: <ProtectedRoute requireAdmin={true}><AdminSupplies /></ProtectedRoute>,
  },
  {
    path: '/admin/documents',
    element: <ProtectedRoute requireAdmin={true}><AdminDocuments /></ProtectedRoute>,
  },
  {
    path: '/admin/team',
    element: <ProtectedRoute requireAdmin={true}><AdminTeam /></ProtectedRoute>,
  },
  {
    path: '/admin/success-stories',
    element: <ProtectedRoute requireAdmin={true}><AdminSuccessStories /></ProtectedRoute>,
  },
  {
    path: '/admin/business-licenses',
    element: <ProtectedRoute requireAdmin={true}><AdminBusinessLicenses /></ProtectedRoute>,
  },
  {
    path: '/admin/direct-messages',
    element: <ProtectedRoute requireAdmin={true}><AdminDirectMessages /></ProtectedRoute>,
  },
  {
    path: '/admin/orders',
    element: <ProtectedRoute requireAdmin={true}><AdminOrders /></ProtectedRoute>,
  },
  {
    path: '/admin/help',
    element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: '*',
    element: wrapWithLayout(NotFound),
  }
];
