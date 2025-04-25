
import React from 'react';
import { Card } from '@/components/ui/card';
import { PawPrint, Package, Users, Clock } from 'lucide-react';

const DonationImpact = () => {
  return (
    <Card className="border-0 shadow-lg h-full">
      <div className="bg-meow-primary/5 p-6">
        <h3 className="text-xl text-meow-primary flex items-center gap-2">
          Why Donate?
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <ImpactItem
            icon={<PawPrint className="h-5 w-5 text-meow-primary" />}
            title="Medical Care"
            description="Your donations help cover veterinary expenses, medications, and preventative care."
          />
          
          <ImpactItem
            icon={<Package className="h-5 w-5 text-meow-primary" />}
            title="Food and Supplies"
            description="We need quality food, litter, and essential supplies for our cats."
          />
          
          <ImpactItem
            icon={<Users className="h-5 w-5 text-meow-primary" />}
            title="Staff and Facilities"
            description="Your donations help maintain our facilities and support our dedicated staff."
          />
          
          <ImpactItem
            icon={<Clock className="h-5 w-5 text-meow-primary" />}
            title="Sustained Support"
            description="Monthly donations help us plan and budget for the future."
          />
        </div>
      </div>
    </Card>
  );
};

interface ImpactItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ImpactItem: React.FC<ImpactItemProps> = ({ icon, title, description }) => (
  <div className="flex items-start">
    <div className="bg-meow-primary/10 p-2 rounded-full mr-3">
      {icon}
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default DonationImpact;
