
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from './Admin';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@integrations/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Image, Save, Search } from 'lucide-react';
import { slugify } from '@/utils/stringUtils';

// Define form schema
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters' }),
  featured_image_url: z.string().optional(),
  is_published: z.boolean().default(false),
  meta_description: z.string().max(160, { message: 'Meta description should be under 160 characters' }).optional(),
  keywords: z.string().optional(),
  canonical_url: z.string().optional(),
  is_featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AdminBlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditMode = Boolean(id);
  const [activeTab, setActiveTab] = useState('content');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      featured_image_url: '',
      is_published: false,
      meta_description: '',
      keywords: '',
      canonical_url: '',
      is_featured: false,
    },
  });

  // Load post data if in edit mode
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Convert keywords array to string for the form
          const keywordsString = Array.isArray(data.keywords) 
            ? data.keywords.join(', ')
            : data.keywords || '';

          form.reset({
            title: data.title,
            slug: data.slug,
            content: data.content,
            featured_image_url: data.featured_image_url || '',
            is_published: data.is_published,
            meta_description: data.meta_description || '',
            keywords: keywordsString,
            canonical_url: data.canonical_url || '',
            is_featured: data.is_featured,
          });

          if (data.featured_image_url) {
            setImagePreview(data.featured_image_url);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog post data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, form, toast]);

  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const newSlug = slugify(title);
      form.setValue('slug', newSlug);
    }
  };

  // Generate meta description from content
  const generateMetaDescription = () => {
    const content = form.getValues('content');
    if (content) {
      const plainText = content.replace(/<[^>]*>/g, '');
      const trimmed = plainText.substring(0, 157) + (plainText.length > 157 ? '...' : '');
      form.setValue('meta_description', trimmed);
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let imageUrl = values.featured_image_url;

      // If there's a new image, upload it
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('blog-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const now = new Date().toISOString();

      // Convert keywords string to array for database
      const keywordsArray = values.keywords
        ? values.keywords.split(',').map(keyword => keyword.trim()).filter(Boolean)
        : null;

      // Before inserting/updating, unset any existing featured post if this one is being set as featured
      if (values.is_featured) {
        await supabase
          .from('blog_posts')
          .update({ is_featured: false })
          .eq('is_featured', true);
      }
      
      // Prepare post data
      const postData = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        featured_image_url: imageUrl,
        is_published: values.is_published,
        published_at: values.is_published ? (isEditMode ? undefined : now) : null,
        author_profile_id: user?.id,
        updated_at: now,
        meta_description: values.meta_description,
        keywords: keywordsArray,
        canonical_url: values.canonical_url,
        is_featured: values.is_featured,
      };

      // Update or create post
      let result;
      if (isEditMode) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: now }]);
      }

      if (result.error) throw result.error;

      toast({
        title: 'Success',
        description: isEditMode 
          ? 'Blog post updated successfully' 
          : 'Blog post created successfully',
      });

      // Redirect back to blog list
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title={isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/admin/blog')} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Posts
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Post Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter post title" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Only auto-generate slug if it's empty or a new post
                                  if (!form.getValues('slug') || !isEditMode) {
                                    setTimeout(generateSlug, 300);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input placeholder="url-friendly-slug" {...field} />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={generateSlug}
                                  className="whitespace-nowrap"
                                >
                                  Generate
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Used in the URL: /blog/your-slug
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="featured_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Featured Image</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <Input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleImageChange}
                                  className="cursor-pointer"
                                />
                                {imagePreview ? (
                                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                      src={imagePreview} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md border-2 border-dashed border-gray-300">
                                    <div className="text-center">
                                      <Image className="w-10 h-10 mx-auto text-gray-400" />
                                      <p className="mt-2 text-sm text-gray-500">No image selected</p>
                                    </div>
                                  </div>
                                )}
                                {field.value && !imageFile && (
                                  <Input 
                                    type="hidden" 
                                    {...field} 
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload an image to feature at the top of your post
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Published Status</FormLabel>
                              <FormDescription>
                                Toggle to make this post publicly visible
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Featured Post</FormLabel>
                              <FormDescription>
                                Toggle to make this post appear as the featured story on the blog page
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-1 h-full">
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your post content here..."
                              className="h-[400px] resize-none"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                // Generate meta description if it's empty
                                if (!form.getValues('meta_description')) {
                                  setTimeout(generateMetaDescription, 1000);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="seo" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO & Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="meta_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Textarea 
                                  placeholder="Brief description for search engines (max 160 characters)"
                                  className="resize-none"
                                  {...field}
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={generateMetaDescription}
                                  className="whitespace-nowrap"
                                >
                                  Generate
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              {(field.value?.length || 0)}/160 characters - Used in search engine results
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="cat rescue, adoption, feline care (comma separated)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Keywords help with SEO (separate with commas)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="canonical_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canonical URL (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/original-content"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Only needed if this content exists elsewhere and you want to avoid duplicate content issues
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/blog')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading && (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  )}
                  <Save className="h-4 w-4 mr-1" />
                  {isEditMode ? 'Update' : 'Create'} Post
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminBlogForm;
