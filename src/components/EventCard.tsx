
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '@/types/events';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { id, title, date, time, location, description, imageUrl } = event;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-meow-primary mb-2">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-meow-secondary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-meow-secondary" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-meow-secondary" />
            <span>{location}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
        
        <Button 
          asChild
          variant="meow" 
          className="w-full"
        >
          <Link to={`/events/${id}`}>
            Event Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
