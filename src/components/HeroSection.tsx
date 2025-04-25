
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Hero background image with updated overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageSrc} 
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="eager" 
          fetchPriority="high"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-meow-light to-transparent z-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 z-5"></div>
      
      {/* Hero content with staggered animations */}
      <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg font-display"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow-md leading-relaxed"
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >            
            <Button 
              asChild 
              variant="meow" 
              size="xl" 
              className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-primary hover:border-[#003366] transform hover:translate-y-[-2px] transition-all"
            >
              <Link to={ctaLink}>
                {ctaText}
              </Link>
            </Button>
            
            {secondaryCtaText && secondaryCtaLink && (
              <Button 
                asChild 
                variant="outline"
                size="xl"
                className="rounded-full border-2 border-white text-white bg-white/10 backdrop-filter backdrop-blur-sm hover:bg-white/20 px-8 py-6 text-lg font-semibold transform hover:translate-y-[-2px] transition-all"
              >
                <Link to={secondaryCtaLink}>
                  {secondaryCtaText}
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
