
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  featured_image?: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast({
        title: 'Error',
        description: 'Unable to load blog post details.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div>Blog post not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={post.title} 
        description={`Blog post by ${post.author}`} 
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-6">
          By {post.author} | {new Date(post.created_at).toLocaleDateString()}
        </div>
        {post.featured_image && (
          <img 
            src={post.featured_image} 
            alt={post.title} 
            className="w-full h-64 object-cover rounded-lg mb-6" 
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Layout>
  );
};

export default BlogDetail;
