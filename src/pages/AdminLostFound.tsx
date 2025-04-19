import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LostFoundPost } from '@/types/supabase';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import SEO from '@/components/SEO';

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
        const { data: postsData, error: postsError } = await supabase
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
          const { data: profilesData, error: profilesError } = await supabase
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

  // Archive post mutation
  const archivePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
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
      const { data, error: fetchError } = await supabase
        .from('lost_found_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Use 'lost' as the default status when restoring from archived
      const originalStatus = 'lost';
      
      // Update the post
      const { error } = await supabase
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
      const { error } = await supabase
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

  // Show post details
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

  // Counts by status
  const lostCount = posts?.filter(p => p.status === 'lost').length || 0;
  const foundCount = posts?.filter(p => p.status === 'found').length || 0;
  const reunitedCount = posts?.filter(p => p.status === 'reunited').length || 0;
  const archivedCount = posts?.filter(p => p.status === 'archived').length || 0;

  return (
    <AdminLayout title="Lost & Found">
      <SEO title="Lost & Found | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Lost & Found Posts</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className={`cursor-pointer ${statusFilter === 'all' ? 'bg-slate-100' : ''}`} onClick={() => setStatusFilter('all')}>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">All Posts</p>
                <p className="text-2xl font-bold">{posts?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer ${statusFilter === 'lost' ? 'bg-slate-100' : ''}`} onClick={() => setStatusFilter('lost')}>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Lost</p>
                <p className="text-2xl font-bold">{lostCount}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer ${statusFilter === 'found' ? 'bg-slate-100' : ''}`} onClick={() => setStatusFilter('found')}>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Found</p>
                <p className="text-2xl font-bold">{foundCount}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer ${statusFilter === 'archived' ? 'bg-slate-100' : ''}`} onClick={() => setStatusFilter('archived')}>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Archived</p>
                <p className="text-2xl font-bold">{archivedCount}</p>
              </div>
            </CardContent>
          </Card>
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pet Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date Posted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-500">
                            by {post.profiles?.first_name} {post.profiles?.last_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            post.status === 'lost' ? 'destructive' :
                            post.status === 'found' ? 'outline' :
                            post.status === 'reunited' ? 'default' :
                            'secondary'
                          }>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.pet_type}</TableCell>
                        <TableCell>{post.location}</TableCell>
                        <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              title="View Details"
                              onClick={() => handleViewPost(post)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            
                            {post.status !== 'archived' ? (
                              <Button
                                variant="outline"
                                size="icon"
                                title="Archive Post"
                                onClick={() => handleArchive(post.id)}
                              >
                                <ArchiveIcon className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="icon"
                                title="Restore Post"
                                onClick={() => handleRestore(post.id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="destructive"
                              size="icon"
                              title="Delete Post"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
      
      {/* Post Details Dialog */}
      {selectedPost && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
              <DialogDescription>
                Posted by {selectedPost.profiles?.first_name} {selectedPost.profiles?.last_name} on {new Date(selectedPost.created_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Post Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge variant={
                      selectedPost.status === 'lost' ? 'destructive' :
                      selectedPost.status === 'found' ? 'outline' :
                      selectedPost.status === 'reunited' ? 'default' :
                      'secondary'
                    } className="mt-1">
                      {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pet Type</p>
                    <p>{selectedPost.pet_type}</p>
                  </div>
                  
                  {selectedPost.pet_name && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pet Name</p>
                      <p>{selectedPost.pet_name}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p>{selectedPost.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date Occurred</p>
                    <p>{new Date(selectedPost.date_occurred).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Information</p>
                    <p>{selectedPost.contact_info || selectedPost.profiles?.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="whitespace-pre-wrap">{selectedPost.description}</p>
                
                {selectedPost.photos_urls && selectedPost.photos_urls.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Photos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedPost.photos_urls.map((url, index) => (
                        <img 
                          key={index} 
                          src={url} 
                          alt={`${selectedPost.pet_type} ${index + 1}`} 
                          className="rounded-md w-full h-40 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedPost.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                
                {selectedPost.status !== 'archived' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleArchive(selectedPost.id)}
                  >
                    <ArchiveIcon className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleRestore(selectedPost.id)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restore
                  </Button>
                )}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminLostFound;
