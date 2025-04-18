
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X, FileUp } from 'lucide-react';
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
  bucketName = 'cat-photos', // Default to cat-photos bucket
  folderPath = '' // Default to root of the bucket
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    console.log('Starting upload to bucket:', bucketName, 'folder:', folderPath);

    try {
      // Make sure the file is an image or document
      if (!file.type.match('image.*') && !file.type.match('application/pdf') && !file.type.match('application/msword') && !file.type.match('application/vnd.openxmlformats-officedocument.*')) {
        throw new Error('Only image or document files are allowed');
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      console.log('Uploading file to path:', filePath);

      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('Successfully uploaded file, getting public URL');

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      console.log('Public URL:', urlData.publicUrl);

      // Create a preview image for image files
      if (file.type.match('image.*')) {
        setPreviewUrl(urlData.publicUrl);
      } else {
        // For documents, just set a placeholder or the filename
        setPreviewUrl('document');
      }
      
      // Call the callback function with the public URL
      onImageUploaded(urlData.publicUrl);

      toast({
        title: 'File uploaded',
        description: 'Your file was uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your file.',
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

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    document.getElementById('file-upload')?.click();
  };

  const isDocument = previewUrl === 'document';

  return (
    <div className="flex flex-col items-center space-y-4">
      {previewUrl ? (
        <div className="relative w-full max-w-md">
          {isDocument ? (
            <div className="flex items-center justify-center w-full h-24 bg-gray-50 border border-gray-200 rounded-lg">
              <FileUp className="h-8 w-8 text-meow-primary" />
              <span className="ml-2 text-sm text-gray-600">Document uploaded successfully</span>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded-lg object-cover shadow-md"
            />
          )}
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-meow-primary/30 rounded-lg p-6 flex flex-col items-center w-full max-w-md bg-gradient-to-b from-meow-primary/5 to-transparent hover:from-meow-primary/10 transition-all duration-300">
          <ImageIcon className="h-12 w-12 text-meow-primary/60 mb-4" />
          <p className="text-sm text-gray-500 text-center mb-4">
            Drag and drop your file here or click to browse
          </p>
          <Button
            type="button" // Explicitly set as button type to prevent form submission
            variant="outline"
            disabled={isUploading}
            onClick={handleBrowseClick}
            className="border-meow-primary/50 text-meow-primary hover:text-meow-primary hover:bg-meow-primary/10"
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-meow-primary rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      )}
      <input
        id="file-upload"
        type="file"
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
