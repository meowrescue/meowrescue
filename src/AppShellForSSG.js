// src/AppShellForSSG.js
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

function AppShellForSSG() {
  return React.createElement(
    HelmetProvider,
    {},
    React.createElement(
      Routes,
      {},
      [
        React.createElement(Route, { key: '/', path: '/', element: React.createElement(HomePage) }),
        React.createElement(Route, { key: '/about', path: '/about', element: React.createElement(AboutPage) }),
        React.createElement(Route, { key: '/cats', path: '/cats', element: React.createElement(CatsPage) }),
        React.createElement(Route, { key: '/adopt', path: '/adopt', element: React.createElement(AdoptPage) }),
        React.createElement(Route, { key: '/adopt/apply', path: '/adopt/apply', element: React.createElement(ApplyPage) }),
        React.createElement(Route, { key: '/blog', path: '/blog', element: React.createElement(BlogPage) }),
        React.createElement(Route, { key: '/events', path: '/events', element: React.createElement(EventsPage) }),
        React.createElement(Route, { key: '/resources', path: '/resources', element: React.createElement(ResourcesPage) }),
        React.createElement(Route, { key: '/contact', path: '/contact', element: React.createElement(ContactPage) }),
        React.createElement(Route, { key: '/donate', path: '/donate', element: React.createElement(DonatePage) }),
        React.createElement(Route, { key: '/volunteer', path: '/volunteer', element: React.createElement(VolunteerPage) }),
        React.createElement(Route, { key: '/volunteer/apply', path: '/volunteer/apply', element: React.createElement(VolunteerApplyPage) }),
        React.createElement(Route, { key: '/foster', path: '/foster', element: React.createElement(FosterPage) }),
        React.createElement(Route, { key: '/foster/apply', path: '/foster/apply', element: React.createElement(FosterApplyPage) }),
        React.createElement(Route, { key: '/lost-found', path: '/lost-found', element: React.createElement(LostFoundPage) }),
        React.createElement(Route, { key: '/privacy-policy', path: '/privacy-policy', element: React.createElement(PrivacyPolicyPage) }),
        React.createElement(Route, { key: '/terms-of-service', path: '/terms-of-service', element: React.createElement(TermsOfServicePage) }),
        React.createElement(Route, { key: '*', path: '*', element: React.createElement(NotFoundPage) }),
      ]
    )
  );
}

export default AppShellForSSG;
