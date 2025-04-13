
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description,
  image
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {title && <SEO title={title} description={description} ogImage={image} />}
      
      {/* Add a top margin to account for fixed navbar */}
      <Navbar />
      
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
