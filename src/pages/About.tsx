
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import { TeamMember } from '@/types/team';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import TeamMemberCard from '@/components/TeamMemberCard';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeading from '@/components/ui/SectionHeading';

const About = () => {
  // Fetch team members from Supabase
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const getSupabaseClient() = getSupabaseClient();
      const { data, error } = await getSupabaseClient()
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
  
  // Current date for content freshness
  const currentDate = new Date().toISOString();

  // Structured data for About page
  const aboutPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Meow Rescue",
    "description": "Learn about Meow Rescue's mission to save and improve the lives of cats in need.",
    "url": "https://meowrescue.org/about",
    "dateModified": currentDate,
    "publisher": {
      "@type": "Organization",
      "name": "Meow Rescue",
      "logo": {
        "@type": "ImageObject",
        "url": "https://meowrescue.org/images/meow-rescue-logo.jpg",
        "width": "512",
        "height": "512"
      }
    }
  };

  return (
    <Layout>
      <SEO 
        title="About Us | Meow Rescue" 
        description="Learn about Meow Rescue's mission to save and improve the lives of cats in need." 
        modifiedTime={currentDate}
        structuredData={aboutPageStructuredData}
        url="/about"
        keywords="cat rescue mission, cat adoption mission, animal shelter about us, Pasco County cat rescue mission, Florida animal rescue organization"
      />
      
      <PageHeader
        title="About Meow Rescue"
        subtitle="Our mission, our story, and our vision"
      />
      
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1595433707802-6b2626ef1c91"
              alt="Founder with rescued cat"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              width="600"
              height="400"
              loading="eager"
            />
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-meow-primary mb-4">Our Founder's Story</h2>
            <p className="text-gray-700 mb-4 text-base md:text-lg">
              Patrick has had a deep connection with animals since childhood, often feeling a special ability to understand them when others couldn't. After years in IT, he decided to follow his true passion for animal welfare—realizing this brings genuine happiness and allows him to use his unique gift.
            </p>
            <p className="text-gray-700 mb-4 text-base md:text-lg">
              His long-term dream is to open a dedicated animal sanctuary for all kinds of animals in need. While skilled in IT, Patrick acknowledges the learning curve in running a rescue operation but is committed to his dream despite the challenges.
            </p>
            <p className="text-gray-700 mb-4 text-base md:text-lg">
              The catalyst for Meow Rescue came when Patrick moved to Pasco County (near Moon Lake) about three years ago and observed a significant stray cat population. Cats in distress—injured, starving—began appearing at his home, seemingly sensing it was a safe place.
            </p>
            <p className="text-gray-700 text-base md:text-lg">
              What started as personally funding vet care and feeding for these animals has now formalized into "Meow Rescue," as Patrick seeks community support to continue and expand this vital work.
            </p>
          </div>
        </div>
        
        <hr className="section-divider mb-16" />
        
        <section>
          <SectionHeading 
            title="Our Mission" 
            subtitle="Saving lives, one meow at a time" 
            centered={true}
          />
          <div className="max-w-3xl mx-auto text-center text-lg text-gray-700 leading-relaxed">
            <p>
              Our mission is to provide a safe haven for abandoned, neglected, and abused cats.
              We strive to find loving forever homes for each cat in our care, ensuring they live happy and healthy lives.
              Through community outreach and education, we aim to promote responsible pet ownership and reduce cat overpopulation.
            </p>
          </div>
        </section>
        
        <hr className="section-divider my-16" />
        
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
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default About;
