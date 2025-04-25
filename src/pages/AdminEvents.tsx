
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
import { supabase } from '@/integrations/supabase/client';
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
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log("Deleting event:", id);
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error("Error deleting event:", error);
          throw error;
        }
        
        console.log("Event deleted successfully");
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
        description: error.message,
        variant: "destructive",
      });
    },
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.title.trim() || !formState.description.trim() || !formState.location.trim() || !formState.date || !formState.image_url.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    
    const eventToSubmit = {
      id: formState.id,
      title: formState.title,
      description: formState.description,
      date: formState.date.toISOString(),
      location: formState.location,
      image_url: formState.image_url,
    };
    
    createOrUpdateEvent.mutate(eventToSubmit);
  };

  // Handle deleting an event
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(id);
    }
  };

  // Upload event image
  const uploadEventImage = async (file: File) => {
  setIsUploading(true);
  const uniqueFileName = `event-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  
  try {
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        contentType: file.type
      });
    
    if (error) throw error;
    
    const publicUrl = supabase.storage.from('event-images').getPublicUrl(data.path).data.publicUrl;
    setFormState(prev => ({ ...prev, image_url: publicUrl }));
    toast({
      title: "Image Uploaded",
      description: "Event image has been uploaded successfully."
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    toast({
      title: "Upload Failed",
      description: error.message || "Failed to upload image",
      variant: "destructive"
    });
  } finally {
    setIsUploading(false);
  }
};

  return (
    <AdminLayout title="Events">
      <SEO title="Events | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Events</h1>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Events List */}
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  {eventsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                    </div>
                  ) : events && events.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()} - {event.location}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => openEditModal(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>No events found</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="relative w-auto mx-auto max-w-2xl my-20">
            <Card className="bg-white rounded-lg shadow-xl">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-bold">
                  {isEditMode ? 'Edit Event' : 'Add Event'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
