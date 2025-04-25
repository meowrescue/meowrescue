
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Heart, Home, Trash2, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { SuccessStory } from './types';

interface SuccessStoryCardProps {
  story: SuccessStory;
  onEdit: (story: SuccessStory) => void;
  onDelete: (story: SuccessStory) => void;
  onToggleHomepage: (story: SuccessStory) => void;
  homepageStoriesCount: number;
}

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({
  story,
  onEdit,
  onDelete,
  onToggleHomepage,
  homepageStoriesCount,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
          <ImageIcon className="h-12 w-12 text-gray-300" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{story.title}</h3>
          <Button 
            variant={story.show_on_homepage ? "default" : "outline"}
            size="sm"
            className={`ml-2 ${story.show_on_homepage ? 'bg-meow-primary hover:bg-meow-primary/90' : 'border-gray-300'}`}
            onClick={() => onToggleHomepage(story)}
            title={story.show_on_homepage ? "Remove from homepage" : "Show on homepage"}
          >
            <Home className="h-4 w-4" />
            {story.show_on_homepage && <span className="ml-1 text-xs">Homepage</span>}
          </Button>
        </div>
        
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
            onClick={() => onEdit(story)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(story)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoryCard;
