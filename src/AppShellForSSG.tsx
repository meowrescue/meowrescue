
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index.js';
import About from './pages/About.js';
import Cats from './pages/Cats.js';
import Adopt from './pages/Adopt.js';
import AdoptionForm from './pages/AdoptionForm.js';
import Blog from './pages/Blog.js';
import Events from './pages/Events.js';
import Resources from './pages/Resources.js';
import Contact from './pages/Contact.js';
import Donate from './pages/Donate.js';
import Volunteer from './pages/Volunteer.js';
import VolunteerForm from './pages/VolunteerForm.js';
import Foster from './pages/Foster.js';
import FosterForm from './pages/FosterForm.js';
import LostFound from './pages/LostFound.js';
import PrivacyPolicy from './pages/PrivacyPolicy.js';
import TermsOfService from './pages/TermsOfService.js';
import NotFound from './pages/NotFound.js';

// ⚡️ ONLY lightweight safe stuff above — no auth, no tooltips, no browser things.

export function AppShellForSSG() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/cats" element={<Cats />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/adopt/apply" element={<AdoptionForm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/volunteer/apply" element={<VolunteerForm />} />
        <Route path="/foster" element={<Foster />} />
        <Route path="/foster/apply" element={<FosterForm />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}

export default AppShellForSSG;
