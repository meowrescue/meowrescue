
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types/team';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import TeamMemberCard from '@/components/TeamMemberCard';
import SectionHeading from '@/components/ui/SectionHeading';

const About = () => {
  // Fetch team members from Supabase
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role, role_title, bio, show_in_team, created_at')
        .eq('show_in_team', true)
        .order('created_at');
        
      if (error) {
        console.error("Error fetching team members:", error);
        return [] as TeamMember[];
      }
      
      return (data || []) as unknown as TeamMember[];
    }
  });

  return (
    <Layout>
      <SEO title="About Us | Meow Rescue" description="Learn about Meow Rescue, our mission, and the team behind our cat rescue efforts." />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">About Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meow Rescue is dedicated to rescuing, rehabilitating, and rehoming cats in need.
            Learn more about our mission and the team that makes it all possible.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-16">
        <section>
          <SectionHeading 
            title="Our Mission" 
            subtitle="Saving lives, one meow at a time" 
            centered={true}
          />
          <div className="max-w-3xl mx-auto text-center text-lg text-gray-700 leading-relaxed">
            Our mission is to provide a safe haven for abandoned, neglected, and abused cats.
            We strive to find loving forever homes for each cat in our care, ensuring they live happy and healthy lives.
            Through community outreach and education, we aim to promote responsible pet ownership and reduce cat overpopulation.
          </div>
        </section>
        
        <hr className="section-divider" />
        
        <section>
          <SectionHeading 
            title="Our Founder's Story" 
            subtitle="How Meow Rescue came to be" 
            centered={true}
          />
          <div className="max-w-3xl mx-auto text-center text-lg text-gray-700 leading-relaxed">
            <p className="mb-4">
              Meow Rescue began in 2015 when our founder, Patrick, discovered a colony of feral cats living 
              behind his office building. Concerned for their welfare, he began feeding them daily and 
              sought help from local animal rescue organizations.
            </p>
            <p className="mb-4">
              When he learned that most shelters were overcrowded and couldn't accommodate more cats, 
              Patrick decided to take matters into his own hands. He educated himself on TNR (Trap-Neuter-Return) 
              techniques and began working with a local veterinarian to provide medical care for the colony.
            </p>
            <p>
              What started as a compassionate effort to help a few cats quickly evolved into a full-fledged rescue operation. 
              In 2017, Patrick officially established Meow Rescue as a non-profit organization. Today, we've rescued over 
              500 cats and continue to grow our network of volunteers, foster homes, and supporters who share our passion 
              for feline welfare.
            </p>
          </div>
        </section>
        
        <hr className="section-divider" />
        
        <section>
          <SectionHeading 
            title="Meet the Team" 
            subtitle="The dedicated individuals behind Meow Rescue" 
            centered={true}
          />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default About;
