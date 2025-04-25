
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageUploader from '@/components/ImageUploader';
import { useToast } from '@/hooks/use-toast';

interface Cat {
  id: string;
  name: string;
}

interface FormData {
  title: string;
  story_text: string;
  photo_url: string;
  cat_id: string;
  adoption_date: string;
  show_on_homepage: boolean;
}

interface SuccessStoryFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  cats?: Cat[];
  homepageStoriesCount: number;
  isSubmitting: boolean;
  mode: 'add' | 'edit';
}

const SuccessStoryForm: React.FC<SuccessStoryFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  cats,
  homepageStoriesCount,
  isSubmitting,
  mode
}) => {
  const { toast } = useToast();

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, photo_url: url });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
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
            onImageUploaded={handleImageUploaded}
            currentImage={formData.photo_url}
            bucketName="images"
            folderPath="success-stories"
            showThumbnailOnly={true}
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
                <SelectItem value="none">None</SelectItem>
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
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show_on_homepage"
            checked={formData.show_on_homepage}
            onCheckedChange={(checked) => {
              if (checked && homepageStoriesCount >= 3) {
                toast({
                  title: 'Limit Reached',
                  description: 'Only 3 stories can be shown on the homepage.',
                  variant: 'destructive',
                });
                return;
              }
              setFormData({ ...formData, show_on_homepage: checked });
            }}
          />
          <Label htmlFor="show_on_homepage">Show on homepage ({homepageStoriesCount}/3)</Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'add' ? 'Save Story' : 'Update Story'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SuccessStoryForm;
