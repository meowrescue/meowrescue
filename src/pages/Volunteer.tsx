
import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import VolunteerOpportunities from '@/components/Volunteer/VolunteerOpportunities';
import VolunteerBenefits from '@/components/Volunteer/VolunteerBenefits';
import VolunteerRequirements from '@/components/Volunteer/VolunteerRequirements';
import VolunteerFAQ from '@/components/Volunteer/VolunteerFAQ';
import VolunteerCTA from '@/components/Volunteer/VolunteerCTA';

const Volunteer: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="Volunteer Opportunities | Meow Rescue" 
        description="Make a difference in the lives of cats in need by volunteering with Meow Rescue. Find various volunteer opportunities that match your skills and interests." 
      />
      
      <PageHeader
        title="Volunteer With Us"
        subtitle="Help us save more feline lives"
      />
      
      <div className="container mx-auto px-4 py-8 mt-2">
        <div className="prose lg:prose-lg mx-auto mb-10 text-center max-w-3xl">
          <p className="text-lg text-gray-700">
            Volunteers are the heart of our organization. Whether you can give a few hours a week or a few hours a month, your time and talents can make a meaningful difference in the lives of cats in need.
          </p>
        </div>
        
        <VolunteerOpportunities />
        <VolunteerBenefits />
        <VolunteerRequirements />
        <VolunteerCTA />
        <VolunteerFAQ />
      </div>
    </Layout>
  );
};

export default Volunteer;
