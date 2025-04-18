
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import MinimalIndex from './MinimalIndex';
import SEO from '@/components/SEO';
import { Helmet } from 'react-helmet-async';

const Index: React.FC = () => {
  const [renderFull, setRenderFull] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    console.log('Index page mounted');
    setIsLoaded(true);
    
    try {
      // Test DOM rendering
      if (document && document.querySelector('body')) {
        console.log('DOM is accessible from Index component');
      }
    } catch (error) {
      console.error('DOM access error:', error);
      setRenderFull(false);
    }
  }, []);

  console.log('Index rendering, renderFull:', renderFull, 'isLoaded:', isLoaded);

  // If we're in fallback mode, render the minimal index
  if (!renderFull) {
    console.log('Rendering minimal index due to error:', renderError);
    return <MinimalIndex />;
  }

  return (
    <Layout>
      {/* Core SEO metadata */}
      <SEO 
        title="Meow Rescue - Saving Cat Lives in Pasco County, Florida" 
        description="We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need."
      />
      
      <Helmet>
        <link rel="canonical" href="https://meowrescue.org/" />
      </Helmet>
      
      {/* Main content - simplified for debugging */}
      <main className="bg-white pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8 text-meow-primary">Meow Rescue</h1>
          <p className="text-lg text-center max-w-2xl mx-auto mb-12">
            We're a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, 
            rehabilitating, and rehoming cats in need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p>Saving one cat at a time through rescue, rehabilitation, and rehoming.</p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
              <p>Adopt, foster, volunteer, or donate to help our cause.</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Index;
