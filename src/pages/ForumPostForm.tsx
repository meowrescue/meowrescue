
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LoaderIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';

const ForumPostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  
  // Fetch existing post for editing
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['forumPostEdit', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Check if user is the author
      if (data.profile_id !== user?.id) {
        throw new Error('You are not authorized to edit this post');
      }
      
      return data;
    },
    enabled: isEditing && !!user,
    onSuccess: (data) => {
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Could not load the post for editing.",
        variant: "destructive"
      });
      navigate('/forum');
    }
  });
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (formData: { title: string; content: string; category: string }) => {
      if (!user) throw new Error('You must be logged in to create a post');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          profile_id: user.id
        })
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      toast({
        title: "Post Created",
        description: "Your post has been published successfully."
      });
      navigate(`/forum/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create your post. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (formData: { id: string; title: string; content: string; category: string }) => {
      if (!user) throw new Error('You must be logged in to update a post');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .update({
          title: formData.title,
          content: formData.content,
          category: formData.category
        })
        .eq('id', formData.id)
        .eq('profile_id', user.id) // Ensure the user is the author
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      toast({
        title: "Post Updated",
        description: "Your post has been updated successfully."
      });
      navigate(`/forum/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error Updating Post",
        description: error.message || "Failed to update your post. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditing && id) {
      updatePostMutation.mutate({ id, title, content, category });
    } else {
      createPostMutation.mutate({ title, content, category });
    }
  };
  
  if (isEditing && postLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <ProtectedRoute>
      <Layout>
        <SEO 
          title={isEditing ? "Edit Forum Post | Meow Rescue" : "Create Forum Post | Meow Rescue"}
          description="Share your thoughts with the Meow Rescue community."
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
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-meow-primary">
                {isEditing ? 'Edit Forum Post' : 'Create New Forum Post'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter a title for your post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Discussion</SelectItem>
                      <SelectItem value="adoption">Adoption</SelectItem>
                      <SelectItem value="cat-care">Cat Care</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea 
                    id="content"
                    placeholder="Share your thoughts, questions, or stories..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>
                
                <CardFooter className="flex justify-end px-0 pt-4">
                  <Button
                    type="submit"
                    variant="meow"
                    className="flex items-center gap-2"
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {(createPostMutation.isPending || updatePostMutation.isPending) ? (
                      <>
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                        {isEditing ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>{isEditing ? 'Update Post' : 'Publish Post'}</>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ForumPostForm;
