
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { SuccessStory } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useSuccessStories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stories, isLoading } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('success_stories')
        .select('*, cats(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SuccessStory[];
    }
  });

  const addStoryMutation = useMutation({
    mutationFn: async (story: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await getSupabaseClient()
        .from('success_stories')
        .insert([story])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Success story added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
      queryClient.invalidateQueries({ queryKey: ['homepageSuccessStories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add success story',
        variant: 'destructive',
      });
    }
  });

  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, story }: { id: string; story: Partial<SuccessStory> }) => {
      const { data, error } = await getSupabaseClient()
        .from('success_stories')
        .update(story)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Success story updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
      queryClient.invalidateQueries({ queryKey: ['homepageSuccessStories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update success story',
        variant: 'destructive',
      });
    }
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('success_stories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Success story deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
      queryClient.invalidateQueries({ queryKey: ['homepageSuccessStories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete success story',
        variant: 'destructive',
      });
    }
  });

  const toggleHomepageDisplayMutation = useMutation({
    mutationFn: async ({ id, showOnHomepage }: { id: string; showOnHomepage: boolean }) => {
      const { data, error } = await getSupabaseClient()
        .from('success_stories')
        .update({ show_on_homepage: showOnHomepage })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
      queryClient.invalidateQueries({ queryKey: ['homepageSuccessStories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update homepage display setting',
        variant: 'destructive',
      });
    }
  });

  return {
    stories,
    isLoading,
    addStoryMutation,
    updateStoryMutation,
    deleteStoryMutation,
    toggleHomepageDisplayMutation
  };
};
