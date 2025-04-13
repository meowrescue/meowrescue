
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, bio }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative pb-2/3 h-64">
        <img 
          src={image} 
          alt={name} 
          className="absolute h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-meow-primary font-medium mb-4">{role}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </CardContent>
    </Card>
  );
};

const TeamSection: React.FC = () => {
  // Team members data with more diverse placeholder images and updated roles
  const teamMembers = [
    {
      name: "Emily Johnson",
      role: "Executive Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Emily has been passionate about cat rescue for over 15 years. She founded Meow Rescue to create a safe haven for cats in need."
    },
    {
      name: "Michael Chen",
      role: "Veterinary Coordinator",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Michael oversees all medical care for our cats. With his veterinary background, he ensures every cat receives the best treatment."
    },
    {
      name: "Sophia Rodriguez",
      role: "Adoption Manager",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Sophia coordinates our adoption process, ensuring every cat finds their forever home with the perfect family match."
    },
    {
      name: "James Wilson",
      role: "Foster Program Coordinator",
      image: "https://images.unsplash.com/photo-1548449112-96a38a643324?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "James manages our network of foster families, providing support and resources to those who temporarily open their homes to cats."
    },
    {
      name: "Olivia Taylor",
      role: "Volunteer Coordinator",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Olivia recruits and trains our amazing volunteers. She ensures everyone has the skills needed to help our feline friends."
    },
    {
      name: "Marcus Greene",
      role: "Community Outreach",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Marcus coordinates community events and education programs, spreading awareness about cat welfare and responsible pet ownership."
    },
    {
      name: "Sarah Johnson",
      role: "Social Media Manager",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Sarah manages our online presence, sharing heartwarming stories about our cats and keeping our community updated on events."
    },
    {
      name: "David Park",
      role: "Fundraising Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "David develops creative fundraising campaigns to support our rescue efforts and ensure we can provide quality care to every cat."
    },
    {
      name: "Lisa Martinez",
      role: "Education Coordinator",
      image: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Lisa leads our educational programs, teaching the community about responsible pet ownership and the importance of spay/neuter."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-meow-primary mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team works tirelessly to ensure every cat in our care receives the love and 
            attention they deserve. Get to know the humans behind Meow Rescue.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
              bio={member.bio}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
