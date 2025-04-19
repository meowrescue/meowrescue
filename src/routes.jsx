import Index from './pages/Index'
import About from './pages/About'
import Cats from './pages/Cats'
import CatDetail from './pages/CatDetail'
import Adopt from './pages/Adopt'
import AdoptionForm from './pages/AdoptionForm'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Resources from './pages/Resources'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import Volunteer from './pages/Volunteer'
import VolunteerForm from './pages/VolunteerForm'

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
]

export default routes
