
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { ForumPost } from '@/types/forum';

interface ForumPostWithDetails extends ForumPost {
  user_name?: string;
  user_email?: string;
  comment_count?: number;
}

const AdminForum: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if forum_posts table exists
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      try {
        // First check if the lost_found_posts table exists and use its data
        const { data: postsData, error: postsError } = await supabase
          .from('lost_found_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (postsError) throw postsError;
        
        // Get user info and comment counts for each post
        const postsWithDetails = await Promise.all(
          postsData.map(async (post) => {
            // Get user info
            const { data: userData } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', post.profile_id)
              .single();
            
            // Get comment count
            const { count: commentCount } = await supabase
              .from('post_comments')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id);
            
            return {
              ...post,
              title: post.title,
              content: post.description, // Use description as content
              user_name: userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : 'Unknown User',
              user_email: userData?.email || '',
              comment_count: commentCount
            } as ForumPostWithDetails;
          })
        );
        
        return postsWithDetails;
      } catch (error) {
        console.error("Error fetching forum posts:", error);
        return [] as ForumPostWithDetails[];
      }
    }
  });
  
  // Delete post
  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This will also delete all comments.")) return;
    
    try {
      // First delete all comments for this post
      await supabase
        .from('post_comments')
        .delete()
        .eq('post_id', id);
      
      // Then delete the post itself
      const { error } = await supabase
        .from('lost_found_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Post Deleted",
        description: "The post and all its comments have been deleted."
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error Deleting Post",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Filter posts based on search query
  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Forum">
      <SEO title="Forum | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Forum</h1>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading forum posts. Please try again later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all forum posts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-md truncate">{post.title}</TableCell>
                    <TableCell>{post.user_name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {post.comment_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPosts?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No forum posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminForum;
