
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="relative bg-gradient-to-r from-meow-primary/90 to-meow-primary py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default PageHeader;
