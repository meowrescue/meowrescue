import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { usePageData } from '@/contexts/PageDataContext';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';

const EventDetail: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  
  // Get any pre-rendered data from PageDataContext
  const pageData = usePageData();
  const preloadedEvent = pageData?.pageType === 'eventDetail' ? pageData.event : null;
  
  // Use React Query to fetch event data
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("Event ID is required");
      
      // If we already have the data from SSR/SSG, use it
      if (preloadedEvent) {
        console.log('Using preloaded event data from SSR');
        return preloadedEvent;
      }
      
      // Client-side fetching fallback
      const getSupabaseClient() = getSupabaseClient();
      const { data, error } = await getSupabaseClient()
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      
      return data;
    },
    // Don't refetch if we already have data from SSR
    enabled: !!eventId && !preloadedEvent,
    // Use SSR data as initial data if available
    initialData: preloadedEvent,
    // Use a fallback event if data is missing
    placeholderData: {
      id: parseInt(eventId || '1'),
      title: "Adoption Event at PetSmart",
      date_start: "2025-04-20T11:00:00",
      date_end: "2025-04-20T15:00:00",
      location: "PetSmart, US-19, New Port Richey",
      description: "Meet some of our adorable adoptable cats and kittens! Our volunteers will be on hand to answer questions about specific cats or the adoption process.",
      image_url: "https://images.unsplash.com/photo-1570304816841-906a17d7b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      long_description: "Join us for a special adoption event at PetSmart in New Port Richey. Our team will be bringing several adoptable cats and kittens who are looking for their forever homes. This is a great opportunity to meet our cats in person and learn more about our adoption process. Our knowledgeable volunteers will be available to answer any questions you might have about specific cats or the adoption process in general. If you're thinking about adding a feline friend to your family, this is the perfect event to attend!"
    }
  });

  useEffect(() => {
    if (!eventId) return;
    const getSupabaseClient() = getSupabaseClient();
    const subscription = getSupabaseClient()
      .channel(`event-${eventId}-updates`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events', filter: `id=eq.${eventId}` }, (payload) => {
        console.log('Event update received:', payload);
        window.location.reload(); // Temporary workaround to refresh the page
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [eventId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
  };

  if (!event) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      </Layout>
    );
  }

  // Format event data for display
  const eventData = {
    ...event,
    formattedDate: formatDate(event.date_start),
    formattedTime: formatTime(event.date_start, event.date_end)
  };

  return (
    <Layout>
      <SEO 
        title={`${eventData.title} | Meow Rescue Events`}
        description={eventData.description}
      />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/events" className="inline-flex items-center text-meow-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all events
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img 
              src={eventData.image_url} 
              alt={eventData.title} 
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-6"
            />
            
            <h1 className="text-3xl font-bold text-meow-primary mb-4">{eventData.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-meow-primary" />
                <span>{eventData.formattedDate}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-meow-primary" />
                <span>{eventData.formattedTime}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-meow-primary" />
                <span>{eventData.location}</span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-4">{eventData.description}</p>
              <p>{eventData.long_description}</p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Event Information</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium">Date:</p>
                  <p>{eventData.formattedDate}</p>
                </div>
                <div>
                  <p className="font-medium">Time:</p>
                  <p>{eventData.formattedTime}</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p>{eventData.location}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="meow" className="w-full">
                  Add to Calendar
                </Button>
                <Button variant="outline" className="w-full">
                  Share Event
                </Button>
                <Button asChild variant="meowOutline" className="w-full">
                  <Link to="/contact">Contact Organizer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
