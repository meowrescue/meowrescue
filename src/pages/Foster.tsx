
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import { Cat } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';
import FosterBenefits from '@/components/Foster/FosterBenefits';
import FosterProvisions from '@/components/Foster/FosterProvisions';
import FosterRequirements from '@/components/Foster/FosterRequirements';

const Foster: React.FC = () => {
  return (
    <Layout>
      <SEO title="Foster Program | Meow Rescue" description="Become a foster parent for cats in need and help them find their forever homes. Learn about our foster program and apply today." />
      
      <PageHeader
        title="Become a Foster"
        subtitle="Open your heart and home to cats in need"
      />
      
      <div className="container mx-auto px-4 py-8 mt-2">
        <div className="prose lg:prose-lg mx-auto mb-10 text-center max-w-3xl">
          <p className="text-lg text-gray-700">
            As a foster parent, you provide temporary care for cats until they find their forever homes. Fostering is a rewarding way to help save lives without a permanent commitment.
          </p>
        </div>
        
        <FosterBenefits />
        <FosterProvisions />
        <FosterRequirements />
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-meow-primary/10 rounded-lg px-8 py-12">
            <div className="max-w-3xl mx-auto">
              <Cat className="h-16 w-16 text-meow-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Make a Difference?</h2>
              <p className="text-lg text-gray-700 mb-8">
                Join our amazing network of foster parents and help save more feline lives. The application process is simple, and our team is ready to answer any questions you may have.
              </p>
              <Link to="/foster/apply" onClick={scrollToTop}>
                <Button className="bg-meow-primary hover:bg-meow-primary/90 text-white px-8 py-6 text-lg">
                  Apply to Foster
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Foster;
