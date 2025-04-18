
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Award, Plus, Search, Calendar, Trash2, Edit, 
  Image, FileText, Check, X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SEO from '@/components/SEO';
import ImageUploader from '@/components/ImageUploader';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SuccessStory {
  id: string;
  title: string;
  story_text: string;
  photo_url: string | null;
  cat_id: string | null;
  adoption_date: string | null;
  created_at: string;
  updated_at: string;
}

interface Cat {
  id: string;
  name: string;
  status: string;
}

const AdminSuccessStories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    story_text: '',
    photo_url: '',
    cat_id: '',
    adoption_date: '',
  });

  // Fetch success stories
  const { data: stories, isLoading } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SuccessStory[];
    }
  });

  // Fetch cats for dropdown
  const { data: cats } = useQuery({
    queryKey: ['cats-for-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('id, name, status');
      
      if (error) throw error;
      return data as Cat[];
    }
  });

  // Add story mutation
  const addStoryMutation = useMutation({
    mutationFn: async (story: typeof formData) => {
      const { data, error } = await supabase
        .from('success_stories')
        .insert([{
          title: story.title,
          story_text: story.story_text,
          photo_url: story.photo_url || null,
          cat_id: story.cat_id || null,
          adoption_date: story.adoption_date || null,
        }])
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
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add success story',
        variant: 'destructive',
      });
    }
  });

  // Update story mutation
  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, story }: { id: string; story: typeof formData }) => {
      const { data, error } = await supabase
        .from('success_stories')
        .update({
          title: story.title,
          story_text: story.story_text,
          photo_url: story.photo_url || null,
          cat_id: story.cat_id || null,
          adoption_date: story.adoption_date || null,
        })
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
      setIsEditDialogOpen(false);
      setSelectedStory(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update success story',
        variant: 'destructive',
      });
    }
  });

  // Delete story mutation
  const deleteStoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
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
      setIsDeleteDialogOpen(false);
      setSelectedStory(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete success story',
        variant: 'destructive',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      story_text: '',
      photo_url: '',
      cat_id: '',
      adoption_date: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStoryMutation.mutate(formData);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStory) {
      updateStoryMutation.mutate({ id: selectedStory.id, story: formData });
    }
  };

  const handleDeleteStory = () => {
    if (selectedStory) {
      deleteStoryMutation.mutate(selectedStory.id);
    }
  };

  const openEditDialog = (story: SuccessStory) => {
    setSelectedStory(story);
    setFormData({
      title: story.title,
      story_text: story.story_text,
      photo_url: story.photo_url || '',
      cat_id: story.cat_id || '',
      adoption_date: story.adoption_date ? new Date(story.adoption_date).toISOString().substring(0, 10) : '',
    });
    setIsEditDialogOpen(true);
  };

  // Filter stories based on search query
  const filteredStories = stories?.filter(story => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(query) ||
      story.story_text.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Success Stories">
      <SEO title="Success Stories | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Success Stories</h1>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Success Story
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredStories && filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStories.map(story => (
                    <div key={story.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      {story.photo_url ? (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={story.photo_url}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">{story.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {story.story_text}
                        </p>
                        
                        <div className="flex text-sm text-gray-500 mb-4">
                          {story.adoption_date && (
                            <span className="flex items-center mr-4">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(story.adoption_date), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(story)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedStory(story);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No success stories found</h3>
                  <p className="text-gray-500 mb-6">Share your adoption success stories to inspire others.</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Success Story
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Add Story Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Add Success Story
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fluffy Found Her Forever Home!"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="story_text">Story</Label>
                <Textarea
                  id="story_text"
                  value={formData.story_text}
                  onChange={(e) => setFormData({ ...formData, story_text: e.target.value })}
                  placeholder="Share this success story..."
                  rows={6}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="photo">Photo</Label>
                <ImageUploader
                  onImageUploaded={(url) => setFormData({ ...formData, photo_url: url })}
                  currentImage={formData.photo_url}
                  bucketName="images"
                  folderPath="success-stories"
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 800x600 pixels
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cat_id">Related Cat</Label>
                  <Select
                    value={formData.cat_id}
                    onValueChange={(value) => setFormData({ ...formData, cat_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cat (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {cats?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="adoption_date">Adoption Date</Label>
                  <Input
                    id="adoption_date"
                    type="date"
                    value={formData.adoption_date}
                    onChange={(e) => setFormData({ ...formData, adoption_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addStoryMutation.isPending}
              >
                {addStoryMutation.isPending ? 'Saving...' : 'Save Story'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Story Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Edit Success Story
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_title">Title</Label>
                <Input
                  id="edit_title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fluffy Found Her Forever Home!"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_story_text">Story</Label>
                <Textarea
                  id="edit_story_text"
                  value={formData.story_text}
                  onChange={(e) => setFormData({ ...formData, story_text: e.target.value })}
                  placeholder="Share this success story..."
                  rows={6}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_photo">Photo</Label>
                <ImageUploader
                  onImageUploaded={(url) => setFormData({ ...formData, photo_url: url })}
                  currentImage={formData.photo_url}
                  bucketName="images"
                  folderPath="success-stories"
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 800x600 pixels
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_cat_id">Related Cat</Label>
                  <Select
                    value={formData.cat_id}
                    onValueChange={(value) => setFormData({ ...formData, cat_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cat (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {cats?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_adoption_date">Adoption Date</Label>
                  <Input
                    id="edit_adoption_date"
                    type="date"
                    value={formData.adoption_date}
                    onChange={(e) => setFormData({ ...formData, adoption_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedStory(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateStoryMutation.isPending}
              >
                {updateStoryMutation.isPending ? 'Saving...' : 'Update Story'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this success story. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminSuccessStories;
