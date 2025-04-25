import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Calendar, ArrowLeft, Share2, Clock, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import NotFound from './NotFound';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }
      return data;
    }
  });

  // Fetch related posts when current post loads
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (post) {
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .neq('id', post.id)
          .limit(3);
        
        setRelatedPosts(data || []);
      }
    };

    if (post) {
      fetchRelatedPosts();
    }
  }, [post]);
  
  // If post not found or not published
  if (!isLoading && !post && !error) {
    return <NotFound />;
  }

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textLength = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(textLength / wordsPerMinute);
  };

  // Create structured data for the blog post
  const blogPostStructuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featured_image_url || "https://meowrescue.org/images/meow-rescue-logo.jpg",
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "author": {
      "@type": "Organization",
      "name": "Meow Rescue"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Meow Rescue",
      "logo": {
        "@type": "ImageObject",
        "url": "https://meowrescue.org/images/meow-rescue-logo.jpg"
      }
    },
    "description": post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://meowrescue.org/blog/${post.slug}`
    }
  } : null;

  // Handle social sharing
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Blog post';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
    }
  };
  
  return (
    <Layout>
      <SEO 
        title={post ? `${post.title} | Meow Rescue Blog` : 'Blog Post | Meow Rescue'} 
        description={post ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') : 'Read our latest blog post'}
        image={post?.featured_image_url}
        type="article"
        publishedTime={post?.published_at}
        modifiedTime={post?.updated_at || post?.published_at}
        canonicalUrl={post ? `/blog/${post.slug}` : undefined}
        structuredData={blogPostStructuredData}
        keywords={post?.keywords || "cat rescue, cat adoption, feline care, meow rescue"}
      />
      
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      ) : error ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-red-500 mb-4">Error loading blog post. Please try again later.</p>
            <Button variant="outline" onClick={() => navigate('/blog')}>
              Return to Blog
            </Button>
          </div>
        </div>
      ) : post ? (
        <>
          {/* Back to Blog Link - Floating */}
          <div className="fixed top-24 left-4 z-30 md:block hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm"
              onClick={() => navigate('/blog')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>

          {/* Social Share - Floating */}
          <div className="fixed top-36 left-4 z-30 space-y-2 md:flex hidden flex-col">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4 text-sky-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
              onClick={() => handleShare('email')}
            >
              <Mail className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Header */}
          <div className="relative bg-meow-primary/80">
            {post.featured_image_url && (
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-meow-primary/90 to-meow-primary/60 mix-blend-multiply z-10"></div>
                <img 
                  src={post.featured_image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
              {/* Mobile back button */}
              <div className="mb-6 md:hidden">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/blog')} 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </div>

              <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center items-center space-x-3 text-white/80 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <time dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{calculateReadingTime(post.content)} min read</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                {/* Mobile Social Share */}
                <div className="flex justify-center space-x-3 md:hidden">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white/20 hover:bg-white/30 border-white/30 rounded-full w-9 h-9 p-2"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-4 w-4 text-white" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white/20 hover:bg-white/30 border-white/30 rounded-full w-9 h-9 p-2"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-4 w-4 text-white" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white/20 hover:bg-white/30 border-white/30 rounded-full w-9 h-9 p-2"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="h-4 w-4 text-white" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white/20 hover:bg-white/30 border-white/30 rounded-full w-9 h-9 p-2"
                    onClick={() => handleShare('copy')}
                  >
                    <Share2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {/* Post Content */}
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <article 
                      className="prose prose-lg md:prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-a:text-meow-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </CardContent>
                </Card>
                
                {/* Tags if available */}
                {post.keywords && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-3">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.keywords.split(',').map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-sm text-gray-700">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-gray-50 py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-2xl font-bold mb-8 text-center">Continue Reading</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {relatedPosts.map((relatedPost) => (
                      <Card 
                        key={relatedPost.id}
                        className="h-full flex flex-col overflow-hidden border border-gray-100 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
                        onClick={() => {
                          navigate(`/blog/${relatedPost.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <div className="relative">
                          <AspectRatio ratio={16/9}>
                            {relatedPost.featured_image_url ? (
                              <img 
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-meow-primary/10 flex items-center justify-center">
                                <span className="text-meow-primary">Meow Rescue</span>
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            <time dateTime={relatedPost.published_at}>
                              {new Date(relatedPost.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                          </div>
                          <h3 className="text-lg font-semibold mb-3 line-clamp-2 hover:text-meow-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">
                            {relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                          </p>
                          <Button variant="ghost" className="justify-start p-0 h-auto text-meow-primary hover:text-meow-primary/90 hover:bg-transparent group">
                            Read Article <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center mt-12">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/blog')}
                      className="border-meow-primary text-meow-primary hover:bg-meow-primary/5"
                    >
                      View All Articles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </Layout>
  );
};

export default BlogPost;
