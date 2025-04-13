
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Calendar, Heart } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const SuccessStories: React.FC = () => {
  const { data: stories, isLoading } = useQuery({
    queryKey: ['successStories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*, cats(name, photos_urls)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <Layout>
      <SEO 
        title="Success Stories | Meow Rescue" 
        description="Read heartwarming stories of cats who found their forever homes through Meow Rescue." 
      />

      <div className="bg-meow-primary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Success Stories"
            subtitle="Heartwarming tales of cats who found their forever homes"
            className="text-center"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story: any) => (
              <Card key={story.id} className="h-full flex flex-col">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={story.photo_url || (story.cats?.photos_urls && story.cats.photos_urls[0]) || '/placeholder.svg'}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-meow-primary">{story.title}</CardTitle>
                  {story.adoption_date && (
                    <CardDescription className="flex items-center text-sm mt-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Adopted on {new Date(story.adoption_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4">
                    {story.story_text}
                  </p>
                  <div className="flex items-center text-meow-primary">
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="text-sm">Happy in their forever home</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No success stories found yet. Check back soon for heartwarming adoption tales!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SuccessStories;
