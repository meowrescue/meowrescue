
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventsOverview = () => {
  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gt('date_start', new Date().toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
        <Link 
          to="/admin/events" 
          className="text-sm text-meow-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="text-sm text-gray-500 mb-4">
          You have <span className="font-semibold text-meow-primary">{upcomingEvents || 0}</span> upcoming events
        </div>
        <Link
          to="/admin/events"
          className="w-full inline-flex justify-center items-center gap-2 bg-meow-primary/10 text-meow-primary font-medium rounded-lg px-4 py-2 hover:bg-meow-primary/20 transition-colors"
        >
          <CalendarIcon className="h-4 w-4" /> Manage Events
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventsOverview;
