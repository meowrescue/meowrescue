
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
      <HeroSection />
      <MissionSection />
      <FeaturedCatsSection />
      <UrgentNeedsSection />
      <TestimonialsSection />
      <CtaSection />
    </Layout>
  );
};

export default Home;
