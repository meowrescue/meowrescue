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

interface EventDetailProps {
  event: any; // Replace with proper event type
}

const EventDetail: React.FC<EventDetailProps> = ({ event: initialEvent }) => {
  const { id: eventId } = useParams<{ id: string }>();
  
  // Use React Query to fetch event data, with initial data from SSG
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("Event ID is required");
      
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data;
    },
    initialData: initialEvent,
    staleTime: 60 * 1000 * 5, // Data is fresh for 5 minutes
  });

  useEffect(() => {
    if (!eventId) return;
    const supabase = getSupabaseClient();
    const subscription = supabase
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
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": eventData.title,
          "description": eventData.description,
          "image": eventData.image_url,
          "startDate": eventData.date_start,
          "endDate": eventData.date_end,
          "location": {
            "@type": "Place",
            "name": eventData.location,
            "address": eventData.location
          },
          "organizer": {
            "@type": "Organization",
            "name": "Meow Rescue",
            "url": "https://meowrescue.org"
          }
        }}
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

/**
 * Generates static paths for all events at build time
 */
export const getStaticPaths = async () => {
  try {
    const supabase = getSupabaseClient();
    const { data: events, error } = await supabase
      .from('events')
      .select('id');

    if (error) {
      console.error('Error fetching event IDs for static paths:', error);
      return {
        paths: [],
        fallback: 'blocking'
      };
    }

    if (!events || events.length === 0) {
      console.warn('No events found for static paths');
      return {
        paths: [],
        fallback: 'blocking'
      };
    }

    const paths = events.map(event => ({
      params: { id: event.id.toString() }
    }));

    console.log(`Generated ${paths.length} static paths for events`);
    return {
      paths,
      fallback: 'blocking' // Generate pages on-demand if not pre-rendered
    };
  } catch (error) {
    console.error('Unexpected error in getStaticPaths for events:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

/**
 * Fetches event data for each static page at build time
 */
export const getStaticProps = async ({ params }: { params: { id: string } }) => {
  try {
    if (!params || !params.id) {
      return {
        notFound: true,
        revalidate: 60 // Revalidate every minute if something goes wrong
      };
    }

    const eventId = params.id;
    const supabase = getSupabaseClient();

    // Fetch event details
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      console.error(`Error fetching event ${eventId}:`, error);
      return {
        notFound: true,
        revalidate: 60
      };
    }

    return {
      props: {
        event
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error(`Unexpected error fetching event ${params?.id}:`, error);
    return {
      notFound: true,
      revalidate: 60
    };
  }
};
