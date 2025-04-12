
import React from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { ExternalLink } from 'lucide-react';

const Resources: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Cat Care Resources" 
          subtitle="Helpful information for cat owners and caregivers"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-meow-primary mb-6">Local Resources</h2>
            
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
          
          <div>
            <h2 className="text-2xl font-bold text-meow-primary mb-6">Cat Care Guides</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-meow-primary">New Cat Owner Guides</h3>
                <ul className="space-y-4">
                  <ResourceLink 
                    title="Bringing Your New Cat Home"
                    url="https://www.aspca.org/pet-care/cat-care/general-cat-care"
                    description="Tips for helping your new cat adjust to your home."
                  />
                  <ResourceLink 
                    title="Essential Supplies for Your New Cat"
                    url="https://www.humanesociety.org/resources/shopping-list-new-cat-owners"
                    description="A shopping list of essentials for new cat owners."
                  />
                  <ResourceLink 
                    title="Introducing Cats to Other Pets"
                    url="https://www.jacksongalaxy.com/blog/the-dos-and-donts-of-introducing-cats/"
                    description="How to safely introduce your new cat to existing pets."
                  />
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-meow-primary">Health & Wellness</h3>
                <ul className="space-y-4">
                  <ResourceLink 
                    title="Common Cat Health Issues"
                    url="https://www.avma.org/resources/pet-owners/petcare/cat-care"
                    description="Information on common health issues in cats and when to see a vet."
                  />
                  <ResourceLink 
                    title="Cat Nutrition Guide"
                    url="https://www.cornell.edu/video/feeding-your-cat"
                    description="Cornell University Feline Health Center's guide to proper cat nutrition."
                  />
                  <ResourceLink 
                    title="Preventive Care Timeline"
                    url="https://www.aaha.org/your-pet/pet-owner-education/aaha-guidelines-for-pet-owners/life-stage-guidelines/"
                    description="Recommended schedule for vaccinations, check-ups, and preventive care."
                  />
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-meow-primary">Behavior & Training</h3>
                <ul className="space-y-4">
                  <ResourceLink 
                    title="Solving Litter Box Issues"
                    url="https://www.jacksongalaxy.com/blog/litter-box-avoidance-101/"
                    description="Troubleshooting common litter box problems."
                  />
                  <ResourceLink 
                    title="Understanding Cat Body Language"
                    url="https://www.humanesociety.org/resources/cat-chat-understanding-feline-body-language"
                    description="Guide to understanding what your cat is trying to tell you."
                  />
                  <ResourceLink 
                    title="Solving Scratching Problems"
                    url="https://www.humanesociety.org/resources/cats-destructive-scratching"
                    description="How to redirect scratching behavior to appropriate surfaces."
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Emergency Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-meow-primary">Emergency Veterinary Clinics</h3>
              <ul className="space-y-4">
                <li className="bg-white p-4 rounded shadow-sm">
                  <strong className="block text-meow-primary">BluePearl Pet Hospital</strong>
                  <p className="text-sm text-gray-600">3000 Busch Lake Blvd, Tampa, FL 33614</p>
                  <p className="text-sm text-gray-600">(813) 933-8944</p>
                  <p className="text-sm text-gray-600">Open 24/7</p>
                </li>
                <li className="bg-white p-4 rounded shadow-sm">
                  <strong className="block text-meow-primary">Animal Emergency of Pasco</strong>
                  <p className="text-sm text-gray-600">7121 State Road 54, New Port Richey, FL 34653</p>
                  <p className="text-sm text-gray-600">(727) 849-9999</p>
                  <p className="text-sm text-gray-600">Evenings, weekends, and holidays</p>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-meow-primary">Poison Control</h3>
              <ul className="space-y-4">
                <li className="bg-white p-4 rounded shadow-sm">
                  <strong className="block text-meow-primary">ASPCA Animal Poison Control Center</strong>
                  <p className="text-sm text-gray-600">(888) 426-4435</p>
                  <p className="text-sm text-gray-600">24/7 Emergency Hotline (fee may apply)</p>
                </li>
                <li className="bg-white p-4 rounded shadow-sm">
                  <strong className="block text-meow-primary">Pet Poison Helpline</strong>
                  <p className="text-sm text-gray-600">(855) 764-7661</p>
                  <p className="text-sm text-gray-600">24/7 Emergency Hotline (fee may apply)</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-gray-700 max-w-3xl mx-auto">
            Have a resource suggestion that would benefit our community? Please let us know!
          </p>
          <a 
            href="/contact" 
            className="inline-block mt-4 bg-meow-primary hover:bg-meow-primary/90 text-white px-6 py-2 rounded transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </Layout>
  );
};

interface ResourceLinkProps {
  title: string;
  url: string;
  description: string;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({ title, url, description }) => {
  return (
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
};

export default Resources;
