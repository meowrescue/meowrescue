
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PencilLine, MessageCircle, Pin, Lock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateForDisplay } from '@/utils/lostFoundUtils';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

// Define types
interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  profile_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  _count?: {
    comments: number;
  }
}

const ForumPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();

  // Fetch forum posts
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['forumPosts', category],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          profiles(first_name, last_name, email)
        `);
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get comment counts for each post
      const postsWithCommentCounts = await Promise.all(data.map(async (post) => {
        const { count, error: countError } = await supabase
          .from('forum_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        return {
          ...post,
          _count: {
            comments: count || 0
          }
        };
      }));
      
      return postsWithCommentCounts as ForumPost[];
    }
  });

  // Filter posts based on search query
  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in or create an account to create forum posts.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/forum' } });
      return;
    }
    
    navigate('/forum/new');
  };

  return (
    <Layout>
      <SEO 
        title="Community Forum | Meow Rescue"
        description="Join the Meow Rescue community forum to connect with other cat lovers, ask questions, and share your experiences."
      />
      
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-meow-primary mb-2">Community Forum</h1>
            <p className="text-gray-600">
              Connect with our community of cat lovers, share stories, and ask questions.
            </p>
          </div>
          
          <Button onClick={handleCreatePost} className="flex items-center gap-2" variant="meow">
            <PencilLine size={16} />
            Create New Post
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
              <h3 className="font-medium text-lg mb-4">Categories</h3>
              
              <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="w-full">
                <TabsList className="grid grid-cols-1 mb-4">
                  <TabsTrigger value="all">All Topics</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-1">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="adoption">Adoption</TabsTrigger>
                  <TabsTrigger value="cat-care">Cat Care</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="mb-6">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading forum posts. Please try again later.</p>
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:border-meow-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/forum/${post.id}`)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-meow-primary/90 hover:bg-meow-primary">{post.category}</Badge>
                            {post.is_pinned && <Badge variant="outline" className="flex items-center gap-1"><Pin size={12} />Pinned</Badge>}
                            {post.is_locked && <Badge variant="outline" className="flex items-center gap-1"><Lock size={12} />Locked</Badge>}
                          </div>
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 line-clamp-2">{post.content}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>
                          {post.profiles?.first_name || post.profiles?.email?.split('@')[0] || 'Anonymous'}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{formatDateForDisplay(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{post._count?.comments || 0} comments</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'No posts match your search criteria.' : 'Be the first to start a discussion!'}
                </p>
                <Button onClick={handleCreatePost} variant="meow">Create New Post</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForumPage;
