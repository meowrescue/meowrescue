// src/AppShellForSSG.tsx
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CatsPage from './pages/CatsPage';
import AdoptPage from './pages/AdoptPage';
import ApplyPage from './pages/adopt/ApplyPage';
import BlogPage from './pages/BlogPage';
import EventsPage from './pages/EventsPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import DonatePage from './pages/DonatePage';
import VolunteerPage from './pages/VolunteerPage';
import VolunteerApplyPage from './pages/volunteer/ApplyPage';
import FosterPage from './pages/FosterPage';
import FosterApplyPage from './pages/foster/ApplyPage';
import LostFoundPage from './pages/LostFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';

// ⚡️ ONLY lightweight safe stuff above — no auth, no tooltips, no browser things.

export function AppShellForSSG() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cats" element={<CatsPage />} />
        <Route path="/adopt" element={<AdoptPage />} />
        <Route path="/adopt/apply" element={<ApplyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/volunteer/apply" element={<VolunteerApplyPage />} />
        <Route path="/foster" element={<FosterPage />} />
        <Route path="/foster/apply" element={<FosterApplyPage />} />
        <Route path="/lost-found" element={<LostFoundPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}
