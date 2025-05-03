import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

const AdminEvents: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formState, setFormState] = useState({
    id: '',
    title: '',
    description: '',
    date: new Date(),
    location: '',
    image_url: '',
  });

  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        console.log("Fetching events");
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          console.error("Error fetching events:", error);
          toast({
            title: "Error Loading Events",
            description: error.message,
            variant: "destructive",
          });
          return [] as Event[];
        }
        
        console.log("Events fetched:", data);
        return data as Event[];
      } catch (err) {
        console.error("Error in events query:", err);
        return [] as Event[];
      }
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Create or update event mutation
  const createOrUpdateEvent = useMutation({
    mutationFn: async (event: Omit<Event, 'created_at' | 'updated_at'>) => {
      try {
        console.log("Creating/updating event:", event);
        
        const isNewEvent = !event.id;
        const supabase = getSupabaseClient();
        
        const { data, error } = await supabase
          .from('events')
          .upsert([
            {
              id: event.id || undefined,
              title: event.title,
              description: event.description,
              date: event.date,
              location: event.location,
              image_url: event.image_url,
            }
          ], { onConflict: 'id' })
          .select();
        
        if (error) {
          console.error("Error creating/updating event:", error);
          throw error;
        }
        
        console.log("Event created/updated successfully:", data);
        return { data, isNewEvent };
      } catch (err: any) {
        console.error("Error in create/update event mutation:", err);
        throw err;
      }
    },
    onSuccess: (result) => {
      toast({
        title: result.isNewEvent ? "Event Created" : "Event Updated",
        description: `Event has been ${result.isNewEvent ? 'created' : 'updated'} successfully.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      closeModal();
    },
    onError: (error: any) => {
      console.error("Error in create/update event mutation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    }
  });

  // Delete event mutation
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log("Deleting event:", id);
        const supabase = getSupabaseClient();
        
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error("Error deleting event:", error);
          throw error;
        }
        
        console.log("Event deleted successfully");
        return id;
      } catch (err: any) {
        console.error("Error in delete event mutation:", err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Event Deleted",
        description: "Event has been deleted successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      console.error("Error in delete event mutation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  });

  // Handle opening the modal in create mode
  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedEvent(null);
    setFormState({
      id: '',
      title: '',
      description: '',
      date: new Date(),
      location: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  // Handle opening the modal in edit mode
  const openEditModal = (event: Event) => {
    setIsEditMode(true);
    setSelectedEvent(event);
    setFormState({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      location: event.location,
      image_url: event.image_url,
    });
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.title || !formState.description || !formState.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    createOrUpdateEvent.mutate({
      id: formState.id,
      title: formState.title,
      description: formState.description,
      date: formState.date.toISOString(),
      location: formState.location,
      image_url: formState.image_url,
    });
  };

  // Handle deleting an event
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(id);
    }
  };

  // Upload event image
  const uploadEventImage = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      const supabase = getSupabaseClient();
      
      // Upload the file
      const { data, error } = await supabase
        .storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('public')
        .getPublicUrl(filePath);
      
      // Update form state with the image URL
      setFormState({
        ...formState,
        image_url: urlData.publicUrl
      });
      
      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully."
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminLayout title="Events Management">
      <SEO 
        title="Events Management | Admin Dashboard" 
        description="Manage events for Meow Rescue."
        noindex={true}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-meow-primary mb-2">Events Management</h1>
            <p className="text-gray-600">Create and manage upcoming events</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={openCreateModal}
              className="flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Event
            </Button>
          </div>
        </div>
        
        {eventsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div className="truncate">{event.title}</div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditModal(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p>{event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <ScrollArea className="h-24 mt-1">
                      <p className="text-sm">{event.description}</p>
                    </ScrollArea>
                  </div>
                  <div className="mt-4">
                    <Link to={`/events/${event.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Event Page
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">No events found</p>
            <Button onClick={openCreateModal}>Create Your First Event</Button>
          </div>
        )}
        
        {/* Create/Edit Event Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      id="title"
                      value={formState.title}
                      onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      type="text"
                      id="location"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !formState.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formState.date ? (
                            format(formState.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formState.date}
                          onSelect={(date) => setFormState({ ...formState, date: date || new Date() })}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      type="text"
                      id="image_url"
                      value={formState.image_url}
                      readOnly
                    />
                    <Input
                      type="file"
                      id="image_upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadEventImage(file);
                        }
                      }}
                      className="mt-2"
                    />
                    {isUploading && (
                      <div className="flex justify-center mt-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createOrUpdateEvent.isPending}>
                      {createOrUpdateEvent.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
