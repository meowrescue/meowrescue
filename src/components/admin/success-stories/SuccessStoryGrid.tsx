
import React from 'react';
import SuccessStoryCard from './SuccessStoryCard';
import { SuccessStory } from './types';

interface SuccessStoryGridProps {
  stories: SuccessStory[];
  onEdit: (story: SuccessStory) => void;
  onDelete: (story: SuccessStory) => void;
  onToggleHomepage: (story: SuccessStory) => void;
  homepageStoriesCount: number;
}

const SuccessStoryGrid: React.FC<SuccessStoryGridProps> = ({
  stories,
  onEdit,
  onDelete,
  onToggleHomepage,
  homepageStoriesCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map(story => (
        <SuccessStoryCard
          key={story.id}
          story={story}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleHomepage={onToggleHomepage}
          homepageStoriesCount={homepageStoriesCount}
        />
      ))}
    </div>
  );
};

export default SuccessStoryGrid;
