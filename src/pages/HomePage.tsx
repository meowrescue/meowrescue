import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MissionSection from '@/components/MissionSection';
import UrgentNeedsSection from '@/components/UrgentNeedsSection';
import FeaturedCatsSection from '@/components/FeaturedCatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { supabase, checkSupabaseConnection, checkFinancialData } from '@/integrations/supabase'; // Import Supabase client instance

// The HomePage component is the main entry point for the home page
const HomePage: React.FC = () => {
  // Define structured data for organization (for SEO)
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Meow Rescue",
    "url": "https://meowrescue.org",
    "logo": {
      "@type": "ImageObject",
      "url": "https://meowrescue.org/images/meow-rescue-logo.jpg", 
      "width": "512",
      "height": "512"
    },
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
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-555-5555",
      "contactType": "customer service"
    },
    "description": "Meow Rescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
  };

  // Local business structured data
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", 
    "name": "Meow Rescue",
    "image": "https://meowrescue.org/images/meow-rescue-logo.jpg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Cat Avenue",
      "addressLocality": "New Port Richey",
      "addressRegion": "FL",
      "postalCode": "34653",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.2442",
      "longitude": "-82.7218"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "10:00",
        "closes": "15:00"
      }
    ],
    "telephone": "+1-555-555-5555",
    "url": "https://meowrescue.org"
  };

  // WebSite schema data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Meow Rescue",
    "url": "https://meowrescue.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://meowrescue.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "Meow Rescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
  };

  // Define alternate language versions (if you have them)
  const alternateLanguages = [
    { lang: "en", url: "https://meowrescue.org/" },
    { lang: "es", url: "https://meowrescue.org/es/" }
  ];

  // Assuming featuredCats is fetched using a hook or state, we'll use a simple state update for refetching
  const [refreshKey, setRefreshKey] = useState(0);
  const refetchFeaturedCats = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Subscribe to real-time updates for featured cats
  useEffect(() => {
    
    const subscription = supabase
      .channel('featured-cats-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cats' }, (payload) => {
        console.log('Cat update received:', payload);
        refetchFeaturedCats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetchFeaturedCats]);

  return (
    <Layout>
      <SEO 
        title="Meow Rescue | Feline Friends Finding Forever Homes" 
        description="Heartwarming stories of cats finding their perfect families through Meow Rescue - a home-based cat rescue in Pasco County, Florida dedicated to rescuing and rehoming cats." 
        keywords="cat rescue, cat adoption, feline rescue, kitten adoption, Florida cat rescue, Pasco County animal rescue, pet adoption"
        url="/"
        structuredData={[organizationStructuredData, localBusinessData, websiteData]}
        alternateLanguages={alternateLanguages}
      />
      
      <HeroSection 
        title="Saving Local Lives, One Paw at a Time"
        subtitle="We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
        imageSrc="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1143&q=80"
        imageAlt="A beautiful cat looking into the camera, representing the cats available for adoption at Meow Rescue"
        ctaText="Adopt a Cat"
        ctaLink="/cats"
        secondaryCtaText="Donate Now"
        secondaryCtaLink="/donate"
      />
      
      <StatsSection />
      <MissionSection />
      <UrgentNeedsSection />
      <FeaturedCatsSection key={refreshKey} />
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;
