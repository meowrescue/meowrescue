import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './Admin';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, Trash2, MoreHorizontal, Plus, Search, ExternalLink, Eye, EyeOff } from 'lucide-react';

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
      const { data, error } = await supabase
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
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
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
      const { error } = await supabase
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

  // Filter posts based on search term
  const filteredPosts = posts ? posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <AdminLayout title="Blog Management">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10"
            />
          </div>
        </div>
        <Button onClick={() => navigate('/admin/blog/new')} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Create New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? "default" : "outline"} className={post.is_published ? "bg-green-500 hover:bg-green-600" : ""}>
                      {post.is_published ? 'Published' : 'Draft'}
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
                        size="icon"
                        onClick={() => togglePublishStatus(post.id, post.is_published)}
                        title={post.is_published ? "Unpublish" : "Publish"}
                      >
                        {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                        title="Edit post"
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      
                      {post.is_published && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="View on site"
                        >
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setPostToDelete(post.id);
                              setIsDeleteAlertOpen(true);
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No blog posts matching your search' : 'No blog posts yet'}
          </p>
          <Button onClick={() => navigate('/admin/blog/new')}>
            <Plus className="h-4 w-4 mr-2" /> Create Your First Post
          </Button>
        </div>
      )}

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
