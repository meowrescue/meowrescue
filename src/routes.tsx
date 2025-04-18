import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import { supabase } from './integrations/supabase/client';
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components for code splitting
const Layout = React.lazy(() => import('./components/Layout'));
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

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public Routes
      {
        index: true,
        element: <Index />,
        entry: 'src/pages/Index.tsx'
      },
      {
        path: 'about',
        element: <About />,
        entry: 'src/pages/About.tsx'
      },
      {
        path: 'cats',
        element: <Cats />,
        entry: 'src/pages/Cats.tsx'
      },
      {
        path: 'cats/:id',
        element: <CatDetail />,
        entry: 'src/pages/CatDetail.tsx',
        getStaticPaths: getCatIds
      },
      {
        path: 'adopt',
        element: <Adopt />,
        entry: 'src/pages/Adopt.tsx'
      },
      {
        path: 'adopt/apply',
        element: <AdoptionForm />,
        entry: 'src/pages/AdoptionForm.tsx'
      },
      {
        path: 'foster',
        element: <Foster />,
        entry: 'src/pages/Foster.tsx'
      },
      {
        path: 'foster/apply',
        element: <FosterForm />,
        entry: 'src/pages/FosterForm.tsx'
      },
      {
        path: 'success-stories',
        element: <SuccessStories />,
        entry: 'src/pages/SuccessStories.tsx'
      },
      {
        path: 'blog',
        element: <Blog />,
        entry: 'src/pages/Blog.tsx'
      },
      {
        path: 'blog/:slug',
        element: <BlogPost />,
        entry: 'src/pages/BlogPost.tsx',
        getStaticPaths: getBlogSlugs
      },
      {
        path: 'events',
        element: <Events />,
        entry: 'src/pages/Events.tsx'
      },
      {
        path: 'events/:id',
        element: <EventDetail />,
        entry: 'src/pages/EventDetail.tsx'
      },
      {
        path: 'resources',
        element: <Resources />,
        entry: 'src/pages/Resources.tsx'
      },
      {
        path: 'contact',
        element: <Contact />,
        entry: 'src/pages/Contact.tsx'
      },
      {
        path: 'donate',
        element: <Donate />,
        entry: 'src/pages/Donate.tsx'
      },
      {
        path: 'volunteer',
        element: <Volunteer />,
        entry: 'src/pages/Volunteer.tsx'
      },
      {
        path: 'volunteer/apply',
        element: <VolunteerForm />,
        entry: 'src/pages/VolunteerForm.tsx'
      },
      {
        path: 'login',
        element: <Login />,
        entry: 'src/pages/Login.tsx'
      },
      {
        path: 'register',
        element: <Register />,
        entry: 'src/pages/Register.tsx'
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
        entry: 'src/pages/ResetPassword.tsx'
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
        entry: 'src/pages/PrivacyPolicy.tsx'
      },
      {
        path: 'terms-of-service',
        element: <TermsOfService />,
        entry: 'src/pages/TermsOfService.tsx'
      },
      {
        path: 'lost-found',
        element: <LostFound />,
        entry: 'src/pages/LostFound.tsx'
      },
      {
        path: 'lost-found/:id',
        element: <LostFoundDetail />,
        entry: 'src/pages/LostFoundDetail.tsx'
      },
      
      // Protected Routes (requires login)
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
        entry: 'src/pages/Profile.tsx'
      },
      {
        path: 'lost-found/new',
        element: <ProtectedRoute><LostFoundForm /></ProtectedRoute>,
        entry: 'src/pages/LostFoundForm.tsx'
      },
      {
        path: 'lost-found/edit/:id',
        element: <ProtectedRoute><LostFoundForm /></ProtectedRoute>,
        entry: 'src/pages/LostFoundForm.tsx'
      },
      
      // Admin Routes (requires admin login)
      {
        path: 'admin',
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>,
        entry: 'src/pages/AdminDashboard.tsx'
      },
      {
        path: 'admin/cats',
        element: <ProtectedRoute requireAdmin={true}><AdminCats /></ProtectedRoute>,
        entry: 'src/pages/AdminCats.tsx'
      },
      {
        path: 'admin/cats/new',
        element: <ProtectedRoute requireAdmin={true}><AdminCatForm /></ProtectedRoute>,
        entry: 'src/pages/AdminCatForm.tsx'
      },
      {
        path: 'admin/cats/edit/:id',
        element: <ProtectedRoute requireAdmin={true}><AdminCatForm /></ProtectedRoute>,
        entry: 'src/pages/AdminCatForm.tsx'
      },
      {
        path: 'admin/users',
        element: <ProtectedRoute requireAdmin={true}><AdminUsers /></ProtectedRoute>,
        entry: 'src/pages/AdminUsers.tsx'
      },
      {
        path: 'admin/finance',
        element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
        entry: 'src/pages/AdminFinance.tsx'
      },
      {
        path: 'admin/finance/donations',
        element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
        entry: 'src/pages/AdminFinance.tsx'
      },
      {
        path: 'admin/finance/income',
        element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
        entry: 'src/pages/AdminFinance.tsx'
      },
      {
        path: 'admin/finance/expenses',
        element: <ProtectedRoute requireAdmin={true}><AdminFinance /></ProtectedRoute>,
        entry: 'src/pages/AdminFinance.tsx'
      },
      {
        path: 'admin/pages',
        element: <ProtectedRoute requireAdmin={true}><AdminPages /></ProtectedRoute>,
        entry: 'src/pages/AdminPages.tsx'
      },
      {
        path: 'admin/blog',
        element: <ProtectedRoute requireAdmin={true}><AdminBlog /></ProtectedRoute>,
        entry: 'src/pages/AdminBlog.tsx'
      },
      {
        path: 'admin/blog/new',
        element: <ProtectedRoute requireAdmin={true}><AdminBlogForm /></ProtectedRoute>,
        entry: 'src/pages/AdminBlogForm.tsx'
      },
      {
        path: 'admin/blog/edit/:id',
        element: <ProtectedRoute requireAdmin={true}><AdminBlogForm /></ProtectedRoute>,
        entry: 'src/pages/AdminBlogForm.tsx'
      },
      {
        path: 'admin/events',
        element: <ProtectedRoute requireAdmin={true}><AdminEvents /></ProtectedRoute>,
        entry: 'src/pages/AdminEvents.tsx'
      },
      {
        path: 'admin/lost-found',
        element: <ProtectedRoute requireAdmin={true}><AdminLostFound /></ProtectedRoute>,
        entry: 'src/pages/AdminLostFound.tsx'
      },
      {
        path: 'admin/messages',
        element: <ProtectedRoute requireAdmin={true}><AdminMessages /></ProtectedRoute>,
        entry: 'src/pages/AdminMessages.tsx'
      },
      {
        path: 'admin/chat',
        element: <ProtectedRoute requireAdmin={true}><AdminChat /></ProtectedRoute>,
        entry: 'src/pages/AdminChat.tsx'
      },
      {
        path: 'admin/security',
        element: <ProtectedRoute requireAdmin={true}><AdminSecurity /></ProtectedRoute>,
        entry: 'src/pages/AdminSecurity.tsx'
      },
      {
        path: 'admin/applications',
        element: <ProtectedRoute requireAdmin={true}><AdminApplications /></ProtectedRoute>,
        entry: 'src/pages/AdminApplications.tsx'
      },
      {
        path: 'admin/supplies',
        element: <ProtectedRoute requireAdmin={true}><AdminSupplies /></ProtectedRoute>,
        entry: 'src/pages/AdminSupplies.tsx'
      },
      {
        path: 'admin/documents',
        element: <ProtectedRoute requireAdmin={true}><AdminDocuments /></ProtectedRoute>,
        entry: 'src/pages/AdminDocuments.tsx'
      },
      {
        path: 'admin/team',
        element: <ProtectedRoute requireAdmin={true}><AdminTeam /></ProtectedRoute>,
        entry: 'src/pages/AdminTeam.tsx'
      },
      {
        path: 'admin/success-stories',
        element: <ProtectedRoute requireAdmin={true}><AdminSuccessStories /></ProtectedRoute>,
        entry: 'src/pages/AdminSuccessStories.tsx'
      },
      {
        path: 'admin/business-licenses',
        element: <ProtectedRoute requireAdmin={true}><AdminBusinessLicenses /></ProtectedRoute>,
        entry: 'src/pages/AdminBusinessLicenses.tsx'
      },
      {
        path: 'admin/direct-messages',
        element: <ProtectedRoute requireAdmin={true}><AdminDirectMessages /></ProtectedRoute>,
        entry: 'src/pages/AdminDirectMessages.tsx'
      },
      {
        path: 'admin/orders',
        element: <ProtectedRoute requireAdmin={true}><AdminOrders /></ProtectedRoute>,
        entry: 'src/pages/AdminOrders.tsx'
      },
      {
        path: 'admin/help',
        element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>,
        entry: 'src/pages/AdminDashboard.tsx'
      },
      
      // Catch-all route for 404
      {
        path: '*',
        element: <NotFound />,
        entry: 'src/pages/NotFound.tsx'
      }
    ]
  }
];
