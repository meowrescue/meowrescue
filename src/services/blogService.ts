
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  keywords?: string;
  featured_image_url?: string;
  author_id?: string;
  author_name?: string;
  is_published: boolean;
  is_featured?: boolean;
  published_at: string;
  created_at: string;
  updated_at?: string;
}

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Failed to fetch blog posts:', error.message);
    return [];
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error.message);
    return null;
  }
};
