import { lazy } from 'react'

/**
 * Central route list used by vite‑react‑ssg.
 * Every page is code‑split with React.lazy().
 */
const routes = [
  { path: '/',               element: lazy(() => import('./pages/Index')) },
  { path: '/about',          element: lazy(() => import('./pages/About')) },
  { path: '/cats',           element: lazy(() => import('./pages/Cats')) },
  { path: '/cats/:id',       element: lazy(() => import('./pages/CatDetail')) },
  { path: '/adopt',          element: lazy(() => import('./pages/Adopt')) },
  { path: '/adopt/apply',    element: lazy(() => import('./pages/AdoptionForm')) },
  { path: '/blog',           element: lazy(() => import('./pages/Blog')) },
  { path: '/blog/:slug',     element: lazy(() => import('./pages/BlogPost')) },
  { path: '/events',         element: lazy(() => import('./pages/Events')) },
  { path: '/events/:id',     element: lazy(() => import('./pages/EventDetail')) },
  { path: '/resources',      element: lazy(() => import('./pages/Resources')) },
  { path: '/contact',        element: lazy(() => import('./pages/Contact')) },
  { path: '/donate',         element: lazy(() => import('./pages/Donate')) },
  { path: '/volunteer',      element: lazy(() => import('./pages/Volunteer')) },
  { path: '/volunteer/apply',element: lazy(() => import('./pages/VolunteerForm')) },
]

export default routes
