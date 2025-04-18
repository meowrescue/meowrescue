import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderColor?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderColor = '#f3f4f6'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    
    // Create new image object to preload the image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src]);

  // Generate optimized image URL if width and height are provided
  const optimizedSrc = (src: string): string => {
    if (!width || !height || !src) return src;
    
    // If it's an external URL that supports image optimization (like Cloudinary, Imgix, etc.)
    if (src.includes('unsplash.com')) {
      // Example for Unsplash
      return src.includes('?') 
        ? `${src}&w=${width}&q=80` 
        : `${src}?w=${width}&q=80`;
    }
    
    // For other external URLs, return as is
    return src;
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: placeholderColor,
        aspectRatio: width && height ? `${width}/${height}` : 'auto'
      }}
    >
      {currentSrc && (
        <img
          src={optimizedSrc(currentSrc)}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};
