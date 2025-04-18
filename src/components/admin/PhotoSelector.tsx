
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface PhotoSelectorProps {
  photos: string[];
  onSelectPrimary: (index: number) => void;
  primaryIndex: number;
  onRemovePhoto: (index: number) => void;
  editMode: boolean;
}

const PhotoSelector = ({ 
  photos, 
  onSelectPrimary, 
  primaryIndex, 
  onRemovePhoto, 
  editMode 
}: PhotoSelectorProps) => {
  return (
    <div className="space-y-4">
      {editMode && <p className="text-sm text-gray-500">Click the star icon to set a photo as primary.</p>}
      <div className="flex flex-wrap gap-3">
        {photos.map((url, index) => (
          <div key={index} className="relative group">
            <img 
              src={url} 
              alt={`Cat photo ${index + 1}`} 
              className="w-24 h-24 object-cover rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {editMode && (
                <Button
                  type="button"
                  variant={primaryIndex === index ? "default" : "secondary"}
                  size="icon"
                  className="h-6 w-6 p-0 rounded-full shadow-sm opacity-90"
                  onClick={() => onSelectPrimary(index)}
                >
                  <Star className="h-3 w-3" fill={primaryIndex === index ? "currentColor" : "none"} />
                </Button>
              )}
              {editMode && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 p-0 rounded-full shadow-sm opacity-0 group-hover:opacity-90 transition-opacity"
                  onClick={() => onRemovePhoto(index)}
                >
                  &times;
                </Button>
              )}
            </div>
            {primaryIndex === index && !editMode && (
              <div className="absolute top-2 right-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoSelector;
