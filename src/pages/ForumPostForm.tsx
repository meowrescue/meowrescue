
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LoaderIcon, AlertCircle } from 'lucide-react';
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
  
  // Placeholder query - we need to set up the database tables first
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['forumPostEditPlaceholder', id],
    queryFn: async () => {
      return null;
    },
    enabled: isEditing && !!user
  });
  
  // Placeholder mutation
  const createPostMutation = useMutation({
    mutationFn: async (formData: { title: string; content: string; category: string }) => {
      toast({
        title: "Forum feature not available",
        description: "The database tables for forum functionality need to be created first.",
        variant: "destructive"
      });
      return null;
    }
  });
  
  // Placeholder mutation
  const updatePostMutation = useMutation({
    mutationFn: async (formData: { id: string; title: string; content: string; category: string }) => {
      toast({
        title: "Forum feature not available",
        description: "The database tables for forum functionality need to be created first.",
        variant: "destructive"
      });
      return null;
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
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-4">Forum Functionality Coming Soon</h2>
                <p className="text-gray-600 mb-4">
                  The database tables for the forum feature need to be created first.
                  Please check back later for this feature.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ForumPostForm;
