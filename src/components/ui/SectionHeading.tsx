
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
    <div className={`mb-8 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-meow-primary relative inline-block">
        {title}
      </h2>
      <div className={`h-1 bg-meow-secondary w-20 mt-4 mb-2 ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className="text-lg text-gray-600 mt-4">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
