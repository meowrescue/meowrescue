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
        .select('id, first_name, last_name, avatar_url, role, role_title, bio, show_in_team')
        .eq('show_in_team', true)
        .order('created_at');
        
      if (error) {
        console.error("Error fetching team members:", error);
        return [] as TeamMember[];
      }
      
      // Explicitly cast to TeamMember[] to resolve type issues
      return (data || []) as TeamMember[];
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
