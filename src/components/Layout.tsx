
import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BusinessHoursProvider } from '@/components/BusinessHoursProvider';
import ChatWidget from '@/components/ChatWidget';
import { scrollToTop } from '@/utils/scrollUtils';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);
  
  return (
    <BusinessHoursProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">{children}</main>
        {!hideFooter && <Footer />}
        <ChatWidget />
      </div>
    </BusinessHoursProvider>
  );
};

export default Layout;
