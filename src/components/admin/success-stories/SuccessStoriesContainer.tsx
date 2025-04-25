
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SuccessStory } from './types';
import { useSuccessStories } from './hooks/useSuccessStories';
import { useCats } from './hooks/useCats';
import SuccessStoryGrid from './SuccessStoryGrid';
import SuccessStoryForm from './SuccessStoryForm';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SuccessStoriesContainer = () => {
  const { toast } = useToast();
  const { stories, isLoading, addStoryMutation, updateStoryMutation, deleteStoryMutation, toggleHomepageDisplayMutation } = useSuccessStories();
  const { cats } = useCats();
  
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
    show_on_homepage: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      story_text: '',
      photo_url: '',
      cat_id: '',
      adoption_date: '',
      show_on_homepage: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.show_on_homepage && stories?.filter(story => story.show_on_homepage).length >= 3) {
      toast({
        title: 'Limit Reached',
        description: 'Only 3 stories can be shown on the homepage. Please remove one before adding another.',
        variant: 'destructive',
      });
      return;
    }
    
    addStoryMutation.mutate(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStory) {
      if (formData.show_on_homepage && !selectedStory.show_on_homepage && 
          stories?.filter(story => story.show_on_homepage).length >= 3) {
        toast({
          title: 'Limit Reached',
          description: 'Only 3 stories can be shown on the homepage. Please remove one before adding another.',
          variant: 'destructive',
        });
        return;
      }
      
      updateStoryMutation.mutate({ id: selectedStory.id, story: formData });
      setIsEditDialogOpen(false);
      setSelectedStory(null);
    }
  };

  const handleDelete = () => {
    if (selectedStory) {
      deleteStoryMutation.mutate(selectedStory.id);
      setIsDeleteDialogOpen(false);
      setSelectedStory(null);
    }
  };

  const handleToggleHomepage = (story: SuccessStory) => {
    if (!story.show_on_homepage && stories?.filter(s => s.show_on_homepage).length >= 3) {
      toast({
        title: 'Limit Reached',
        description: 'Only 3 stories can be shown on the homepage. Please remove one before adding another.',
        variant: 'destructive',
      });
      return;
    }
    
    toggleHomepageDisplayMutation.mutate({ id: story.id, showOnHomepage: !story.show_on_homepage });
  };

  const openEditDialog = (story: SuccessStory) => {
    setSelectedStory(story);
    setFormData({
      title: story.title,
      story_text: story.story_text,
      photo_url: story.photo_url || '',
      cat_id: story.cat_id || 'none',
      adoption_date: story.adoption_date ? new Date(story.adoption_date).toISOString().substring(0, 10) : '',
      show_on_homepage: story.show_on_homepage,
    });
    setIsEditDialogOpen(true);
  };

  const filteredStories = stories?.filter(story => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(query) ||
      story.story_text.toLowerCase().includes(query)
    );
  });

  const homepageStoriesCount = stories?.filter(story => story.show_on_homepage).length || 0;

  return (
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
              <SuccessStoryGrid
                stories={filteredStories}
                onEdit={openEditDialog}
                onDelete={(story) => {
                  setSelectedStory(story);
                  setIsDeleteDialogOpen(true);
                }}
                onToggleHomepage={handleToggleHomepage}
                homepageStoriesCount={homepageStoriesCount}
              />
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

      {/* Add Story Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Add Success Story
            </DialogTitle>
          </DialogHeader>
          
          <SuccessStoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}
            cats={cats}
            homepageStoriesCount={homepageStoriesCount}
            isSubmitting={addStoryMutation.isPending}
            mode="add"
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Story Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Edit Success Story
            </DialogTitle>
          </DialogHeader>
          
          <SuccessStoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedStory(null);
            }}
            cats={cats}
            homepageStoriesCount={homepageStoriesCount}
            isSubmitting={updateStoryMutation.isPending}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SuccessStoriesContainer;
