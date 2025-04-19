
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  overlayOpacity?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
  overlayOpacity = '90'
}) => {
  return (
    <div className="relative bg-meow-primary/80">
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-b from-meow-primary/${overlayOpacity} to-meow-primary/60 mix-blend-multiply z-10`}></div>
        <img 
          src={backgroundImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
