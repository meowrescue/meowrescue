import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { AspectRatio } from '@/components/ui/aspect-ratio';
import getSupabaseClient from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import { Calendar, ChevronRight, Clock, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: posts, isLoading, isError, refetch: refetchBlogPosts } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('is_featured', { ascending: false })
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

  useEffect(() => {
    const subscription = supabase
      .channel('blog-posts-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, (payload) => {
        console.log('Blog post update received:', payload);
        refetchBlogPosts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetchBlogPosts]);

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

  // Function to estimate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
  };

  // Only get featured post if it exists and is marked as featured
  const featuredPost = posts?.find(post => post.is_featured) || null;
  
  // Get all posts if no featured post, or all posts except featured
  const regularPosts = featuredPost 
    ? posts?.filter(post => post.id !== featuredPost.id) || []
    : posts || [];

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

      {/* Hero Section with PageHeader */}
      <PageHeader
        title="Our Stories"
        subtitle="Tales of rescue, recovery, and finding forever homes"
      />

      {/* Content Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-meow-primary focus:ring focus:ring-meow-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

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
              {/* Featured Post - Only show if there is an explicitly featured post */}
              {featuredPost && (
                <div className="mb-20">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Story</h2>
                    <div className="h-1 bg-meow-secondary w-20 mt-3"></div>
                  </div>
                  <div 
                    className="grid md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl overflow-hidden shadow-md transition-transform hover:shadow-lg cursor-pointer"
                    onClick={() => handleCardClick(featuredPost.slug)}
                  >
                    <div className="relative h-64 md:h-full">
                      {featuredPost.featured_image_url ? (
                        <img 
                          src={featuredPost.featured_image_url} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-meow-primary/20 flex items-center justify-center">
                          <span className="text-meow-primary font-semibold">Meow Rescue</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        <time dateTime={featuredPost.published_at}>
                          {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{calculateReadingTime(featuredPost.content)} min read</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-meow-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-6 flex-grow">
                        {featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>
                      <Button className="self-start group bg-meow-primary hover:bg-meow-primary/90 flex items-center">
                        Read Full Story
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{featuredPost ? 'All Stories' : 'Stories'}</h2>
                  <div className="h-1 bg-meow-secondary w-20 mt-3"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post: any) => (
                    <Card 
                      key={post.id} 
                      className="h-full flex flex-col overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleCardClick(post.slug)}
                    >
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          {post.featured_image_url ? (
                            <img 
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full bg-meow-primary/10 flex items-center justify-center">
                              <span className="text-meow-primary">Meow Rescue</span>
                            </div>
                          )}
                        </AspectRatio>
                      </div>
                      <CardHeader className="p-6 pb-3">
                        <CardTitle className="text-xl text-gray-900 line-clamp-2 group-hover:text-meow-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <time dateTime={post.published_at}>
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{calculateReadingTime(post.content)} min read</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-6 py-2 flex-grow">
                        <p className="text-gray-600 line-clamp-3">
                          {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter className="p-6 pt-3">
                        <Button variant="ghost" className="group text-meow-primary hover:text-meow-primary/90 hover:bg-meow-primary/5 p-0" asChild>
                          <div className="flex items-center">
                            Continue Reading 
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No posts yet</h3>
                <p className="text-gray-600 mb-8">We're working on creating amazing content. Check back soon for updates!</p>
                <Button onClick={() => navigate('/')} className="bg-meow-primary hover:bg-meow-primary/90">
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
