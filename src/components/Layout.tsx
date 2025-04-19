import React, { ReactNode, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BusinessHoursProvider } from '@/components/BusinessHoursProvider';
import { scrollToTop } from '@/utils/scrollUtils';
import SEO from '@/components/SEO';
import { seoMeta } from '@/utils/seoMeta';

// Lazy‑load chat widget (client‑side only)
const ChatWidget = lazy(() => import('@/components/ChatWidget'));

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();

  // Scroll to top & preload critical resources on route change
  useEffect(() => {
    scrollToTop();

    if (location.pathname === '/cats') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = 'https://yourapi.example.com/api/cats';
      document.head.appendChild(link);
    }

    if (location.pathname === '/') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = 'https://yourapi.example.com/api/featured-cats';
      document.head.appendChild(link);
    }
  }, [location.pathname]);

  // Pick route‑specific meta or fall back to site‑wide defaults
  const meta = seoMeta[location.pathname as keyof typeof seoMeta] ?? seoMeta['/'];

  return (
    <BusinessHoursProvider>
      {/* Dynamic SEO tags */}
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonicalUrl={location.pathname}
      />

      {/* Page shell */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">{children}</main>
        {!hideFooter && <Footer />}
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </div>
    </BusinessHoursProvider>
  );
};

export default Layout;
