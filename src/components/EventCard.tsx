
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '../types/events';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="flex-grow p-5">
        <h3 className="text-xl font-bold mb-2 text-meow-primary">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <p className="text-gray-600 line-clamp-3">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Button asChild variant="meowOutline" className="w-full">
          <Link to={`/events/${event.id}`}>Event Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
