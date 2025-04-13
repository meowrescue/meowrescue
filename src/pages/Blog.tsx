
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';

const Blog: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <SEO 
        title="Blog | Meow Rescue" 
        description="Read the latest news, updates, and stories from Meow Rescue." 
      />

      {/* Hero Section */}
      <div className="bg-meow-primary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Blog"
            subtitle="Stay up-to-date with the latest news, stories, and cat care tips from Meow Rescue"
            className="text-center"
          />
        </div>
      </div>

      {/* Blog Posts */}
      <div id="posts" className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Card key={post.id} className="h-full flex flex-col">
                {post.featured_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-meow-primary line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group" asChild>
                    <Link to={`/blog/${post.slug}`} className="flex items-center">
                      Read More 
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No blog posts found. Check back soon for updates!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
