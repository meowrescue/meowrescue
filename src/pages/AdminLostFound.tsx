
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LostFoundPost } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  Trash2, 
  Archive, 
  FileEdit,
  ArchiveRestore
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SEO from '@/components/SEO';

const AdminLostFound = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('active');

  // Fetch all lost and found posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['admin-lost-found', activeTab],
    queryFn: async () => {
      try {
        console.log(`Fetching lost and found posts with status ${activeTab === 'archived' ? 'archived' : 'not archived'}`);
        let query = supabase
          .from('lost_found_posts')
          .select('*');
          
        if (activeTab === 'archived') {
          query = query.eq('status', 'archived');
        } else {
          query = query.neq('status', 'archived');
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching lost and found posts:", error);
          throw error;
        }
        
        console.log(`Fetched ${data?.length} lost and found posts`);
        return data || [];
      } catch (err) {
        console.error("Error in lost and found posts query:", err);
        return [];
      }
    },
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lost_found_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found'] });
      toast({
        title: "Post Deleted",
        description: "The post has been permanently deleted.",
      });
      setConfirmDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Archive post mutation
  const archivePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lost_found_posts')
        .update({ status: 'archived' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found'] });
      toast({
        title: "Post Archived",
        description: "The post has been archived.",
      });
      setConfirmArchiveId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to archive post: ${error.message}`,
        variant: "destructive",
      });
    },
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found'] });
      toast({
        title: "Post Restored",
        description: "The post has been restored from the archive.",
      });
      setConfirmRestoreId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to restore post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter posts based on search term
  const filteredPosts = posts?.filter((post) => {
    const searchString = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchString) ||
      post.description.toLowerCase().includes(searchString) ||
      post.location.toLowerCase().includes(searchString) ||
      post.pet_type.toLowerCase().includes(searchString) ||
      (post.pet_name && post.pet_name.toLowerCase().includes(searchString))
    );
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lost':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Lost</span>;
      case 'found':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Found</span>;
      case 'reunited':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Reunited</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Archived</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <AdminLayout title="Lost & Found">
      <SEO title="Manage Lost & Found Posts | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary mb-4 sm:mb-0">Lost & Found Posts</h1>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/lost-found/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error loading lost and found posts.</p>
                <Button
                  variant="outline"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-lost-found'] })}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredPosts?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No active lost and found posts found.</p>
                <Button asChild className="mt-4">
                  <Link to="/lost-found/new">Create a new post</Link>
                </Button>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pet Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Date Posted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <Link to={`/lost-found/${post.id}`} className="text-meow-primary hover:underline">
                            {post.title}
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>{post.pet_type}</TableCell>
                        <TableCell>{post.location}</TableCell>
                        <TableCell>{formatDate(post.date_occurred)}</TableCell>
                        <TableCell>{formatDate(post.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/lost-found/${post.id}`}>
                                  <Search className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/lost-found/edit/${post.id}`}>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setConfirmArchiveId(post.id)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setConfirmDeleteId(post.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="archived" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error loading archived posts.</p>
                <Button
                  variant="outline"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-lost-found'] })}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredPosts?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No archived posts found.</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Original Status</TableHead>
                      <TableHead>Pet Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Date Posted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <Link to={`/lost-found/${post.id}`} className="text-meow-primary hover:underline">
                            {post.title}
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>{post.pet_type}</TableCell>
                        <TableCell>{post.location}</TableCell>
                        <TableCell>{formatDate(post.date_occurred)}</TableCell>
                        <TableCell>{formatDate(post.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/lost-found/${post.id}`}>
                                  <Search className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setConfirmRestoreId(post.id)}>
                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setConfirmDeleteId(post.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the post from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => confirmDeleteId && deletePost.mutate(confirmDeleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Archive Confirmation Dialog */}
        <AlertDialog open={!!confirmArchiveId} onOpenChange={() => setConfirmArchiveId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive this post?</AlertDialogTitle>
              <AlertDialogDescription>
                This will archive the post so it no longer appears on the public site. You can restore it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => confirmArchiveId && archivePost.mutate(confirmArchiveId)}
              >
                Archive
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Restore Confirmation Dialog */}
        <AlertDialog open={!!confirmRestoreId} onOpenChange={() => setConfirmRestoreId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restore this post?</AlertDialogTitle>
              <AlertDialogDescription>
                This will restore the post and make it visible on the public site again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => confirmRestoreId && restorePost.mutate(confirmRestoreId)}
              >
                Restore
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminLostFound;
