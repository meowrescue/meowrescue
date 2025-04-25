
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ResourceLinkProps {
  title: string;
  url: string;
  description: string;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({ title, url, description }) => (
  <li className="bg-gray-50 p-4 rounded">
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="font-medium text-meow-primary hover:underline flex items-center"
    >
      {title}
      <ExternalLink size={14} className="ml-1" />
    </a>
    <p className="text-gray-700 text-sm mt-1">{description}</p>
  </li>
);

const LocalResources = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-meow-primary mb-6 h-[32px] flex items-center">
        Local Resources
      </h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-meow-primary">Veterinary Care</h3>
          <ul className="space-y-4">
            <ResourceLink 
              title="Pasco County Animal Services"
              url="https://www.pascocountyfl.net/228/Animal-Services"
              description="Low-cost spay/neuter services, vaccinations, and microchipping for Pasco County residents."
            />
            <ResourceLink 
              title="SPCA Suncoast"
              url="https://spcasuncoast.org/"
              description="Low-cost spay/neuter clinic and wellness services in New Port Richey."
            />
            <ResourceLink 
              title="Humane Society of Pasco County"
              url="https://www.humanesocietyofpasco.org/"
              description="Low-cost veterinary services and assistance programs."
            />
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-meow-primary">Pet Food Assistance</h3>
          <ul className="space-y-4">
            <ResourceLink 
              title="Pasco County Pet Food Pantry"
              url="#"
              description="Monthly pet food distribution for eligible Pasco County residents."
            />
            <ResourceLink 
              title="Metropolitan Ministries"
              url="https://www.metromin.org/"
              description="Offers pet food assistance as part of their family support programs."
            />
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-meow-primary">Lost & Found Pets</h3>
          <ul className="space-y-4">
            <ResourceLink 
              title="Pasco County Lost & Found Pets (Facebook Group)"
              url="https://www.facebook.com/groups/pascolostfoundpets/"
              description="Community group for reporting and finding lost pets in Pasco County."
            />
            <ResourceLink 
              title="Pasco County Animal Services - Lost Pets"
              url="https://www.pascocountyfl.net/228/Animal-Services"
              description="Check the county shelter for lost pets and report found animals."
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocalResources;
