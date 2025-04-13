
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LostFoundPost } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const AdminLostFound: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Fetch lost and found posts
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-lost-found-posts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('lost_found_posts')
          .select('*, profiles(first_name, last_name, email)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as LostFoundPost[];
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

  // Filter posts based on search query
  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lost_found_posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Post Deleted",
        description: "The lost & found post has been deleted successfully."
      });
      
      refetch();
    } catch (err: any) {
      toast({
        title: "Error Deleting Post",
        description: err.message || "Failed to delete post",
        variant: "destructive"
      });
    }
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
            <Link to="/lost-found/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Post
              </Button>
            </Link>
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
                  <TableHead>Date Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={
                        post.status === 'lost' ? 'destructive' : 
                        post.status === 'found' ? 'default' : 
                        'outline'
                      }>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.location}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/lost-found/${post.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      <Link to={`/lost-found/edit/${post.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePost(post.id)}
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
                There are no lost and found posts in the database. You can add a new post using the button above.
              </p>
              <Link to="/lost-found/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLostFound;
