import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Event } from '../types/events';
import EventCard from '../components/EventCard';
import { useScrollToElement } from '@/hooks/use-scroll';
import getSupabaseClient from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the custom hook to handle scrolling
  useScrollToElement();
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await getSupabaseClient()
        .from('events')
        .select('*')
        .order('date_start', { ascending: true });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }
      
      // Transform to match Event interface
      const transformedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date_start).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: `${new Date(event.date_start).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })} - ${new Date(event.date_end).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`,
        location: event.location,
        description: event.description,
        imageUrl: event.image_url || "https://images.unsplash.com/photo-1570304816841-906a17d7b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      }));
      
      setEvents(transformedEvents);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await getSupabaseClient()
        .from('events')
        .select('*')
        .order('date_start', { ascending: true });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }
      
      // Transform to match Event interface
      const transformedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date_start).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: `${new Date(event.date_start).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })} - ${new Date(event.date_end).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`,
        location: event.location,
        description: event.description,
        imageUrl: event.image_url || "https://images.unsplash.com/photo-1570304816841-906a17d7b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      }));
      
      setEvents(transformedEvents);
    } catch (error: any) {
      console.error("Error refetching events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = getSupabaseClient()
      .channel('events-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        console.log('Event update received:', payload);
        refetchEvents();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetchEvents]);

  return (
    <Layout>
      <PageHeader 
        title="Upcoming Events" 
        subtitle="Join us at our upcoming events and help support our mission"
      />
      
      <div className="container mx-auto px-4 py-12 pt-24" id="events-content">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-meow-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">
              No upcoming events at the moment. Check back soon!
            </p>
          </div>
        )}
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-meow-primary mb-4">Host an Event for Meow Rescue</h2>
          <p className="text-gray-700 mb-6">
            Interested in hosting a fundraiser, adoption event, or awareness event for Meow Rescue? We appreciate community support and would love to work with you!
          </p>
          <Button 
            asChild
            variant="meow"
            className="inline-flex items-center"
          >
            <Link to="/contact">Contact Us to Discuss</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
