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
import { Link, useNavigate } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
      }
    },
    retry: 2,
    retryDelay: 1000
  });

  const handleCardClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  // Create structured data for BlogPosting
  const blogListStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts ? posts.map((post: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "BlogPosting",
          "headline": post.title,
          "url": `https://meowrescue.org/blog/${post.slug}`,
          "datePublished": post.published_at,
          "dateModified": post.updated_at || post.published_at,
          "image": post.featured_image_url || "https://meowrescue.org/images/meow-rescue-logo.jpg",
          "author": {
            "@type": "Organization",
            "name": "Meow Rescue"
          }
        }
      })) : []
    }
  };

  return (
    <Layout>
      <SEO 
        title="Blog | Meow Rescue" 
        description="Read the latest news, updates, and stories from Meow Rescue - a home-based cat rescue in Pasco County, Florida." 
        type="blog"
        canonicalUrl="/blog"
        structuredData={blogListStructuredData}
        keywords="cat rescue blog, cat adoption stories, rescue cats, feline care, cat foster stories, meow rescue"
      />

      {/* Hero Section */}
      <div className="bg-meow-primary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay up-to-date with the latest news, stories, and cat care tips from Meow Rescue
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div id="posts" className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500 mb-4">We encountered an error loading the blog posts.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : posts && posts.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Card 
                  key={post.id} 
                  className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(post.slug)}
                >
                  {post.featured_image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        loading="lazy"
                        decoding="async"
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
                      <span>
                        Read More 
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
