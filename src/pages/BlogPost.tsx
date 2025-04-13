
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import NotFound from './NotFound';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
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
  
  // If post not found or not published
  if (!isLoading && !post && !error) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <SEO 
        title={post ? `${post.title} | Meow Rescue Blog` : 'Blog Post | Meow Rescue'} 
        description={post ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') : 'Read our latest blog post'}
        ogImage={post?.featured_image_url}
      />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading blog post. Please try again later.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/blog')}>
              Return to Blog
            </Button>
          </div>
        </div>
      ) : post ? (
        <>
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="w-full h-80 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${post.featured_image_url})` }}>
              <div className="bg-black/60 w-full h-full flex items-center justify-center">
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{post.title}</h1>
                  <div className="flex items-center justify-center text-white/80">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="container mx-auto px-4 py-16">
            {/* Navigation */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
            
            {/* Post without featured image gets title here */}
            {!post.featured_image_url && (
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
            
            {/* Post Content */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
            
            {/* Share */}
            <div className="mt-8 flex justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </Layout>
  );
};

export default BlogPost;
