
import { RouteObject } from 'react-router-dom';
import Index from '../pages/Index.js';
import About from '../pages/About.js';
import Cats from '../pages/Cats.js';
import CatDetail from '../pages/CatDetail.js';
import Adopt from '../pages/Adopt.js';
import AdoptionForm from '../pages/AdoptionForm.js';
import Blog from '../pages/Blog.js';
import BlogPost from '../pages/BlogPost.js';
import Events from '../pages/Events.js';
import EventDetail from '../pages/EventDetail.js';
import Resources from '../pages/Resources.js';
import Contact from '../pages/Contact.js';
import Donate from '../pages/Donate.js';
import Volunteer from '../pages/Volunteer.js';
import VolunteerForm from '../pages/VolunteerForm.js';
import Foster from '../pages/Foster.js';
import FosterForm from '../pages/FosterForm.js';
import Login from '../pages/Login.js';
import Register from '../pages/Register.js';
import ResetPassword from '../pages/ResetPassword.js';
import PrivacyPolicy from '../pages/PrivacyPolicy.js';
import TermsOfService from '../pages/TermsOfService.js';
import LostFound from '../pages/LostFound.js';
import LostFoundDetail from '../pages/LostFoundDetail.js';
import SuccessStories from '../pages/SuccessStories.js';
import NotFound from '../pages/NotFound.js';

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <Index /> },
  { path: '/about', element: <About /> },
  { path: '/cats', element: <Cats /> },
  { path: '/cats/:id', element: <CatDetail /> },
  { path: '/adopt', element: <Adopt /> },
  { path: '/adopt/apply', element: <AdoptionForm /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:slug', element: <BlogPost /> },
  { path: '/events', element: <Events /> },
  { path: '/events/:id', element: <EventDetail /> },
  { path: '/resources', element: <Resources /> },
  { path: '/contact', element: <Contact /> },
  { path: '/donate', element: <Donate /> },
  { path: '/volunteer', element: <Volunteer /> },
  { path: '/volunteer/apply', element: <VolunteerForm /> },
  { path: '/foster', element: <Foster /> },
  { path: '/foster/apply', element: <FosterForm /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/lost-found', element: <LostFound /> },
  { path: '/lost-found/:id', element: <LostFoundDetail /> },
  { path: '/success-stories', element: <SuccessStories /> },
  { path: '*', element: <NotFound /> }
];
