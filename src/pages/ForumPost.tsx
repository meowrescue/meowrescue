
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PencilLine, Pin, Lock, User, ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
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
}

interface ForumComment {
  id: string;
  post_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

const ForumPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  // Fetch forum post
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['forumPost', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles(first_name, last_name, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ForumPost;
    },
    enabled: !!id
  });

  // Fetch comments for this post
  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ['forumComments', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          *,
          profiles(first_name, last_name, email)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ForumComment[];
    },
    enabled: !!id
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('You must be logged in to comment');
      if (!id) throw new Error('Post ID is required');
      if (!content.trim()) throw new Error('Comment cannot be empty');
      
      const { data, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: id,
          profile_id: user.id,
          content: content.trim()
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['forumComments', id] });
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Comment",
        description: error.message || "Failed to post your comment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in or create an account to comment.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/forum/${id}` } });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    createCommentMutation.mutate(newComment);
  };

  const canUserAddComment = () => {
    return user && (!post?.is_locked || user.id === post?.profile_id);
  };

  const formatUserName = (profileData: any) => {
    if (profileData?.first_name) {
      return profileData.first_name + (profileData.last_name ? ` ${profileData.last_name}` : '');
    }
    return profileData?.email?.split('@')[0] || 'Anonymous';
  };

  const isPostAuthor = user?.id === post?.profile_id;

  if (postLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      </Layout>
    );
  }

  if (postError || !post) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
            <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/forum')} variant="meow">
              Back to Forum
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${post.title} | Forum | Meow Rescue`}
        description={post.content.substring(0, 160)}
      />
      
      <div className="container mx-auto py-12 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/forum')} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Forum
        </Button>
        
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-meow-primary/90 hover:bg-meow-primary">{post.category}</Badge>
              {post.is_pinned && <Badge variant="outline" className="flex items-center gap-1"><Pin size={12} />Pinned</Badge>}
              {post.is_locked && <Badge variant="outline" className="flex items-center gap-1"><Lock size={12} />Locked</Badge>}
            </div>
            <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <User size={14} className="mr-1" />
              <span className="mr-2">
                {formatUserName(post.profiles)}
              </span>
              <span className="mr-2">•</span>
              <span>{formatDateForDisplay(post.created_at)}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="whitespace-pre-line">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div></div>
            {isPostAuthor && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate(`/forum/edit/${post.id}`)}
              >
                <PencilLine size={16} />
                Edit Post
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={20} />
            <h2 className="text-xl font-bold">
              Comments {comments ? `(${comments.length})` : ''}
            </h2>
          </div>
          
          {commentsLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : commentsError ? (
            <div className="text-center py-6">
              <p className="text-red-500">Error loading comments. Please try again later.</p>
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={14} className="mr-1" />
                      <span className="mr-2">
                        {formatUserName(comment.profiles)}
                      </span>
                      <span className="mr-2">•</span>
                      <span>{formatDateForDisplay(comment.created_at)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="text-center py-8">
                <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {post.is_locked && !isPostAuthor ? (
          <Card className="bg-gray-50">
            <CardContent className="text-center py-8">
              <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600">This thread is locked. New comments cannot be added.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a Comment</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <form onSubmit={handleSubmitComment}>
                  <Textarea 
                    placeholder="Share your thoughts..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-4 min-h-[100px]"
                  />
                  <Button 
                    type="submit" 
                    variant="meow"
                    disabled={createCommentMutation.isPending || !newComment.trim()}
                    className="flex items-center gap-2"
                  >
                    {createCommentMutation.isPending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                        Posting...
                      </>
                    ) : (
                      <>
                        Post Comment
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Please log in or create an account to join the conversation.</p>
                  <Button 
                    onClick={() => navigate('/login', { state: { from: `/forum/${id}` } })}
                    variant="meow"
                  >
                    Log In / Sign Up
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ForumPostPage;
