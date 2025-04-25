
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PawPrint, Store, Camera, Users, Brush, Heart } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

interface OpportunityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeCommitment: string;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  icon,
  title,
  description,
  timeCommitment,
}) => (
  <Card className="hover-card-effect bg-white">
    <CardContent className="p-6">
      <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm text-gray-500 italic">
        Time Commitment: {timeCommitment}
      </div>
    </CardContent>
  </Card>
);

const VolunteerOpportunities = () => {
  const opportunities = [
    {
      icon: <PawPrint className="h-6 w-6 text-meow-primary" />,
      title: "Cat Care",
      description: "Help with feeding, grooming, socialization, and enrichment activities for our resident cats.",
      timeCommitment: "2-4 hours weekly",
    },
    {
      icon: <Store className="h-6 w-6 text-meow-primary" />,
      title: "Adoption Events",
      description: "Assist with setting up, managing, and promoting our cats at adoption events throughout the community.",
      timeCommitment: "4-6 hours monthly",
    },
    {
      icon: <Camera className="h-6 w-6 text-meow-primary" />,
      title: "Photography",
      description: "Take high-quality photos of our cats for adoption profiles and social media promotion.",
      timeCommitment: "2-3 hours bi-weekly",
    },
    {
      icon: <Users className="h-6 w-6 text-meow-primary" />,
      title: "Social Media",
      description: "Help manage our social media accounts, create engaging content, and respond to inquiries.",
      timeCommitment: "2-5 hours weekly",
    },
    {
      icon: <Brush className="h-6 w-6 text-meow-primary" />,
      title: "Facility Maintenance",
      description: "Help with cleaning, organizing, laundry, and maintenance tasks at our adoption center.",
      timeCommitment: "2-4 hours weekly",
    },
    {
      icon: <Heart className="h-6 w-6 text-meow-primary" />,
      title: "Fundraising",
      description: "Assist with planning and executing fundraising events and campaigns to support our mission.",
      timeCommitment: "Varies by project",
    },
  ];

  return (
    <div className="mt-16">
      <SectionHeading
        title="Volunteer Opportunities"
        subtitle="Find the perfect role for your skills and interests"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
        {opportunities.map((opportunity, index) => (
          <OpportunityCard key={index} {...opportunity} />
        ))}
      </div>
    </div>
  );
};

export default VolunteerOpportunities;
