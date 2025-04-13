
import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BusinessHoursProvider } from '@/components/BusinessHoursProvider';
import ChatWidget from '@/components/ChatWidget';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
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
