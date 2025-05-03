
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-b from-meow-primary to-meow-primary/80 py-16 md:py-24 text-center relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba" 
          alt="Cat background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-meow-primary/90 to-meow-primary/70 mix-blend-multiply"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <div className="h-1 w-20 bg-meow-secondary mx-auto mb-4"></div>
        {subtitle && (
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
