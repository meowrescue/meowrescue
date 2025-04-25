
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CatDetailGalleryProps {
  photos: string[];
}

const CatDetailGallery: React.FC<CatDetailGalleryProps> = ({ photos }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const defaultImage = '/placeholder.svg';

  const mainImage = photos && photos.length > 0 ? photos[0] : defaultImage;
  const thumbnails = photos && photos.length > 1 ? photos.slice(1) : [];

  return (
    <div className="space-y-4">
      <div 
        className="relative h-96 cursor-pointer overflow-hidden rounded-lg"
        onClick={() => setSelectedImage(mainImage)}
      >
        <img
          src={mainImage}
          alt="Main cat photo"
          className="h-full w-full object-cover"
        />
      </div>

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbnails.map((photo, index) => (
            <div 
              key={index}
              className="aspect-square cursor-pointer overflow-hidden rounded-md"
              onClick={() => setSelectedImage(photo)}
            >
              <img
                src={photo}
                alt={`Cat photo ${index + 2}`}
                className="h-full w-full object-cover transition-transform hover:scale-110"
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[90vw] p-1 bg-transparent border-0">
          <div className="relative bg-black/80 p-1 rounded-lg">
            <img 
              src={selectedImage || ''}
              alt="Enlarged cat photo"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <button 
              className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatDetailGallery;
