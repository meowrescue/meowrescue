
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Calendar, X } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date_start: string;
  event_date_end: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date_start: string;
  event_date_end: string;
  image_url?: string;
}

const AdminEvents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    event_date_start: new Date().toISOString().slice(0, 16),
    event_date_end: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    image_url: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch events from Supabase
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date_start', { ascending: true });
        
      if (error) throw error;
      return data as Event[];
    }
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (newEvent: EventFormData) => {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...newEvent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "The event has been successfully created."
      });
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        event_date_start: new Date().toISOString().slice(0, 16),
        event_date_end: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        image_url: ''
      });
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Filter events based on search query
  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date function
  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If same day event
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Multi-day event
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate(formData);
  };

  return (
    <AdminLayout title="Events">
      <SEO title="Events | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Events</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading events. Please try again later.</p>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>All upcoming and past events.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatEventDate(event.event_date_start, event.event_date_end)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Events Management</h2>
              <p className="text-gray-500 mb-8">
                No events found. You can add a new event using the button above.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details for the new event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent}>
            <div className="grid gap-4 py-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid w-full grid-cols-2 gap-4">
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="event_date_start">Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    id="event_date_start"
                    name="event_date_start"
                    value={formData.event_date_start}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="event_date_end">End Date & Time</Label>
                  <Input
                    type="datetime-local"
                    id="event_date_end"
                    name="event_date_end"
                    value={formData.event_date_end}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter event description"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  placeholder="Enter image URL"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createEvent.isPending}>
                {createEvent.isPending ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
