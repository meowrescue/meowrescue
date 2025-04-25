
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

const CatCareGuides = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-meow-primary mb-6 h-[32px] flex items-center">
        Cat Care Guides
      </h2>
      
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
  );
};

export default CatCareGuides;
