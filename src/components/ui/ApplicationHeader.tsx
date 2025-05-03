
import React from 'react';

interface ApplicationHeaderProps {
  title: string;
  subtitle?: string;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba" 
          alt="Cat background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-meow-primary/80 to-meow-secondary/60 mix-blend-multiply"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-meow-primary mb-2">{title}</h1>
        <div className="h-1 w-20 bg-meow-secondary mx-auto mb-4"></div>
        {subtitle && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationHeader;
