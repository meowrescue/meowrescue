
import React from 'react';
import { Heart, Users, Clock, CalendarDays } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-meow-primary/10 p-3 rounded-full flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const VolunteerBenefits = () => {
  const benefits = [
    {
      icon: <Heart className="h-6 w-6 text-meow-primary" />,
      title: "Make a Real Impact",
      description: "Your time directly helps save and improve the lives of cats in need. Each hour you volunteer makes a difference.",
    },
    {
      icon: <Users className="h-6 w-6 text-meow-primary" />,
      title: "Join a Community",
      description: "Connect with fellow animal lovers and make friends who share your passion for helping cats.",
    },
    {
      icon: <Clock className="h-6 w-6 text-meow-primary" />,
      title: "Flexible Scheduling",
      description: "We work with your availability and understand that life gets busy. Volunteer when it works for you.",
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-meow-primary" />,
      title: "Special Events",
      description: "Volunteers are invited to exclusive events, training opportunities, and appreciation gatherings.",
    },
  ];

  return (
    <div className="mt-20 bg-white rounded-lg shadow-md p-8">
      <SectionHeading
        title="Benefits of Volunteering"
        subtitle="Why join our volunteer team?"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {benefits.map((benefit, index) => (
          <BenefitItem key={index} {...benefit} />
        ))}
      </div>
    </div>
  );
};

export default VolunteerBenefits;
