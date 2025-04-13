
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LostFoundPost {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  pet_type: string;
  pet_name?: string;
  date_occurred: string;
  contact_info?: string;
  photos_urls?: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

const AdminLostFound: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);

  // Fetch lost and found posts
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-lost-found-posts', includeArchived],
    queryFn: async () => {
      try {
        // Build the query based on whether we want to include archived posts
        let query = supabase
          .from('lost_found_posts')
          .select('*, profiles:profile_id(email, first_name, last_name)');
          
        if (!includeArchived) {
          query = query.neq('status', 'archived');
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
          
        if (error) {
          console.error("Error fetching lost and found posts:", error);
          throw error;
        }
        
        console.log("Fetched lost and found posts:", data);
        return data as unknown as LostFoundPost[];
      } catch (err: any) {
        console.error("Error fetching lost and found posts:", err);
        toast({
          title: "Error fetching posts",
          description: err.message || "Failed to load lost & found posts",
          variant: "destructive"
        });
        return [] as LostFoundPost[];
      }
    }
  });

  // Force refetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filter posts based on search query
  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lost_found_posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
        description: "The lost & found post has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found-posts'] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Post",
        description: error.message || "Failed to delete post",
        variant: "destructive"
      });
      setDeleteId(null);
    }
  });

  // Archive mutation
  const archivePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lost_found_posts')
        .update({ status: 'archived' })
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Post Archived",
        description: "The lost & found post has been archived successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found-posts'] });
      setArchiveId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error Archiving Post",
        description: error.message || "Failed to archive post",
        variant: "destructive"
      });
      setArchiveId(null);
    }
  });

  // Restore mutation
  const restorePostMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get the original status first
      const { data, error: fetchError } = await supabase
        .from('lost_found_posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Restore to 'lost' or 'found' status based on original before archiving
      // Default to 'lost' if we can't determine
      const originalStatus = data.status === 'archived' 
        ? (data.pet_name ? 'lost' : 'found') // Simple heuristic: if it has a name, it was likely lost
        : data.status;
      
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
        description: "The post has been restored and is now visible on the public site."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lost-found-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Restoring Post",
        description: error.message || "Failed to restore post",
        variant: "destructive"
      });
    }
  });

  const handleDeletePost = () => {
    if (deleteId) {
      deletePostMutation.mutate(deleteId);
    }
  };

  const handleArchivePost = () => {
    if (archiveId) {
      archivePostMutation.mutate(archiveId);
    }
  };

  const handleRestorePost = (id: string) => {
    restorePostMutation.mutate(id);
  };

  return (
    <AdminLayout title="Lost & Found">
      <SEO title="Lost & Found | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Lost & Found</h1>
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
            <Button 
              variant="outline"
              onClick={() => {
                setIncludeArchived(!includeArchived);
                refetch();
              }}
            >
              {includeArchived ? "Hide Archived" : "Show Archived"}
            </Button>
            <Button onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading lost & found posts. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>All lost and found pet listings.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Posted By</TableHead>
                  <TableHead>Date Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className={post.status === 'archived' ? 'bg-gray-100' : ''}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={
                        post.status === 'lost' ? 'destructive' : 
                        post.status === 'found' ? 'default' : 
                        post.status === 'archived' ? 'outline' :
                        'secondary'
                      }>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.location}</TableCell>
                    <TableCell>
                      {post.profiles ? 
                        `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() || post.profiles.email : 
                        'Unknown User'}
                    </TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/lost-found/${post.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      {post.status !== 'archived' && (
                        <>
                          <Link to={`/lost-found/edit/${post.id}`}>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setArchiveId(post.id)}
                          >
                            Archive
                          </Button>
                        </>
                      )}
                      {post.status === 'archived' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRestorePost(post.id)}
                        >
                          Restore
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeleteId(post.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Lost & Found Posts</h2>
              <p className="text-gray-500 mb-8">
                {includeArchived 
                  ? "There are no lost and found posts in the database yet. Posts created on the public site will appear here for moderation."
                  : "There are no active lost and found posts. Try showing archived posts or check back later."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lost & found post from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={!!archiveId} onOpenChange={(open) => !open && setArchiveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this post?</AlertDialogTitle>
            <AlertDialogDescription>
              The post will be archived and no longer visible on the public site, but you can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchivePost}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminLostFound;
