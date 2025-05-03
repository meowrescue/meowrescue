import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './Admin';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, Trash2, Plus, Search, ExternalLink, Eye, EyeOff, FileText } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminBlog: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Fetch blog posts
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Delete post
  const deletePost = async () => {
    if (!postToDelete) return;

    try {
      const { error } = await getSupabaseClient()
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete);

      if (error) throw error;

      // Log activity
      await getSupabaseClient().from('activity_logs').insert({
        user_id: (await getSupabaseClient().auth.getUser()).data.user?.id,
        activity_type: 'Delete',
        description: 'Deleted blog post',
      });

      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      
      // Close dialog first, then refetch to prevent UI locking
      setIsDeleteAlertOpen(false);
      setPostToDelete(null);
      
      // Use setTimeout to ensure the dialog is properly closed before refetching
      setTimeout(() => {
        refetch();
      }, 100);
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete blog post',
        variant: 'destructive',
      });
      setIsDeleteAlertOpen(false);
      setPostToDelete(null);
    }
  };

  // Toggle post publish status
  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    const now = new Date().toISOString();
    const updateData = {
      is_published: !currentStatus,
      published_at: !currentStatus ? now : null,
      updated_at: now,
    };

    try {
      const { error } = await getSupabaseClient()
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update publish status',
        variant: 'destructive',
      });
    }
  };

  // Add function to toggle featured status
  const toggleFeaturedStatus = async (id: string, currentStatus: boolean) => {
    try {
      // If setting as featured, first unset any existing featured post
      if (!currentStatus) {
        await getSupabaseClient()
          .from('blog_posts')
          .update({ is_featured: false })
          .eq('is_featured', true);
      }

      const { error } = await getSupabaseClient()
        .from('blog_posts')
        .update({ 
          is_featured: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Post ${!currentStatus ? 'set as' : 'removed from'} featured`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update featured status',
        variant: 'destructive',
      });
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts ? posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.meta_description && post.meta_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.keywords && post.keywords.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // SEO status function
  const getSeoStatus = (post: any) => {
    let score = 0;
    if (post.meta_description && post.meta_description.length > 50) score += 1;
    if (post.keywords && post.keywords.length > 10) score += 1;
    if (post.featured_image_url) score += 1;
    
    if (score === 3) return { label: 'Good', color: 'bg-green-500 hover:bg-green-600' };
    if (score === 2) return { label: 'Fair', color: 'bg-yellow-500 hover:bg-yellow-600' };
    return { label: 'Poor', color: 'bg-red-500 hover:bg-red-600' };
  };

  return (
    <AdminLayout title="Blog Management">
      <SEO title="Blog Management | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Blog Posts</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
                aria-label="Search blog posts"
              />
            </div>
            <Button onClick={() => navigate('/admin/blog/new')} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" /> Create New Post
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>All blog posts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SEO</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => {
                  const seoStatus = getSeoStatus(post);
                  return (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {post.is_featured && (
                            <Badge className="bg-meow-secondary">Featured</Badge>
                          )}
                          {post.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={post.is_published ? "default" : "outline"} 
                          className={post.is_published ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="default" 
                          className={seoStatus.color}
                        >
                          {seoStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {post.is_published && post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString() + ' (Created)'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => togglePublishStatus(post.id, post.is_published)}
                          >
                            {post.is_published ? 
                              <><EyeOff className="h-4 w-4 mr-2" aria-hidden="true" /> Unpublish</> : 
                              <><Eye className="h-4 w-4 mr-2" aria-hidden="true" /> Publish</>
                            }
                          </Button>
                          
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Button variant="ghost" size="sm">
                              <PenSquare className="h-4 w-4 mr-2" aria-hidden="true" /> Edit
                            </Button>
                          </Link>
                          
                          {post.is_published && (
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" /> View
                              </Button>
                            </Link>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setPostToDelete(post.id);
                              setIsDeleteAlertOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Blog Posts</h2>
              <p className="text-gray-500 mb-8">
                There are no blog posts in the database yet. Create your first post to get started.
              </p>
              <Button onClick={() => navigate('/admin/blog/new')}>
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" /> Create Your First Post
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              and all of its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlog;
