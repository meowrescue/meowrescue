
import React from 'react';
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  imageSrc, 
  ctaText, 
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink 
}) => {
  return (
    <section className="relative h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      
      {/* Content */}
      <div className="container relative h-full mx-auto px-4 flex items-center">
        <div className="max-w-3xl text-white animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{title}</h1>
          <p className="text-xl md:text-2xl mb-8">{subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-meow-secondary hover:bg-meow-secondary/90 text-white px-8 py-3 text-lg"
              asChild
            >
              <a href={ctaLink}>{ctaText}</a>
            </Button>
            
            {secondaryCtaText && secondaryCtaLink && (
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-3 text-lg"
                asChild
              >
                <a href={secondaryCtaLink}>{secondaryCtaText}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
