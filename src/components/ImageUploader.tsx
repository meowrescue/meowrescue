
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  bucketName?: string;
  folderPath?: string;
  showThumbnailOnly?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  bucketName = 'profile-photos',
  folderPath = '',
  showThumbnailOnly = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: 'Image uploaded',
        description: 'Your image was uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Check if the bucket doesn't exist
      if (error.message && error.message.includes('bucket not found')) {
        toast({
          title: 'Storage bucket not found',
          description: `The "${bucketName}" storage bucket doesn't exist. Please contact the administrator.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Upload failed',
          description: error.message || 'There was an error uploading your image.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete image
  const handleDeleteImage = async () => {
    try {
      if (!previewUrl) return;
      
      // Extract the file path from the URL
      const urlParts = previewUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');
      
      if (!filePath) {
        throw new Error('Could not determine file path');
      }
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) throw error;
      
      setPreviewUrl(null);
      onImageUploaded('');
      
      toast({
        title: 'Image deleted',
        description: 'The image was successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'There was an error deleting your image.',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadImage(files[0]);
    }
  };

  return (
    <div className="relative w-full max-w-md group">
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <img 
            src={previewUrl}
            alt="Preview"
            className={showThumbnailOnly 
              ? "w-32 h-32 object-cover rounded-lg" 
              : "w-full h-60 object-cover rounded-lg"
            }
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
            onClick={handleDeleteImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-meow-primary/40 rounded-lg p-6 flex flex-col items-center w-full">
          <div className="bg-meow-primary/10 p-4 rounded-full mb-4">
            <ImageIcon className="h-8 w-8 text-meow-primary" />
          </div>
          <p className="text-sm text-gray-500 text-center mb-4">
            Drag and drop your file here or click to browse
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('file-upload')?.click()}
            className="border-meow-primary/50 text-meow-primary hover:text-meow-primary hover:bg-meow-primary/10"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      )}
      
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
