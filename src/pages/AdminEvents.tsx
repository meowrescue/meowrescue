
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Plus, Edit, Trash, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image_url?: string;
  created_at: string;
}

const AdminEvents: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
    });
    setImageFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  // Fetch all events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      let imageUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `event-images/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('public')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              setUploadProgress((progress.loaded / progress.total) * 100);
            },
          });

        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Create event record
      const { data, error } = await supabase
        .from('events')
        .insert([
          { 
            ...newEvent, 
            image_url: imageUrl 
          },
        ])
        .select();

      if (error) throw error;
      
      setIsUploading(false);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event',
        variant: 'destructive',
      });
      setIsUploading(false);
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get the event to find the image URL
      const { data: eventData } = await supabase
        .from('events')
        .select('image_url')
        .eq('id', id)
        .single();
        
      // Delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // If there's an image, delete it from storage
      if (eventData?.image_url) {
        try {
          // Extract file path from URL
          const url = new URL(eventData.image_url);
          const filePath = url.pathname.split('/').slice(-2).join('/');
          
          if (filePath) {
            await supabase.storage
              .from('public')
              .remove([filePath]);
          }
        } catch (err) {
          console.error('Error deleting image:', err);
          // Continue even if image deletion fails
        }
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setSelectedEventId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete event',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedEventId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEventId) {
      deleteEventMutation.mutate(selectedEventId);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout title="Event Management">
      <SEO title="Event Management | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-meow-primary">Upcoming Events</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Enter the details for your new event. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid w-full items-center gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Event Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div className="grid w-full items-center gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    placeholder="Describe the event"
                    required
                    rows={4}
                  />
                </div>
                
                <div className="grid w-full items-center gap-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    placeholder="Event location"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="date" className="text-sm font-medium">
                      Date
                    </label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="time" className="text-sm font-medium">
                      Time
                    </label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid w-full items-center gap-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Event Image
                  </label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {previewUrl && (
                      <div className="relative mt-2 rounded-md overflow-hidden h-40 bg-gray-100">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-meow-primary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Save Event'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Image className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="bg-white h-8 w-8"
                      onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="bg-white text-red-500 hover:text-red-700 hover:bg-white h-8 w-8"
                      onClick={() => handleDeleteClick(event.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-meow-primary" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-meow-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-meow-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Scheduled</h3>
            <p className="text-gray-500 mb-6">
              There are no upcoming events. Create one to get started.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Event
                </Button>
              </DialogTrigger>
              {/* We're reusing the same dialog content */}
            </Dialog>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminEvents;
