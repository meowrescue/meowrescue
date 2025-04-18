
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  bucketName?: string;
  folderPath?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  bucketName = 'cat-photos', // This should match the bucket created in Supabase
  folderPath = 'cats' // Using a specific folder for organization
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const { toast } = useToast();
  const [bucketExists, setBucketExists] = useState(true);

  // Check if the bucket exists
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .getBucket(bucketName);
        
        if (error) {
          console.error('Error checking bucket:', error);
          setBucketExists(false);
          toast({
            title: 'Storage configuration issue',
            description: `Bucket "${bucketName}" may not exist. Please contact an administrator.`,
            variant: 'destructive',
          });
        } else {
          setBucketExists(true);
        }
      } catch (error) {
        console.error('Error checking bucket:', error);
        setBucketExists(false);
      }
    };

    checkBucket();
  }, [bucketName, toast]);

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      // Make sure the bucket exists
      if (!bucketExists) {
        throw new Error(`Storage bucket "${bucketName}" does not exist`);
      }

      // Make sure the file is an image
      if (!file.type.match('image.*')) {
        throw new Error('Only image files are allowed');
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      // Create a preview image
      setPreviewUrl(data.publicUrl);
      
      // Call the callback function with the public URL
      onImageUploaded(data.publicUrl);

      toast({
        title: 'Image uploaded',
        description: 'Your image was uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadImage(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {previewUrl ? (
        <div className="relative w-full max-w-md">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto rounded-lg object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center w-full max-w-md">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 text-center mb-4">
            Drag and drop your image here or click to browse
          </p>
          <Button
            variant="outline"
            disabled={isUploading || !bucketExists}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
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
