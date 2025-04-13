
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import FeaturedCatsSection from '@/components/FeaturedCatsSection';
import UrgentNeedsSection from '@/components/UrgentNeedsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CtaSection from '@/components/CtaSection';
import SEO from '@/components/SEO';

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="Meow Rescue - Save and Protect Cats" 
        description="Meow Rescue is dedicated to saving and protecting cats in need. Adopt, foster, and support our mission." 
      />
      <HeroSection 
        title="Save a Life, Adopt a Cat"
        subtitle="Find your perfect feline companion and make a difference"
        imageSrc="/images/hero-cat.jpg"
        ctaText="View Available Cats"
        ctaLink="/cats"
      />
      <MissionSection />
      <FeaturedCatsSection />
      <UrgentNeedsSection />
      <TestimonialsSection />
      <CtaSection 
        title="Ready to Make a Difference?"
        description="Join our mission to save and protect cats in need"
        buttonText="Get Involved"
        buttonLink="/volunteer"
      />
    </Layout>
  );
};

export default Home;
