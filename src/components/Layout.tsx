
import React, { ReactNode, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BusinessHoursProvider } from '@/components/BusinessHoursProvider';
import { scrollToTop } from '@/utils/scrollUtils';

// Lazy load the ChatWidget component as it's not needed immediately
const ChatWidget = lazy(() => import('@/components/ChatWidget'));

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change for better user experience
    scrollToTop();
    
    // Preload important resources based on current route
    if (location.pathname === '/cats') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = 'https://yourapi.example.com/api/cats';
      document.head.appendChild(link);
    }
    
    // Add preloading for other critical pages
    if (location.pathname === '/') {
      // Preload featured cats images for the homepage
      const featuredCatsLink = document.createElement('link');
      featuredCatsLink.rel = 'preload';
      featuredCatsLink.as = 'fetch';
      featuredCatsLink.href = 'https://yourapi.example.com/api/featured-cats';
      document.head.appendChild(featuredCatsLink);
    }
  }, [location.pathname]);
  
  return (
    <BusinessHoursProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        {!hideFooter && <Footer />}
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </div>
    </BusinessHoursProvider>
  );
};

export default Layout;
