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
        const supabase = getSupabaseClient();
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
    const supabase = getSupabaseClient();
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
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                id="blog-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-meow-primary focus:border-meow-primary"
                placeholder="Search blog posts..."
                required
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-meow-primary hover:bg-meow-primary/90 focus:ring-4 focus:outline-none focus:ring-meow-primary/50 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full flex flex-col overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    </AspectRatio>
                  </div>
                  <CardHeader className="p-6 pb-3">
                    <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded"></div>
                  </CardHeader>
                  <CardContent className="px-6 py-2 flex-grow">
                    <div className="h-4 bg-gray-100 animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded"></div>
                  </CardContent>
                  <CardFooter className="p-6 pt-3">
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16 bg-red-50 rounded-2xl">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-red-800 mb-4">Something went wrong</h3>
                <p className="text-red-600 mb-8">We couldn't load the blog posts. Please try again later.</p>
                <Button onClick={() => refetchBlogPosts()} className="bg-meow-primary hover:bg-meow-primary/90">
                  Try Again
                </Button>
              </div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <SectionHeading>Featured Story</SectionHeading>
                  <Card 
                    className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer"
                    onClick={() => handleCardClick(featuredPost.slug)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <AspectRatio ratio={16/9} className="h-full">
                          {featuredPost.featured_image_url ? (
                            <img 
                              src={featuredPost.featured_image_url}
                              alt={featuredPost.title}
                              className="w-full h-full object-cover"
                              loading="eager"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full bg-meow-primary/10 flex items-center justify-center">
                              <span className="text-meow-primary">Meow Rescue</span>
                            </div>
                          )}
                        </AspectRatio>
                      </div>
                      <div className="flex flex-col justify-center p-6">
                        <CardTitle className="text-2xl md:text-3xl text-gray-900 mb-4 line-clamp-2">
                          {featuredPost.title}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm mb-4">
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
                        </CardDescription>
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                        <Button 
                          variant="default" 
                          className="w-fit group bg-meow-primary hover:bg-meow-primary/90"
                        >
                          Read Full Story
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Regular Posts */}
              <div className="mb-8">
                <div className="mb-8">
                  <SectionHeading>Latest Stories</SectionHeading>
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
