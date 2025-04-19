import { lazy } from 'react';
import Index from './pages/Index';  // Ensure the correct import
import About from './pages/About';  // Import the About component

/** 
 * Central route list used by vite‑react‑ssg. 
 * Every page is directly imported for static site generation (SSG).
 */
const routes = [
  { path: '/', element: <Index /> },
  { path: '/about', element: <About /> },  // Now the About component is correctly routed
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
