
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import CustomNavbar from './CustomNavbar'; // Use our custom navbar
import { useScrollToElement } from '@/hooks/use-scroll';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  useScrollToElement();

  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
