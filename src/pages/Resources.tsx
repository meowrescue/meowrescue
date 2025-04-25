
import React from 'react';
import Layout from '../components/Layout';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import LocalResources from '@/components/Resources/LocalResources';
import CatCareGuides from '@/components/Resources/CatCareGuides';
import EmergencyResources from '@/components/Resources/EmergencyResources';
import { resourcePageStructuredData } from '@/components/Resources/resourcesStructuredData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Resources: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="Cat Care Resources | Meow Rescue" 
        description="Find helpful resources for cat owners including veterinary care, pet food assistance, new cat owner guides, and more."
        keywords="cat care, cat health, cat food, veterinary services, pet assistance, cat owner guide"
        canonicalUrl="/resources"
        structuredData={resourcePageStructuredData}
      />
      
      <PageHeader
        title="Cat Care Resources"
        subtitle="Helpful information for cat owners and caregivers"
      />
      
      <div className="container mx-auto px-4 py-8 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <LocalResources />
          <CatCareGuides />
        </div>
        
        <EmergencyResources />
        
        <div className="text-center mb-8">
          <p className="text-gray-700 max-w-3xl mx-auto mb-4">
            Have a resource suggestion that would benefit our community? Please let us know!
          </p>
          <Button 
            variant="meow" 
            asChild
          >
            <Link to="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
