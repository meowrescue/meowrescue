
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CatPhotosSectionProps {
  photos: string[];
  status: 'Available' | 'Pending' | 'Adopted';
  name: string;
  onImageClick: (image: string) => void;
}

const CatPhotosSection: React.FC<CatPhotosSectionProps> = ({ photos, status, name, onImageClick }) => {
  return (
    <div className="space-y-6">
      <div 
        className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
        onClick={() => onImageClick(photos?.[0] || '/placeholder-cat.jpg')}
      >
        <img
          src={photos?.[0] || '/placeholder-cat.jpg'}
          alt={name}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge className={`text-white ${
            status === 'Available' ? 'bg-green-500' : 
            status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}>
            {status}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="text-white text-lg font-medium">Click to enlarge</div>
        </div>
      </div>
    </div>
  );
};

export default CatPhotosSection;
