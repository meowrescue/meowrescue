
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import SectionHeading from './ui/SectionHeading';
import SuccessStoryCard from './SuccessStoryCard';

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['homepage-testimonials'],
    queryFn: async () => {
      const getSupabaseClient() = getSupabaseClient();
      const { data, error } = await getSupabaseClient()
        .from('success_stories')
        .select('*, cats(name)')
        .eq('show_on_homepage', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Success Stories" 
            subtitle="Hear from our happy adopters"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg min-h-[265px] shadow-md" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Success Stories" 
          subtitle="Hear from our happy adopters"
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map(story => (
            <SuccessStoryCard
              key={story.id}
              photo_url={story.photo_url}
              cat_name={story.cats?.name}
              adoption_date={story.adoption_date}
              story_text={story.story_text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
