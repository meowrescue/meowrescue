
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import SEO from '@/components/SEO';
import { getBlogPost, BlogPost as BlogPostType } from '@/services/blogService';

interface BlogPostProps {
  // No props needed
}

const BlogPost: React.FC<BlogPostProps> = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch the blog post using the slug
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPost(slug!),
    enabled: !!slug, // Ensure slug is available before running the query
  });

  // Function to estimate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
  };

  // Create structured data for BlogPosting
  const blogPostStructuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "url": `https://meowrescue.org/blog/${post.slug}`,
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "image": post.featured_image_url || "https://meowrescue.org/images/meow-rescue-logo.jpg",
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
    "description": post.content.replace(/<[^>]*>/g, '').substring(0, 200) + "..."
  } : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-600">Failed to load blog post.</p>
            <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
            <p className="text-gray-600">The requested blog post could not be found.</p>
            <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${post.title} | Meow Rescue Blog`}
        description={post.content.replace(/<[^>]*>/g, '').substring(0, 200) + "..."}
        ogType="article"
        ogImage={post.featured_image_url || "https://meowrescue.org/images/meow-rescue-logo.jpg"}
        canonicalUrl={`/blog/${post.slug}`}
        publishedTime={post.published_at}
        modifiedTime={post.updated_at || post.published_at}
        structuredData={blogPostStructuredData}
        keywords="cat rescue blog, cat adoption stories, rescue cats, feline care, cat foster stories, meow rescue"
      />

      <div className="container mx-auto mt-8 px-4 md:px-0">
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <SectionHeading title={post.title} centered={true} />
            <div className="flex items-center justify-center text-gray-500 mt-2">
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
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg mx-auto">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Back to Blog Button */}
          <div className="mt-12 text-center">
            <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
