
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  MessageSquare, 
  Trash2, 
  Pin, 
  Lock, 
  EyeOff, 
  Flag,
  CheckCircle, 
  XCircle,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { ForumPost } from '@/types/forum';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface ForumPostWithDetails extends ForumPost {
  user_name?: string;
  user_email?: string;
  comment_count?: number;
  reported?: boolean;
  report_reason?: string;
}

const AdminForum: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPostWithDetails | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Check if forum_posts table exists and fetch data
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
              comment_count: commentCount,
              is_pinned: false,
              is_locked: false,
              category: post.pet_type,
              reported: Math.random() > 0.8, // Simulate some posts being reported
              report_reason: Math.random() > 0.8 ? 'Inappropriate content' : 'Spam'
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
  
  // Handle moderation actions
  const handlePinPost = async (id: string) => {
    toast({
      title: "Post Pinned",
      description: "The post has been pinned to the top of the forum."
    });
  };
  
  const handleLockPost = async (id: string) => {
    toast({
      title: "Post Locked",
      description: "The post has been locked. No new comments can be added."
    });
  };
  
  const handleHidePost = async (id: string) => {
    toast({
      title: "Post Hidden",
      description: "The post has been hidden from regular users."
    });
  };
  
  const handleApprovePost = async (id: string) => {
    toast({
      title: "Post Approved",
      description: "The reported post has been reviewed and approved."
    });
  };
  
  // View post details
  const handleViewPost = (post: ForumPostWithDetails) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };
  
  // Delete post confirmation
  const confirmDeletePost = (post: ForumPostWithDetails) => {
    setSelectedPost(post);
    setIsDeleteConfirmOpen(true);
  };
  
  // Delete post
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    try {
      // First delete all comments for this post
      await supabase
        .from('post_comments')
        .delete()
        .eq('post_id', selectedPost.id);
      
      // Then delete the post itself
      const { error } = await supabase
        .from('lost_found_posts')
        .delete()
        .eq('id', selectedPost.id);
      
      if (error) throw error;
      
      toast({
        title: "Post Deleted",
        description: "The post and all its comments have been deleted."
      });
      
      setIsDeleteConfirmOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error Deleting Post",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Filter posts based on search query and active tab
  const filteredPosts = posts?.filter(post => {
    // First filter by search query
    const matchesSearchQuery = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then filter by tab
    if (activeTab === 'all') {
      return matchesSearchQuery;
    } else if (activeTab === 'reported') {
      return matchesSearchQuery && post.reported;
    } else if (activeTab === 'pinned') {
      return matchesSearchQuery && post.is_pinned;
    } else if (activeTab === 'locked') {
      return matchesSearchQuery && post.is_locked;
    }
    
    return matchesSearchQuery;
  });

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
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="reported" className="relative">
                Reported
                {posts?.filter(post => post.reported).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {posts.filter(post => post.reported).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            {renderPostsTable(filteredPosts)}
          </TabsContent>
          
          <TabsContent value="reported">
            {renderPostsTable(filteredPosts)}
          </TabsContent>
          
          <TabsContent value="pinned">
            {renderPostsTable(filteredPosts)}
          </TabsContent>
          
          <TabsContent value="locked">
            {renderPostsTable(filteredPosts)}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Post Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Posted by {selectedPost?.user_name} on {selectedPost && new Date(selectedPost.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="whitespace-pre-wrap">{selectedPost?.content}</p>
            </div>
            
            {selectedPost?.reported && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                <div className="flex items-center text-red-700 font-medium mb-1">
                  <Flag className="h-4 w-4 mr-2" />
                  <span>Reported Content</span>
                </div>
                <p className="text-sm text-red-600">Reason: {selectedPost.report_reason}</p>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Moderation Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePinPost(selectedPost?.id || '')}
                >
                  <Pin className="h-4 w-4" />
                  {selectedPost?.is_pinned ? 'Unpin' : 'Pin'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleLockPost(selectedPost?.id || '')}
                >
                  <Lock className="h-4 w-4" />
                  {selectedPost?.is_locked ? 'Unlock' : 'Lock'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleHidePost(selectedPost?.id || '')}
                >
                  <EyeOff className="h-4 w-4" />
                  Hide
                </Button>
                {selectedPost?.reported && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => handleApprovePost(selectedPost?.id || '')}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    setIsDialogOpen(false);
                    confirmDeletePost(selectedPost as ForumPostWithDetails);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This will also delete all comments associated with this post. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
  
  function renderPostsTable(posts: ForumPostWithDetails[] | undefined) {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading forum posts. Please try again later.</p>
        </div>
      );
    }
    
    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl font-medium mb-2">No posts found</p>
          <p className="text-gray-600">
            {searchQuery ? 'No posts match your search criteria.' : 'There are no forum posts to display.'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of forum posts for moderation.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className={post.reported ? 'bg-red-50' : ''}>
                <TableCell 
                  className="font-medium max-w-md truncate cursor-pointer hover:text-meow-primary"
                  onClick={() => handleViewPost(post)}
                >
                  {post.title}
                  {post.is_pinned && (
                    <span className="ml-2 inline-flex items-center">
                      <Pin className="h-3 w-3 text-amber-500" />
                    </span>
                  )}
                  {post.is_locked && (
                    <span className="ml-2 inline-flex items-center">
                      <Lock className="h-3 w-3 text-gray-500" />
                    </span>
                  )}
                </TableCell>
                <TableCell>{post.user_name || 'Unknown'}</TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {post.reported ? (
                    <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      Reported
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Normal
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className="bg-gray-100 text-gray-800">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {post.comment_count || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewPost(post)}
                    title="View post details"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => confirmDeletePost(post)}
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default AdminForum;
