
import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = true,
  className = ''
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-meow-dark mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-meow-neutral mt-2 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {/* Updated decorative line with proper spacing */}
      <div className={`h-1 w-20 bg-meow-secondary mt-6 ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeading;
