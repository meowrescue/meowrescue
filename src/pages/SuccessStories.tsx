import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@integrations/supabase';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/ui/SectionHeading";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const SuccessStories: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(15);
  const queryClient = useQueryClient();

  const { data: stories, isLoading, refetch } = useQuery({
    queryKey: ["successStories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*, cats(name, photos_urls)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    const subscription = supabase
      .channel('success-stories-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'success_stories' }, (payload) => {
        console.log('Success story update received:', payload);
        refetch();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  const visibleStories = stories?.slice(0, visibleCount) || [];
  const hasMoreStories = stories && visibleCount < stories.length;

  return (
    <Layout>
      <SEO
        title="Success Stories | Meow Rescue"
        description="Read heartwarming stories of cats who found their forever homes through Meow Rescue."
      />

      <PageHeader
        title="Success Stories"
        subtitle="Heartwarming tales of cats who found their forever homes"
      />

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg min-h-[265px] shadow-md"
              />
            ))}
          </div>
        ) : visibleStories && visibleStories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleStories.map((story) => (
                <SuccessStoryCard
                  key={story.id}
                  photo_url={
                    story.photo_url ||
                    (story.cats?.photos_urls && story.cats.photos_urls[0])
                  }
                  cat_name={story.cats?.name}
                  adoption_date={story.adoption_date}
                  story_text={story.story_text}
                />
              ))}
            </div>

            {hasMoreStories && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="border-meow-primary text-meow-primary hover:bg-meow-primary/10 flex items-center gap-2"
                >
                  Load More Stories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No success stories found yet. Check back soon for heartwarming adoption tales!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SuccessStories;
