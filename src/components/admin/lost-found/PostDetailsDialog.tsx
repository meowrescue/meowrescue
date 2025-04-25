
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArchiveIcon, RotateCcw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LostFoundPost } from "@/types/supabase";

interface PostDetailsDialogProps {
  post: LostFoundPost;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

const PostDetailsDialog: React.FC<PostDetailsDialogProps> = ({
  post,
  isOpen,
  onClose,
  onDelete,
  onArchive,
  onRestore,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
          <DialogDescription>
            Posted by {post.profiles?.first_name} {post.profiles?.last_name} on{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Post Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={
                  post.status === 'lost' ? 'destructive' :
                  post.status === 'found' ? 'outline' :
                  post.status === 'reunited' ? 'default' :
                  'secondary'
                } className="mt-1">
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Pet Type</p>
                <p>{post.pet_type}</p>
              </div>
              
              {post.pet_name && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Pet Name</p>
                  <p>{post.pet_name}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p>{post.location}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date Occurred</p>
                <p>{new Date(post.date_occurred).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Information</p>
                <p>{post.contact_info || post.profiles?.email}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="whitespace-pre-wrap">{post.description}</p>
            
            {post.photos_urls && post.photos_urls.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {post.photos_urls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`${post.pet_type} ${index + 1}`} 
                      className="rounded-md w-full h-40 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => onDelete(post.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            
            {post.status !== 'archived' ? (
              <Button
                variant="outline"
                onClick={() => onArchive(post.id)}
              >
                <ArchiveIcon className="mr-2 h-4 w-4" />
                Archive
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => onRestore(post.id)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </Button>
            )}
          </div>
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailsDialog;
