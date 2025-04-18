
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
  // Create current date for lastmod in Schema.org
  const currentDate = new Date().toISOString();
  
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
    "dateModified": currentDate,
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
    "dateModified": currentDate,
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

  // Define website Schema.org for better SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://meowrescue.org/",
    "name": "Meow Rescue",
    "description": "Meow Rescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://meowrescue.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "dateModified": currentDate
  };

  // Create a combined array of structured data for multiple JSON-LD scripts
  const structuredDataArray = [organizationStructuredData, localBusinessStructuredData, websiteSchema];

  return (
    <Layout>
      {/* Core SEO metadata handled by our SEO component */}
      <SEO 
        title="Meow Rescue - Saving Cat Lives in Pasco County, Florida" 
        description="We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
        keywords="cat rescue, cat adoption, feline rescue, kitten adoption, Florida cat rescue, Pasco County animal rescue, pet adoption"
        canonicalUrl="/"
        structuredData={structuredDataArray}
        modifiedTime={currentDate}
      />
      
      {/* Main content with proper headings structure */}
      <main>
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
        
        <section id="stats" className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <StatsSection />
          </div>
        </section>
        
        <section id="mission" className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
            <MissionSection />
          </div>
        </section>
        
        <section id="urgent-needs" className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Urgent Needs</h2>
            <UrgentNeedsSection />
          </div>
        </section>
        
        <section id="featured-cats" className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Cats</h2>
            <FeaturedCatsSection />
          </div>
        </section>
        
        <section id="testimonials" className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
            <TestimonialsSection />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Index;
