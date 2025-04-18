import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  imageSrc,
  imageAlt = "Hero image",
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink
}) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageSrc} 
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="eager" // Load immediately as it's above the fold
          fetchPriority="high"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="default" size="xl" className="rounded-full">
            <Link to={ctaLink}>
              {ctaText}
            </Link>
          </Button>
          
          {secondaryCtaText && secondaryCtaLink && (
            <Button asChild variant="outline" size="xl" className="rounded-full text-white border-white hover:bg-white/10">
              <Link to={secondaryCtaLink}>
                {secondaryCtaText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
