import { lazy } from 'react';
import Index from './pages/Index';  // Import Index component
import About from './pages/About';  // Import About component
import Cats from './pages/Cats';  // Import Cats component
import CatDetail from './pages/CatDetail';  // Import CatDetail component
import Adopt from './pages/Adopt';  // Import Adopt component
import AdoptionForm from './pages/AdoptionForm';  // Import AdoptionForm component
import Blog from './pages/Blog';  // Import Blog component
import BlogPost from './pages/BlogPost';  // Import BlogPost component
import Events from './pages/Events';  // Import Events component
import EventDetail from './pages/EventDetail';  // Import EventDetail component
import Resources from './pages/Resources';  // Import Resources component
import Contact from './pages/Contact';  // Import Contact component
import Donate from './pages/Donate';  // Import Donate component
import Volunteer from './pages/Volunteer';  // Import Volunteer component
import VolunteerForm from './pages/VolunteerForm';  // Import VolunteerForm component

/** 
 * Central route list used by vite‑react‑ssg. 
 * Every page is directly imported for static site generation (SSG).
 */
const routes = [
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
];

export default routes;
