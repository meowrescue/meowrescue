import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { LostFoundPost } from '@/types/getSupabaseClient()';
import StatsCard from '@/components/admin/lost-found/StatsCard';
import PostDetailsDialog from '@/components/admin/lost-found/PostDetailsDialog';
import PostsTable from '@/components/admin/lost-found/PostsTable';
import SearchAndFilter from '@/components/admin/lost-found/SearchAndFilter';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, ArchiveIcon, RotateCcw, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminLostFound = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<LostFoundPost | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch lost and found posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['admin-lost-found-posts'],
    queryFn: async () => {
      try {
        // First fetch the posts
        const { data: postsData, error: postsError } = await getSupabaseClient()
          .from('lost_found_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        
        // Then fetch profile information separately
        const posts = postsData as LostFoundPost[];
        
        // Get unique profile IDs
        const profileIds = [...new Set(posts.map(post => post.profile_id))];
        
        // Fetch profiles if there are any profile IDs
        let profilesMap: Record<string, any> = {};
        
        if (profileIds.length > 0) {
          const { data: profilesData, error: profilesError } = await getSupabaseClient()
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', profileIds);
            
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          } else if (profilesData) {
            // Create a map of profile ID to profile data
            profilesMap = profilesData.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>);
          }
        }
        
        // Add profile information to posts
        const postsWithProfiles = posts.map(post => ({
          ...post,
          profiles: profilesMap[post.profile_id] || null
        }));
        
        return postsWithProfiles;
      } catch (err: any) {
        console.error('Error fetching lost and found posts:', err);
        return [] as LostFoundPost[];
      }
    }
  });

  // Archive post mutation
  const archivePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('lost_found_posts')
        .update({ status: 'archived' })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "Post Archived",
        description: "The post has been archived successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found-posts'] });
      
      // If we archived the currently selected post, close the detail view
      if (selectedPost?.id === id) {
        setViewDialogOpen(false);
        setSelectedPost(null);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to archive post",
        variant: "destructive"
      });
    }
  });

  // Restore post mutation
  const restorePost = useMutation({
    mutationFn: async (id: string) => {
      // First get the post to determine the original status
      const { data, error: fetchError } = await getSupabaseClient()
        .from('lost_found_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Use 'lost' as the default status when restoring from archived
      const originalStatus = 'lost';
      
      // Update the post
      const { error } = await getSupabaseClient()
        .from('lost_found_posts')
        .update({ status: originalStatus })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "Post Restored",
        description: "The post has been restored successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found-posts'] });
      
      // If we restored the currently selected post, update the detail view
      if (selectedPost?.id === id) {
        const updatedPost = posts?.find(p => p.id === id);
        if (updatedPost) {
          setSelectedPost({ ...updatedPost, status: 'lost' });
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to restore post",
        variant: "destructive"
      });
    }
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('lost_found_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "Post Deleted",
        description: "The post has been permanently deleted."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found-posts'] });
      
      // If we deleted the currently selected post, close the detail view
      if (selectedPost?.id === id) {
        setViewDialogOpen(false);
        setSelectedPost(null);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive"
      });
    }
  });

  // Filter posts
  const filteredPosts = posts?.filter(post => 
    (statusFilter === 'all' || post.status === statusFilter) &&
    (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.pet_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.pet_name && post.pet_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // Counts by status
  const lostCount = posts?.filter(p => p.status === 'lost').length || 0;
  const foundCount = posts?.filter(p => p.status === 'found').length || 0;
  const reunitedCount = posts?.filter(p => p.status === 'reunited').length || 0;
  const archivedCount = posts?.filter(p => p.status === 'archived').length || 0;

  // Event handlers
  const handleViewPost = (post: LostFoundPost) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  // Handle archive action
  const handleArchive = (id: string) => {
    if (window.confirm("Are you sure you want to archive this post?")) {
      archivePost.mutate(id);
    }
  };

  // Handle restore action
  const handleRestore = (id: string) => {
    if (window.confirm("Are you sure you want to restore this post?")) {
      restorePost.mutate(id);
    }
  };

  // Handle delete action
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this post? This action cannot be undone.")) {
      deletePost.mutate(id);
    }
  };

  return (
    <AdminLayout title="Lost & Found">
      <SEO title="Lost & Found | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Lost & Found Posts</h1>
          <SearchAndFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="All Posts"
            count={posts?.length || 0}
            isSelected={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />
          <StatsCard
            title="Lost"
            count={lostCount}
            isSelected={statusFilter === 'lost'}
            onClick={() => setStatusFilter('lost')}
          />
          <StatsCard
            title="Found"
            count={foundCount}
            isSelected={statusFilter === 'found'}
            onClick={() => setStatusFilter('found')}
          />
          <StatsCard
            title="Archived"
            count={archivedCount}
            isSelected={statusFilter === 'archived'}
            onClick={() => setStatusFilter('archived')}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter === 'all' ? 'All Posts' : 
               statusFilter === 'lost' ? 'Lost Pets' : 
               statusFilter === 'found' ? 'Found Pets' : 
               statusFilter === 'reunited' ? 'Reunited Pets' : 
               'Archived Posts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading posts</p>
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <PostsTable
                posts={filteredPosts}
                onView={handleViewPost}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDelete}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-700">
                  {searchQuery ? 'No posts match your search.' : 'No posts found for this status.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedPost && (
        <PostDetailsDialog
          post={selectedPost}
          isOpen={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
      )}
    </AdminLayout>
  );
};

export default AdminLostFound;
