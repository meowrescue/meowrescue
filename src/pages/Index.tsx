import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import MissionSection from '../components/MissionSection';
import UrgentNeedsSection from '../components/UrgentNeedsSection';
import FeaturedCatsSection from '../components/FeaturedCatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import SEO from '@/components/SEO';
import { Helmet } from 'react-helmet-async';
import MinimalIndex from './MinimalIndex';

const Index: React.FC = () => {
  const [renderFull, setRenderFull] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Index page mounted');
    
    // Add fallback in case of rendering errors
    const timer = setTimeout(() => {
      if (!document.querySelector('main')) {
        console.error('Main element not found in DOM after timeout');
        setRenderFull(false);
        setRenderError('Main element not found in DOM after timeout');
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Define local business structured data (for local SEO)
  const localBusinessStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Meow Rescue",
    "image": "https://meowrescue.org/images/meow-rescue-logo.jpg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St",
      "addressLocality": "New Port Richey",
      "addressRegion": "FL",
      "postalCode": "34653",
      "addressCountry": "US"
    },
    "telephone": "+1-555-555-5555",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "10:00",
        "closes": "15:00"
      }
    ]
  };

  // Create a combined array of structured data for multiple JSON-LD scripts
  const structuredDataArray = [organizationStructuredData, localBusinessStructuredData];

  // If we're in fallback mode, render the minimal index
  if (!renderFull) {
    console.log('Rendering minimal index due to error:', renderError);
    return <MinimalIndex />;
  }

  console.log('Rendering full index page');

  try {
    return (
      <Layout>
        {/* Core SEO metadata */}
        <SEO 
          title="Meow Rescue - Saving Cat Lives in Pasco County, Florida" 
          description="We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
          keywords="cat rescue, cat adoption, feline rescue, kitten adoption, Florida cat rescue, Pasco County animal rescue, pet adoption"
          canonicalUrl="/"
          structuredData={organizationStructuredData}
        />
        
        {/* Additional structured data */}
        <Helmet>
          {structuredDataArray.map((data, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(data)}
            </script>
          ))}
          {/* Add canonical URL explicitly */}
          <link rel="canonical" href="https://meowrescue.org/" />
          {/* Add OpenGraph tags explicitly */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://meowrescue.org/" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          {/* Add Twitter Card tags explicitly */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:domain" content="meowrescue.org" />
          {/* Add fresh content indicator */}
          <meta name="last-modified" content={new Date().toISOString()} />
        </Helmet>
        
        {/* Main content with proper headings structure */}
        <main data-testid="index-main-content">
          <h1 className="sr-only">Meow Rescue - Saving Cat Lives in Pasco County, Florida</h1>
          
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
          <FeaturedCatsSection />
          <TestimonialsSection />
        </main>
      </Layout>
    );
  } catch (error) {
    console.error('Error rendering full Index page:', error);
    return <MinimalIndex />;
  }
};

export default Index;
