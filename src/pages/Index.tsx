
import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import MissionSection from '../components/MissionSection';
import UrgentNeedsSection from '../components/UrgentNeedsSection';
import FeaturedCatsSection from '../components/FeaturedCatsSection';
import TestimonialsSection from '../components/TestimonialsSection';

const Index: React.FC = () => {
  return (
    <>
      <HeroSection 
        title="Saving Local Lives, One Paw at a Time"
        subtitle="We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
        imageSrc="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1143&q=80"
        ctaText="Adopt a Cat"
        ctaLink="/cats"
        secondaryCtaText="Donate Now"
        secondaryCtaLink="/donate"
      />
      
      <StatsSection />
      <MissionSection />
      <UrgentNeedsSection />
      <FeaturedCatsSection />
      <TestimonialsSection />
    </>
  );
};

export default Index;
