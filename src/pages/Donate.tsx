
import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import DonationForm from '@/components/Donate/DonationForm';
import DonationImpact from '@/components/Donate/DonationImpact';
import OtherWaysToSupport from '@/components/Donate/OtherWaysToSupport';
import { useScrollToElement } from '@/hooks/use-scroll';

const Donate: React.FC = () => {
  useScrollToElement();

  return (
    <Layout>
      <SEO 
        title="Donate | Meow Rescue" 
        description="Support our mission to help cats in need by making a donation to Meow Rescue." 
      />
      
      <PageHeader
        title="Support Our Mission"
        subtitle="Your donation helps us rescue, rehabilitate, and rehome cats in need"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-3">
            <DonationForm />
          </div>
          
          <div className="lg:col-span-2">
            <DonationImpact />
          </div>
        </div>
        
        <OtherWaysToSupport />
      </div>
    </Layout>
  );
};

export default Donate;
