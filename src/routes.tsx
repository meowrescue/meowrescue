
import { RouteObject } from 'react-router-dom';
import { cats } from './data/cats';

// Import all the pages
import Index from './pages/Index';
import About from './pages/About';
import Cats from './pages/Cats';
import CatDetail from './pages/CatDetail';
import Adopt from './pages/Adopt';
import AdoptionForm from './pages/AdoptionForm';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import VolunteerForm from './pages/VolunteerForm';
import Foster from './pages/Foster';
import FosterForm from './pages/FosterForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import LostFound from './pages/LostFound';
import LostFoundDetail from './pages/LostFoundDetail';
import LostFoundForm from './pages/LostFoundForm';
import SuccessStories from './pages/SuccessStories';
import FinancialTransparency from './pages/FinancialTransparency';

// This function will be used to generate all the static paths for cats
export async function fetchAllCatIds() {
  // For now we'll use our mock data, but in production this would
  // fetch from Supabase or your API
  return cats.map(cat => cat.id);
}

// This function will generate static paths for blog posts
export async function fetchAllBlogSlugs() {
  // Mock function - replace with real data fetching in production
  return ['caring-for-senior-cats', 'kitten-season-tips', 'adoption-success-stories'];
}

// This function will generate static paths for events
export async function fetchAllEventIds() {
  // Mock function - replace with real data fetching in production
  return ['event1', 'event2', 'event3'];
}

// Define the routes with their components
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/cats',
    element: <Cats />,
  },
  {
    path: '/cats/:id',
    element: <CatDetail />,
  },
  {
    path: '/adopt',
    element: <Adopt />,
  },
  {
    path: '/adopt/apply',
    element: <AdoptionForm />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/blog/:slug',
    element: <BlogPost />,
  },
  {
    path: '/events',
    element: <Events />,
  },
  {
    path: '/events/:id',
    element: <EventDetail />,
  },
  {
    path: '/resources',
    element: <Resources />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/donate',
    element: <Donate />,
  },
  {
    path: '/volunteer',
    element: <Volunteer />,
  },
  {
    path: '/volunteer/apply',
    element: <VolunteerForm />,
  },
  {
    path: '/foster',
    element: <Foster />,
  },
  {
    path: '/foster/apply',
    element: <FosterForm />,
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
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />,
  },
  {
    path: '/lost-found',
    element: <LostFound />,
  },
  {
    path: '/lost-found/:id',
    element: <LostFoundDetail />,
  },
  {
    path: '/lost-found/new',
    element: <LostFoundForm />,
  },
  {
    path: '/lost-found/edit/:id',
    element: <LostFoundForm />,
  },
  {
    path: '/success-stories',
    element: <SuccessStories />,
  },
  {
    path: '/financial-transparency',
    element: <FinancialTransparency />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
];

// Export the static paths that should be pre-rendered
export const getStaticPaths = async () => {
  const catIds = await fetchAllCatIds();
  const blogSlugs = await fetchAllBlogSlugs();
  const eventIds = await fetchAllEventIds();
  
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
    '/success-stories',
    '/financial-transparency',
    '/404',
    ...catIds.map(id => `/cats/${id}`),
    ...blogSlugs.map(slug => `/blog/${slug}`),
    ...eventIds.map(id => `/events/${id}`),
  ];
  
  return paths;
};
