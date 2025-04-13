
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';

const AdminBlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch post data when editing
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing
  });
  
  // Set form values when post data is loaded
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setSlug(post.slug || '');
      setIsPublished(post.is_published || false);
      setFeaturedImageUrl(post.featured_image_url || '');
    }
  }, [post]);
  
  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'));
    }
  }, [title, isEditing]);
  
  // Upload image to storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(`posts/${fileName}`, file);
    
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(`posts/${fileName}`);
    
    return publicUrlData.publicUrl;
  };
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Post Created",
        description: "The blog post has been successfully created."
      });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Post",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, postData }: { id: string; postData: any }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Post Updated",
        description: "The blog post has been successfully updated."
      });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Post",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!title || !content || !slug) {
        throw new Error("Title, content, and slug are required");
      }
      
      // Upload featured image if selected
      let imageUrl = featuredImageUrl;
      if (featuredImage) {
        imageUrl = await uploadImage(featuredImage);
      }
      
      const postData = {
        title,
        content,
        slug,
        is_published: isPublished,
        featured_image_url: imageUrl,
        published_at: isPublished ? new Date().toISOString() : null,
        author_profile_id: user?.id
      };
      
      if (isEditing && id) {
        updatePostMutation.mutate({ id, postData });
      } else {
        createPostMutation.mutate(postData);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };
  
  return (
    <AdminLayout title={isEditing ? "Edit Blog Post" : "New Blog Post"}>
      <SEO title={`${isEditing ? "Edit" : "New"} Blog Post | Meow Rescue Admin`} />
      
      <div className="container mx-auto py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/blog')} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Posts
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isEditing ? `Edit Post: ${post?.title}` : 'Create New Blog Post'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPostLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-meow-primary" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Blog post title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input 
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      placeholder="url-friendly-slug"
                    />
                    <p className="text-xs text-gray-500">
                      The slug is the URL-friendly version of the title.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <div className="mt-2">
                      <Label 
                        htmlFor="featuredImage" 
                        className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-meow-primary focus:outline-none"
                      >
                        <span className="flex items-center space-x-2">
                          <Upload className="w-6 h-6 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            {featuredImageUrl || featuredImage ? "Change featured image" : "Upload featured image"}
                          </span>
                        </span>
                        <input 
                          id="featuredImage" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Label>
                    </div>
                    
                    {/* Image preview */}
                    {(featuredImageUrl || featuredImage) && (
                      <div className="mt-4">
                        <div className="relative w-full h-40">
                          <img 
                            src={featuredImage ? URL.createObjectURL(featuredImage) : featuredImageUrl} 
                            alt="Featured image preview" 
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea 
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      placeholder="Write your blog post content here..."
                      className="min-h-[300px]"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Switch 
                      id="published" 
                      checked={isPublished}
                      onCheckedChange={setIsPublished} 
                    />
                    <Label htmlFor="published" className="font-medium cursor-pointer">
                      Publish immediately
                    </Label>
                    <p className="text-sm text-gray-500 ml-2">
                      {isPublished ? "This post will be visible to the public." : "This post will be saved as a draft."}
                    </p>
                  </div>
                </div>
                
                <CardFooter className="flex justify-end gap-4 px-0 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/blog')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Post' : 'Create Post'}
                  </Button>
                </CardFooter>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogForm;
