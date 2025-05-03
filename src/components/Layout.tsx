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
    
    // Add class to body when content is loaded
    document.body.classList.add('content-loaded');
    
    // Hide any fallback content immediately
    const fallbackContent = document.querySelector('.fallback-content');
    if (fallbackContent) {
      (fallbackContent as HTMLElement).style.display = 'none';
      fallbackContent.setAttribute('aria-hidden', 'true');
    }
    
    // Mark the react content as visible immediately
    const reactContent = document.querySelector('.react-only-content');
    if (reactContent) {
      (reactContent as HTMLElement).style.opacity = '1';
    }
    
    // Preload critical resources based on current route - commented out external API calls
    // if (location.pathname === '/cats') {
    //   const link = document.createElement('link');
    //   link.rel = 'preload';
    //   link.as = 'fetch';
    //   link.href = 'https://yourapi.example.com/api/cats';
    //   document.head.appendChild(link);
    // }
    
    // Add preloading for other critical pages
    // if (location.pathname === '/') {
    //   // Preload featured cats images for the homepage
    //   const featuredCatsLink = document.createElement('link');
    //   featuredCatsLink.rel = 'preload';
    //   featuredCatsLink.as = 'fetch';
    //   featuredCatsLink.href = 'https://yourapi.example.com/api/featured-cats';
    //   document.head.appendChild(featuredCatsLink);
    // }
  }, [location.pathname]);
  
  // Don't apply this layout to admin pages
  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  return (
    <BusinessHoursProvider>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      
      <div className="flex flex-col min-h-screen">
        <header className="site-header">
          <Navbar />
        </header>
        
        <main id="main-content" className="flex-grow">
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
