
import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import MissionSection from '../components/MissionSection';
import UrgentNeedsSection from '../components/UrgentNeedsSection';
import FeaturedCatsSection from '../components/FeaturedCatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import SEO from '@/components/SEO';

const Index: React.FC = () => {
  // Define structured data for organization
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Meow Rescue",
    "url": "https://meowrescue.org",
    "logo": "https://meowrescue.org/images/meow-rescue-logo.jpg",
    "sameAs": [
      "https://facebook.com/meowrescue",
      "https://instagram.com/meowrescue"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Port Richey",
      "addressRegion": "FL",
      "postalCode": "34653",
      "addressCountry": "US"
    },
    "description": "Meow Rescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
  };

  return (
    <Layout>
      <SEO 
        title="Meow Rescue - Saving Cat Lives in Pasco County, Florida" 
        description="We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
        keywords="cat rescue, cat adoption, feline rescue, kitten adoption, Florida cat rescue, Pasco County animal rescue, pet adoption"
        canonicalUrl="/"
        structuredData={organizationStructuredData}
      />
      
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
    </Layout>
  );
};

export default Index;
