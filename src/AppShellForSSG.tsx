
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Cats from './pages/Cats';
import Adopt from './pages/Adopt';
import AdoptionForm from './pages/AdoptionForm';
import Blog from './pages/Blog';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import VolunteerForm from './pages/VolunteerForm';
import Foster from './pages/Foster';
import FosterForm from './pages/FosterForm';
import LostFound from './pages/LostFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

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
